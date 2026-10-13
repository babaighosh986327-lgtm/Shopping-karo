import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariation } from '../types';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variation: ProductVariation, quantity?: number) => void;
  updateQuantity: (productId: string, variationId: string, quantity: number) => void;
  removeFromCart: (productId: string, variationId: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number }> = {
  'LUXE10': { type: 'percent', value: 10 },
  'GOLD50': { type: 'flat', value: 50 },
  'WELCOME20': { type: 'percent', value: 20 },
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxebag_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem('luxebag_coupon') || '';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('luxebag_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('luxebag_coupon', couponCode);
    } else {
      localStorage.removeItem('luxebag_coupon');
    }
  }, [couponCode]);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (!currentUser) return;

    const syncWithFirebase = async () => {
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const snap = await getDoc(cartRef);
        if (snap.exists()) {
          const remoteItems = snap.data().items as CartItem[];
          if (remoteItems && remoteItems.length > 0 && items.length === 0) {
            setItems(remoteItems);
          } else if (items.length > 0) {
            await setDoc(cartRef, { userId: currentUser.uid, items, updatedAt: new Date().toISOString() });
          }
        } else if (items.length > 0) {
          await setDoc(cartRef, { userId: currentUser.uid, items, updatedAt: new Date().toISOString() });
        }
      } catch (err) {
        console.warn('Cart cloud sync skipped:', err);
      }
    };

    syncWithFirebase();
  }, [currentUser]);

  const addToCart = (product: Product, variation: ProductVariation, quantity = 1) => {
    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(
        i => i.productId === product.id && i.variationId === variation.id
      );

      const priceToUse = variation.salePrice ?? variation.price ?? product.salePrice ?? product.price;
      const variationImage = variation.images[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e';

      if (existingIdx > -1) {
        const existing = prevItems[existingIdx];
        const newQty = Math.min(existing.quantity + quantity, variation.stock);
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          maxStock: variation.stock,
          unitPrice: priceToUse
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variationId: variation.id,
          productName: product.name,
          colorName: variation.colorName,
          colorHex: variation.colorHex,
          sku: variation.sku,
          image: variationImage,
          unitPrice: priceToUse,
          quantity: Math.min(quantity, variation.stock),
          maxStock: variation.stock
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.productId === productId && item.variationId === variationId) {
        return { ...item, quantity: Math.min(quantity, item.maxStock) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, variationId: string) => {
    setItems(prev => prev.filter(item => !(item.productId === productId && item.variationId === variationId)));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (COUPONS[trimmed]) {
      setCouponCode(trimmed);
      return { success: true, message: `Promotional code ${trimmed} applied successfully!` };
    }
    return { success: false, message: 'Invalid or expired promotional code. Try LUXE10 or GOLD50.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  let discount = 0;
  if (couponCode && COUPONS[couponCode]) {
    const promo = COUPONS[couponCode];
    if (promo.type === 'percent') {
      discount = Math.round((subtotal * promo.value) / 100);
    } else {
      discount = Math.min(subtotal, promo.value);
    }
  }

  // Free shipping over $250
  const shippingFee = subtotal >= 250 || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
