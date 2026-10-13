import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  ExternalLink, 
  Check, 
  X, 
  RefreshCw, 
  Sliders, 
  Sparkles,
  Layers,
  Truck,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductVariation, Order, OrderStatus, PaymentStatus } from '../types';

export const AdminPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { 
    products, 
    orders, 
    categories, 
    settings, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    seedInitialData,
    updateOrderStatus,
    updatePaymentStatus,
    updateSettings,
    navigateTo 
  } = useStore();

  const { currentUser, isAdmin, isSimulatingAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');

  // Product Filter & Search
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');

  // Order Filter & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  // Add/Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 450,
    salePrice: 0,
    categoryId: categories[0]?.id || 'cat-shoulder',
    categoryName: categories[0]?.name || 'Shoulder Bags',
    material: '100% Full-Grain Italian Calfskin',
    dimensions: '28 cm × 18 cm × 10 cm',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    active: true,
    variations: [
      {
        id: 'var-1',
        colorName: 'Noir Caviar',
        colorHex: '#18181B',
        sku: 'LXB-001-BLK',
        stock: 12,
        price: 450,
        images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80']
      }
    ] as ProductVariation[]
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Access Control Guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#141414] mb-2">
          Administrator Authorization Required
        </h2>
        <p className="text-xs text-[#8A8175] mb-6 leading-relaxed">
          Access to store inventory, financial logs, and product configuration is strictly restricted to authorized administrators (<code className="text-[#1C1917] font-mono">bg5684017@gmail.com</code>).
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-all"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  // Metric Computations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : o.totalAmount), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalProductsCount = products.length;
  
  // Low Stock Items (variations with stock <= 5)
  const lowStockVariations = products.flatMap(p => 
    p.variations.filter(v => v.stock <= 5).map(v => ({
      product: p,
      variation: v
    }))
  );

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedProductCategory === 'all' || p.categoryId === selectedProductCategory;
    const matchesSearch = productSearch === '' || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.variations.some(v => v.sku.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch = orderSearch === '' || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      shortDescription: prod.shortDescription,
      price: prod.price,
      salePrice: prod.salePrice || 0,
      categoryId: prod.categoryId,
      categoryName: prod.categoryName,
      material: prod.material,
      dimensions: prod.dimensions,
      isFeatured: prod.isFeatured,
      isBestseller: prod.isBestseller,
      isNewArrival: prod.isNewArrival,
      active: prod.active,
      variations: JSON.parse(JSON.stringify(prod.variations))
    });
    setIsProductModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 480,
      salePrice: 0,
      categoryId: categories[0]?.id || 'cat-shoulder',
      categoryName: categories[0]?.name || 'Shoulder Bags',
      material: '100% Full-Grain Italian Calfskin',
      dimensions: '28 cm × 18 cm × 10 cm',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      active: true,
      variations: [
        {
          id: 'var-' + Date.now(),
          colorName: 'Noir Caviar',
          colorHex: '#18181B',
          sku: 'LXB-NEW-01',
          stock: 10,
          price: 480,
          images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80']
        }
      ]
    });
    setIsProductModalOpen(true);
  };

  // Add variation row
  const handleAddVariationRow = () => {
    const newVar: ProductVariation = {
      id: 'var-' + Date.now() + Math.random().toString(36).substring(7),
      colorName: 'Champagne Gold',
      colorHex: '#D4AF37',
      sku: `LXB-${Math.floor(100 + Math.random() * 900)}-GLD`,
      stock: 8,
      price: productForm.price,
      images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80']
    };
    setProductForm(prev => ({
      ...prev,
      variations: [...prev.variations, newVar]
    }));
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === productForm.categoryId);

    const payload = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: productForm.description,
      shortDescription: productForm.shortDescription,
      price: Number(productForm.price),
      salePrice: productForm.salePrice > 0 ? Number(productForm.salePrice) : undefined,
      categoryId: productForm.categoryId,
      categoryName: cat?.name || productForm.categoryName,
      material: productForm.material,
      dimensions: productForm.dimensions,
      isFeatured: productForm.isFeatured,
      isBestseller: productForm.isBestseller,
      isNewArrival: productForm.isNewArrival,
      active: productForm.active,
      rating: 5.0,
      reviewsCount: 1,
      defaultColorIndex: 0,
      variations: productForm.variations
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
    } else {
      await addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // Seed default data
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedSuccess(false);
    try {
      await seedInitialData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      alert('Seeding error: ' + err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC9] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B38E46] font-bold">
              Atelier Management Console
            </span>
            {isSimulatingAdmin && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                Simulated Admin Mode
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mt-1">
            Storefront Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D8CCB5] text-xs font-semibold text-[#1C1917] flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#B38E46] ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Seeding Firestore...' : seedSuccess ? 'Database Seeded!' : 'Seed Luxury Catalog'}</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            View Live Store
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#E8DFC9] mb-8 text-xs font-semibold tracking-wider uppercase overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'border-[#D4AF37] text-[#1C1917]' : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#B38E46]" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products' ? 'border-[#D4AF37] text-[#1C1917]' : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#B38E46]" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'border-[#D4AF37] text-[#1C1917]' : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#B38E46]" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings' ? 'border-[#D4AF37] text-[#1C1917]' : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#B38E46]" />
          <span>Store Settings & Banners</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-[#8A8175] font-semibold">Total Revenue</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-bold text-[#1C1917]">${totalRevenue}</span>
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-[#8A8175] font-semibold">Total Orders</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-bold text-[#1C1917]">{totalOrders}</span>
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-[#8A8175] font-semibold">Avg Order Value</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-bold text-[#1C1917]">${avgOrderValue}</span>
                <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-[#8A8175] font-semibold">Active Silhouettes</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-bold text-[#1C1917]">{totalProductsCount}</span>
                <span className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#856514] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFC9] shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider text-[#8A8175] font-semibold">Low Stock Warnings</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="font-serif text-3xl font-bold text-rose-600">{lowStockVariations.length}</span>
                <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Low Stock Alert Table */}
          {lowStockVariations.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-xl font-bold text-[#141414]">
                  Low Inventory Variations (Order Urgent Restock)
                </h3>
              </div>
              <div className="divide-y divide-[#F2ECE1]">
                {lowStockVariations.slice(0, 5).map(({ product, variation }) => (
                  <div key={variation.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: variation.colorHex }} />
                      <div>
                        <strong className="text-[#1C1917] font-semibold">{product.name}</strong>
                        <span className="text-[#8A8175] ml-1">({variation.colorName} • SKU: {variation.sku})</span>
                      </div>
                    </div>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      {variation.stock} units remaining
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8DFC9] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-[#141414]">
                Recent Customer Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#B38E46] hover:underline font-semibold"
              >
                View All {orders.length} Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#8A8175] py-4">No customer orders placed yet. Place a test checkout on the storefront to test!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#4A4238] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5]">
                        <td className="p-3 font-mono font-bold text-[#B38E46]">{o.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-semibold text-[#1C1917]">{o.customerName}</p>
                          <p className="text-[11px] text-[#8A8175]">{o.customerEmail}</p>
                        </td>
                        <td className="p-3 text-[#8A8175]">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-serif font-bold text-sm text-[#1C1917]">${o.totalAmount}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveOrderModal(o)}
                            className="px-3 py-1 bg-white hover:bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg text-[11px] font-semibold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Product Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8DFC9]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-2.5" />
              </div>

              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value)}
                className="bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Handbag</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#4A4238] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Handbag</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">Color Variations</th>
                    <th className="p-4">Total Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filteredProducts.map(p => {
                    const totalStock = p.variations.reduce((sum, v) => sum + v.stock, 0);
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/80">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.variations[0]?.images[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e'}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-lg bg-[#FAF8F5] border border-[#E8DFC9]"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#1C1917]">{p.name}</h4>
                            <p className="text-[11px] text-[#8A8175] font-mono">{p.slug}</p>
                          </div>
                        </td>
                        <td className="p-4 text-[#4A4238]">{p.categoryName}</td>
                        <td className="p-4 font-serif font-bold text-sm text-[#1C1917]">
                          ${p.price}
                          {p.salePrice && <span className="text-xs text-rose-600 block">Sale: ${p.salePrice}</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {p.variations.map((v, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-full border border-black/15"
                                style={{ backgroundColor: v.colorHex }}
                                title={`${v.colorName} (${v.stock} in stock)`}
                              />
                            ))}
                            <span className="text-[11px] text-[#8A8175] ml-1">
                              ({p.variations.length} shades)
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${totalStock <= 5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {totalStock} units
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updateProduct(p.id, { active: !p.active })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {p.active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 bg-white hover:bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg text-[#1C1917]"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg text-rose-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8DFC9]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search by Order #, Customer Name, or Email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-2.5" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs text-[#1C1917]"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-2xs">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#8A8175]">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#4A4238] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5]/80">
                        <td className="p-4 font-mono font-bold text-[#B38E46]">{o.orderNumber}</td>
                        <td className="p-4">
                          <p className="font-semibold text-[#1C1917]">{o.customerName}</p>
                          <p className="text-[11px] text-[#8A8175]">{o.customerEmail}</p>
                          <p className="text-[10px] text-[#8A8175]">{o.customerPhone}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {o.items.slice(0, 3).map((item, i) => (
                              <img key={i} src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded" />
                            ))}
                            <span className="text-[11px] text-[#8A8175] ml-1">{o.items.length} items</span>
                          </div>
                        </td>
                        <td className="p-4 font-serif font-bold text-sm text-[#1C1917]">${o.totalAmount}</td>
                        <td className="p-4">
                          <span className="uppercase text-[11px] font-semibold text-[#1C1917]">
                            {o.paymentMethod.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-emerald-700 block">({o.paymentStatus})</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            o.orderStatus === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-800' 
                              : o.orderStatus === 'Shipped' 
                                ? 'bg-blue-50 text-blue-800' 
                                : 'bg-amber-50 text-amber-800'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setActiveOrderModal(o)}
                            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D8CCB5] rounded-xl text-xs font-semibold text-[#1C1917]"
                          >
                            Manage Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Store Settings & Banners */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFC9] shadow-2xs max-w-2xl">
          <h3 className="font-serif text-2xl font-bold text-[#141414] pb-3 border-b border-[#F2ECE1]">
            Global Storefront Settings
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 pt-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4A4238] mb-1">Brand Store Name</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A4238] mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settingsForm.announcementBarText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarText: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A4238] mb-1">Hero Banner Title</label>
              <input
                type="text"
                value={settingsForm.bannerTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, bannerTitle: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A4238] mb-1">Hero Banner Subtitle</label>
              <textarea
                rows={2}
                value={settingsForm.bannerSubtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, bannerSubtitle: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A4238] mb-1">Hero Banner Image URL</label>
              <input
                type="text"
                value={settingsForm.bannerImageUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, bannerImageUrl: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#4A4238] mb-1">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#4A4238] mb-1">Standard Delivery Fee ($)</label>
                <input
                  type="number"
                  value={settingsForm.standardShippingFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-colors shadow-md flex items-center gap-2"
              >
                {settingsSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Settings Saved to Firestore!</span>
                  </>
                ) : (
                  <span>Save Store Settings</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC9] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                {editingProductId ? 'Edit Handbag' : 'Add New Handbag'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-[#4A4238]" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A4238] mb-1">Handbag Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4238] mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => {
                      const c = categories.find(cat => cat.id === e.target.value);
                      setProductForm({ ...productForm, categoryId: e.target.value, categoryName: c?.name || '' });
                    }}
                    className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4238] mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4238] mb-1">Sale Price ($) (Optional)</label>
                  <input
                    type="number"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A4238] mb-1">Short Description</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A4238] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-white border border-[#D8CCB5] rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              {/* Multi-Color Variations Builder */}
              <div className="pt-4 border-t border-[#E8DFC9]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                    Color Variations & Inventory
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariationRow}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D8CCB5] text-[11px] font-semibold text-[#1C1917] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-[#B38E46]" />
                    <span>Add Color Variation</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {productForm.variations.map((v, idx) => (
                    <div key={v.id || idx} className="bg-white p-3.5 rounded-2xl border border-[#E8DFC9] space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-[#8A8175] block">Color Name</label>
                          <input
                            type="text"
                            value={v.colorName}
                            onChange={(e) => {
                              const updated = [...productForm.variations];
                              updated[idx].colorName = e.target.value;
                              setProductForm({ ...productForm, variations: updated });
                            }}
                            className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#8A8175] block">Hex Color Code</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={v.colorHex}
                              onChange={(e) => {
                                const updated = [...productForm.variations];
                                updated[idx].colorHex = e.target.value;
                                setProductForm({ ...productForm, variations: updated });
                              }}
                              className="w-6 h-6 rounded border cursor-pointer p-0"
                            />
                            <input
                              type="text"
                              value={v.colorHex}
                              onChange={(e) => {
                                const updated = [...productForm.variations];
                                updated[idx].colorHex = e.target.value;
                                setProductForm({ ...productForm, variations: updated });
                              }}
                              className="flex-1 bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg px-2 py-1.5 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-[#8A8175] block">SKU Code</label>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const updated = [...productForm.variations];
                              updated[idx].sku = e.target.value;
                              setProductForm({ ...productForm, variations: updated });
                            }}
                            className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#8A8175] block">Stock Qty</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => {
                                const updated = [...productForm.variations];
                                updated[idx].stock = Number(e.target.value);
                                setProductForm({ ...productForm, variations: updated });
                              }}
                              className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            {productForm.variations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = productForm.variations.filter((_, i) => i !== idx);
                                  setProductForm({ ...productForm, variations: updated });
                                }}
                                className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#8A8175] block">Photo URL (Separate multiple with commas)</label>
                        <input
                          type="text"
                          value={v.images.join(', ')}
                          onChange={(e) => {
                            const updated = [...productForm.variations];
                            updated[idx].images = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setProductForm({ ...productForm, variations: updated });
                          }}
                          className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span>Product is Active in Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DFC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D8CCB5] text-xs font-semibold text-[#1C1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider"
                >
                  Save Handbag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status & Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B38E46] font-bold">Admin Order Editor</span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">{activeOrderModal.orderNumber}</h3>
              </div>
              <button onClick={() => setActiveOrderModal(null)}>
                <X className="w-5 h-5 text-[#4A4238]" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Status Update Form */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] space-y-3">
                <h4 className="font-semibold text-sm text-[#1C1917]">Update Fulfillment & Payment Status</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8A8175] block mb-1">Order Status</label>
                    <select
                      value={activeOrderModal.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value as OrderStatus;
                        await updateOrderStatus(activeOrderModal.id, newStatus);
                        setActiveOrderModal({ ...activeOrderModal, orderStatus: newStatus });
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#8A8175] block mb-1">Payment Status</label>
                    <select
                      value={activeOrderModal.paymentStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value as PaymentStatus;
                        await updatePaymentStatus(activeOrderModal.id, newStatus);
                        setActiveOrderModal({ ...activeOrderModal, paymentStatus: newStatus });
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="cod_pending">COD Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#8A8175] block mb-1">Courier Tracking Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. VIP-FEDEX-948271"
                      defaultValue={activeOrderModal.trackingNumber || ''}
                      id="tracking-input"
                      className="flex-1 bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs font-mono"
                    />
                    <button
                      onClick={async () => {
                        const val = (document.getElementById('tracking-input') as HTMLInputElement)?.value;
                        await updateOrderStatus(activeOrderModal.id, activeOrderModal.orderStatus, val);
                        setActiveOrderModal({ ...activeOrderModal, trackingNumber: val });
                        alert('Tracking code updated!');
                      }}
                      className="px-4 py-2 bg-[#1C1917] text-white rounded-xl text-xs font-semibold"
                    >
                      Save Tracking
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] space-y-1">
                <h4 className="font-semibold text-sm text-[#1C1917]">Customer & Shipping Address</h4>
                <p><strong>Name:</strong> {activeOrderModal.customerName}</p>
                <p><strong>Email:</strong> {activeOrderModal.customerEmail}</p>
                <p><strong>Phone:</strong> {activeOrderModal.customerPhone}</p>
                <p><strong>Address:</strong> {activeOrderModal.shippingAddress.street}, {activeOrderModal.shippingAddress.city}, {activeOrderModal.shippingAddress.state} {activeOrderModal.shippingAddress.postalCode}, {activeOrderModal.shippingAddress.country}</p>
                {activeOrderModal.notes && <p><strong>Delivery Notes:</strong> {activeOrderModal.notes}</p>}
              </div>

              {/* Items List */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC9] space-y-2">
                <h4 className="font-semibold text-sm text-[#1C1917]">Ordered Items ({activeOrderModal.items.length})</h4>
                <div className="divide-y divide-[#F2ECE1]">
                  {activeOrderModal.items.map((i, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={i.image} alt={i.name} className="w-10 h-12 object-cover rounded" />
                        <div>
                          <p className="font-semibold text-[#1C1917]">{i.name}</p>
                          <p className="text-[11px] text-[#8A8175]">{i.colorName} • SKU: {i.sku} • Qty: {i.quantity}</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm">${i.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t text-right font-serif text-base font-bold text-[#1C1917]">
                  Total: ${activeOrderModal.totalAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
