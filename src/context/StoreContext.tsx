import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Category, Order, StoreSettings, OrderStatus, PaymentStatus, ProductVariation } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../data/initialProducts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  writeBatch,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export type AppView = 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'admin';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  loading: boolean;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // View Navigation
  currentView: AppView;
  selectedProductId: string | null;
  selectedCategorySlug: string | null;
  lastOrder: Order | null;
  navigateTo: (view: AppView, productId?: string | null, categorySlug?: string | null) => void;
  setLastOrder: (order: Order | null) => void;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedInitialData: () => Promise<void>;
  
  // Order Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;

  // Settings & Categories Actions
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('luxebag_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('luxebag_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const navigateTo = (view: AppView, productId: string | null = null, categorySlug: string | null = null) => {
    setCurrentView(view);
    if (productId !== undefined) setSelectedProductId(productId);
    if (categorySlug !== undefined) setSelectedCategorySlug(categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscribe to Products collection
  useEffect(() => {
    // If admin, can see all products; if public, query active products
    const productsQuery = isAdmin 
      ? collection(db, 'products')
      : query(collection(db, 'products'), where('active', '==', true));

    const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const prods = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setProducts(prods);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
      setLoading(false);
    }, (error) => {
      console.warn('Products onSnapshot error, falling back to initial catalog:', error);
      setProducts(INITIAL_PRODUCTS);
      setLoading(false);
    });

    // Subscribe to Categories collection
    const categoriesQuery = isAdmin
      ? collection(db, 'categories')
      : query(collection(db, 'categories'), where('active', '==', true));

    const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
        cats.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(cats);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }
    }, (error) => {
      console.warn('Categories onSnapshot error:', error);
      setCategories(INITIAL_CATEGORIES);
    });

    // Subscribe to StoreSettings
    const unsubSettings = onSnapshot(doc(db, 'storeSettings', 'general'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as StoreSettings);
      } else {
        setSettings(INITIAL_SETTINGS);
      }
    }, (error) => {
      console.warn('StoreSettings onSnapshot error:', error);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
    };
  }, [isAdmin]);

  // Subscribe to Orders securely: Only attach if admin or authenticated customer
  useEffect(() => {
    if (authLoading) return;

    let unsubOrders = () => {};

    if (isAdmin) {
      // Admin sees all orders
      const allOrdersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      unsubOrders = onSnapshot(allOrdersQuery, (snapshot) => {
        const ords = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        setOrders(ords);
      }, (error) => {
        console.warn('Admin orders onSnapshot notice:', error);
      });
    } else if (currentUser) {
      // Customer sees only their own orders
      const myOrdersQuery = query(
        collection(db, 'orders'), 
        where('customerId', '==', currentUser.uid)
      );
      unsubOrders = onSnapshot(myOrdersQuery, (snapshot) => {
        const ords = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        setOrders(ords);
      }, (error) => {
        console.warn('Customer orders onSnapshot notice:', error);
      });
    } else {
      // Guest: clear orders list
      setOrders([]);
    }

    return () => {
      unsubOrders();
    };
  }, [currentUser, isAdmin, authLoading]);

  // Seed default data into Firestore
  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, cat);
      }

      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        const prodRef = doc(db, 'products', prod.id);
        batch.set(prodRef, prod);
      }

      // Seed settings
      const settingsRef = doc(db, 'storeSettings', 'general');
      batch.set(settingsRef, INITIAL_SETTINGS);

      // Seed connection test doc
      const testRef = doc(db, 'test', 'connection');
      batch.set(testRef, { status: 'connected', updatedAt: new Date().toISOString() });

      await batch.commit();
      console.log('Database seeded successfully with luxury catalog!');
    } catch (err) {
      console.error('Error seeding data:', err);
      throw err;
    }
  };

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = 'prod-' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };
    await setDoc(doc(db, 'products', id), newProduct);
    return id;
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
    const ref = doc(db, 'products', id);
    await updateDoc(ref, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id));
  };

  // Place Order with inventory deduction
  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const id = 'ord-' + Date.now();
    const now = new Date().toISOString();
    const completeOrder: Order = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now
    };

    // Save order in Firestore
    await setDoc(doc(db, 'orders', id), completeOrder);

    // Deduct stock for each ordered item
    try {
      for (const item of orderData.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const updatedVariations = prod.variations.map(v => {
            if (v.id === item.variationId) {
              return { ...v, stock: Math.max(0, v.stock - item.quantity) };
            }
            return v;
          });
          await updateDoc(doc(db, 'products', prod.id), {
            variations: updatedVariations,
            updatedAt: now
          });
        }
      }
    } catch (stockErr) {
      console.warn('Inventory adjustment note:', stockErr);
    }

    setLastOrder(completeOrder);
    return completeOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string): Promise<void> => {
    const updatePayload: Record<string, any> = {
      orderStatus: status,
      updatedAt: new Date().toISOString()
    };
    if (trackingNumber !== undefined) {
      updatePayload.trackingNumber = trackingNumber;
    }
    await updateDoc(doc(db, 'orders', orderId), updatePayload);
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus): Promise<void> => {
    await updateDoc(doc(db, 'orders', orderId), {
      paymentStatus: status,
      updatedAt: new Date().toISOString()
    });
  };

  // Settings update
  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<void> => {
    await setDoc(doc(db, 'storeSettings', 'general'), {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  // Categories CRUD
  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<void> => {
    const id = 'cat-' + Date.now();
    await setDoc(doc(db, 'categories', id), { ...categoryData, id });
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<void> => {
    await updateDoc(doc(db, 'categories', id), categoryData);
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'categories', id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      orders,
      settings,
      loading,
      wishlist,
      toggleWishlist,
      isInWishlist,
      currentView,
      selectedProductId,
      selectedCategorySlug,
      lastOrder,
      navigateTo,
      setLastOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      seedInitialData,
      placeOrder,
      updateOrderStatus,
      updatePaymentStatus,
      updateSettings,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
