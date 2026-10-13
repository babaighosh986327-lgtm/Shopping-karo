import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Share2, 
  Plus, 
  Minus,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { products, selectedProductId, navigateTo, toggleWishlist, isInWishlist } = useStore();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedVarIndex, setSelectedVarIndex] = useState(product?.defaultColorIndex || 0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');

  // Reset variation when product changes
  useEffect(() => {
    if (product) {
      setSelectedVarIndex(product.defaultColorIndex || 0);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProductId, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold">Product Not Found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const activeVariation = product.variations[selectedVarIndex] || product.variations[0];
  const isWishlisted = isInWishlist(product.id);

  // Active pricing
  const currentPrice = activeVariation.price ?? product.price;
  const currentSalePrice = activeVariation.salePrice ?? product.salePrice;
  const hasSale = currentSalePrice && currentSalePrice < currentPrice;
  const discountPercent = hasSale ? Math.round(((currentPrice - currentSalePrice!) / currentPrice) * 100) : 0;

  // Images for this variation
  const galleryImages = activeVariation.images.length > 0 ? activeVariation.images : [
    'https://images.unsplash.com/photo-1591561954557-26941169b49e'
  ];
  const mainImage = galleryImages[activeImageIndex] || galleryImages[0];

  const handleSelectColor = (index: number) => {
    setSelectedVarIndex(index);
    setActiveImageIndex(0);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (activeVariation.stock <= 0) return;
    addToCart(product, activeVariation, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (activeVariation.stock <= 0) return;
    addToCart(product, activeVariation, quantity);
    navigateTo('checkout');
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.isBestseller))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8A8175] mb-6">
        <button onClick={() => navigateTo('home')} className="hover:text-[#1C1917]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop', null, product.categoryId)} className="hover:text-[#1C1917]">
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-[#1C1917] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[620px] pb-2 sm:pb-0 scrollbar-none flex-shrink-0">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-18 h-22 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#F6F2EC] ${
                  activeImageIndex === idx 
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs' 
                    : 'border-transparent hover:border-[#D8CCB5]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Large Main Showcase Image */}
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-[#F6F2EC] aspect-4/5 border border-[#E8DFC9] shadow-xs group">
            <img
              src={mainImage}
              alt={`${product.name} in ${activeVariation.colorName}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasSale && (
                <span className="bg-[#1C1917] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Save {discountPercent}%
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-[#FAF8F5]/90 text-[#856514] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-xs">
                  Atelier Bestseller
                </span>
              )}
            </div>

            {/* Floating Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                isWishlisted 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'bg-white/90 hover:bg-white text-[#4A4238] hover:text-rose-600'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Product Purchasing & Specifications */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B38E46] font-semibold">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-stone-900">{product.rating.toFixed(1)}</span>
                <span className="text-[#8A8175]">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] leading-tight">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-3 pt-1">
              {hasSale ? (
                <>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                    ${currentSalePrice}
                  </span>
                  <span className="text-base text-[#8A8175] line-through font-sans">
                    ${currentPrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Save ${currentPrice - currentSalePrice!}
                  </span>
                </>
              ) : (
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  ${currentPrice}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#6B6155] leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            <div className="border-t border-[#E8DFC9] my-4" />

            {/* Color Variations Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4A4238] font-medium">
                  Leather Shade: <strong className="text-[#141414] font-semibold">{activeVariation.colorName}</strong>
                </span>
                <span className="text-[#8A8175] text-[11px] font-mono">
                  SKU: {activeVariation.sku}
                </span>
              </div>

              {/* Swatch Selector */}
              <div className="flex items-center gap-3">
                {product.variations.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectColor(idx)}
                    className={`relative w-8 h-8 rounded-full border transition-all ${
                      selectedVarIndex === idx 
                        ? 'ring-2 ring-[#B38E46] ring-offset-2 scale-110 shadow-sm' 
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={`${v.colorName} (${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})`}
                    aria-label={`Choose ${v.colorName}`}
                  >
                    {selectedVarIndex === idx && (
                      <span className="absolute inset-0 rounded-full border-2 border-white/60" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Status Indicator */}
            <div className="pt-2">
              {activeVariation.stock <= 0 ? (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>This variation is currently sold out. Please select another shade.</span>
                </div>
              ) : activeVariation.stock <= 5 ? (
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl flex items-center gap-2 border border-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Artisanal batch alert: Only <strong className="font-bold">{activeVariation.stock} pieces</strong> remaining in {activeVariation.colorName}.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-medium">In Stock • Ready for dispatch from Florence</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-3 space-y-3">
              <div className="flex gap-4 items-center">
                {/* Quantity */}
                <div className="flex items-center border border-[#D8CCB5] rounded-full bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || activeVariation.stock <= 0}
                    className="p-2 text-[#4A4238] hover:text-[#1C1917] disabled:opacity-30"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#1C1917]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(activeVariation.stock, quantity + 1))}
                    disabled={quantity >= activeVariation.stock || activeVariation.stock <= 0}
                    className="p-2 text-[#4A4238] hover:text-[#1C1917] disabled:opacity-30"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={activeVariation.stock <= 0}
                  className={`flex-1 py-4 px-6 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                    activeVariation.stock <= 0
                      ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                      : addedSuccess
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag • ${((hasSale ? currentSalePrice! : currentPrice) * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Express Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={activeVariation.stock <= 0}
                className="w-full py-3.5 px-6 rounded-full border-2 border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-40"
              >
                Buy Now with Express Concierge
              </button>
            </div>

            {/* Luxury Service Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8DFC9] text-center text-[11px] text-[#6B6155]">
              <div className="p-2 bg-[#F6F2EC] rounded-xl flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#B38E46]" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="p-2 bg-[#F6F2EC] rounded-xl flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#B38E46]" />
                <span>30-Day Effortless Returns</span>
              </div>
              <div className="p-2 bg-[#F6F2EC] rounded-xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#B38E46]" />
                <span>Authentic Lifetime Warranty</span>
              </div>
            </div>
          </div>

          {/* Accordion / Tabs for Specifications */}
          <div className="pt-6 border-t border-[#E8DFC9]">
            <div className="flex border-b border-[#E8DFC9] text-xs">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'details' 
                    ? 'border-[#D4AF37] text-[#1C1917]' 
                    : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
                }`}
              >
                Description & Fit
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'materials' 
                    ? 'border-[#D4AF37] text-[#1C1917]' 
                    : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
                }`}
              >
                Artisanal Materials
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'shipping' 
                    ? 'border-[#D4AF37] text-[#1C1917]' 
                    : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
                }`}
              >
                Care & Packaging
              </button>
            </div>

            <div className="py-4 text-xs text-[#6B6155] leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F2ECE1]">
                    <div>
                      <span className="text-[#8A8175] block">Dimensions:</span>
                      <strong className="text-[#1C1917]">{product.dimensions}</strong>
                    </div>
                    <div>
                      <span className="text-[#8A8175] block">Origin:</span>
                      <strong className="text-[#1C1917]">Handcrafted in Tuscany, Italy</strong>
                    </div>
                  </div>
                  {product.features && (
                    <ul className="list-disc pl-4 space-y-1 text-[#4A4238] pt-1">
                      {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-2">
                  <p>
                    <strong>Primary Leather:</strong> {product.material}
                  </p>
                  <p>
                    <strong>Hardware:</strong> Solid jeweler-grade brass electroplated with our proprietary 18K champagne gold finish to prevent tarnishing and oxidation.
                  </p>
                  <p>
                    <strong>Interior Sanctuary:</strong> Lined with Italian micro-suede tailored to cushion smartphones, sunglasses, and delicate accessories.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>{product.careInstructions || 'Avoid extreme moisture and heat. Clean gently with microfiber cloth.'}</p>
                  <p>
                    <strong>Packaging:</strong> Arrives in our signature matte ivory rigid keepsake box with gold foil logo, wrapped in pure mulberry silk tissue paper and accompanied by a numbered certificate of authenticity.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#E8DFC9]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
              Curated Harmonies
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#141414] mt-1">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
