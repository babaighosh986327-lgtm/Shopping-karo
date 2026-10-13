import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  Check, 
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#1C1C1E', family: 'black' },
  { name: 'Beige & Cream', hex: '#E5D3B3', family: 'beige' },
  { name: 'Cognac & Tan', hex: '#9E5B32', family: 'brown' },
  { name: 'Rose & Blush', hex: '#E8B4B8', family: 'rose' },
  { name: 'Emerald', hex: '#1B4D3E', family: 'green' },
  { name: 'Bordeaux Plum', hex: '#581845', family: 'burgundy' },
];

export const ShopPage: React.FC = () => {
  const { products, categories, selectedCategorySlug, navigateTo } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug || 'all');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync category if prop changed
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.active) return false;

      // Category filter
      if (activeCategory === 'bestsellers') {
        if (!product.isBestseller) return false;
      } else if (activeCategory === 'new-arrivals') {
        if (!product.isNewArrival) return false;
      } else if (activeCategory !== 'all') {
        const cat = categories.find(c => c.slug === activeCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        const matchesColor = product.variations.some(v => v.colorName.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesColor) return false;
      }

      // Price filter
      const effectivePrice = product.salePrice ?? product.price;
      if (effectivePrice > priceMax) return false;

      // In stock only filter
      if (inStockOnly) {
        const totalStock = product.variations.reduce((sum, v) => sum + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      // Color filter
      if (selectedColorFamily) {
        const matchesColor = product.variations.some(v => {
          const colorName = v.colorName.toLowerCase();
          switch (selectedColorFamily) {
            case 'black': return colorName.includes('noir') || colorName.includes('black') || colorName.includes('onyx');
            case 'beige': return colorName.includes('beige') || colorName.includes('champagne') || colorName.includes('cream') || colorName.includes('ivory') || colorName.includes('taupe');
            case 'brown': return colorName.includes('cognac') || colorName.includes('tan') || colorName.includes('caramel') || colorName.includes('biscotti');
            case 'rose': return colorName.includes('rose') || colorName.includes('blush') || colorName.includes('pearl');
            case 'green': return colorName.includes('emerald') || colorName.includes('olive') || colorName.includes('green');
            case 'burgundy': return colorName.includes('bordeaux') || colorName.includes('plum') || colorName.includes('wine');
            default: return true;
          }
        });
        if (!matchesColor) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      switch (sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'rating': return b.rating - a.rating;
        case 'newest': return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, categories, activeCategory, searchQuery, priceMax, inStockOnly, selectedColorFamily, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedColorFamily(null);
    setPriceMax(1000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery !== '' || selectedColorFamily !== null || priceMax < 1000 || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="border-b border-[#E8DFC9] pb-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
            The Atelier Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#141414] mt-1">
            {activeCategory === 'all' 
              ? 'Complete Handbag Collection' 
              : activeCategory === 'bestsellers' 
                ? 'Signature Bestsellers' 
                : activeCategory === 'new-arrivals' 
                  ? 'New Arrivals' 
                  : categories.find(c => c.slug === activeCategory)?.name || 'Handbags'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8175] mt-2 max-w-xl">
            Each silhouette is sculpted from certified full-grain Italian leathers and adorned with champagne gold accents.
          </p>
        </div>

        {/* Search in Shop */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F3EDE2] text-xs text-[#1C1917] pl-9 pr-8 py-2.5 rounded-full border border-transparent focus:border-[#D4AF37] focus:bg-white focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#8A8175] hover:text-[#1C1917]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
            <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B38E46]" />
              <span>Refine Pieces</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#B38E46] hover:underline font-medium"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#4A4238] font-bold mb-3">
              Silhouette
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeCategory === 'all' 
                    ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold' 
                    : 'text-[#6B6155] hover:bg-[#F4ECE1]'
                }`}
              >
                <span>All Handbags</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    activeCategory === cat.slug 
                      ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold' 
                      : 'text-[#6B6155] hover:bg-[#F4ECE1]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
              <button
                onClick={() => setActiveCategory('bestsellers')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeCategory === 'bestsellers' 
                    ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold' 
                    : 'text-[#992222] hover:bg-[#F4ECE1]'
                }`}
              >
                <span>Bestsellers</span>
              </button>
              <button
                onClick={() => setActiveCategory('new-arrivals')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeCategory === 'new-arrivals' 
                    ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold' 
                    : 'text-[#6B6155] hover:bg-[#F4ECE1]'
                }`}
              >
                <span>New Arrivals</span>
              </button>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pt-4 border-t border-[#E8DFC9]">
            <h4 className="text-xs uppercase tracking-widest text-[#4A4238] font-bold mb-3">
              Leather Shade
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = selectedColorFamily === col.family;
                return (
                  <button
                    key={col.family}
                    onClick={() => setSelectedColorFamily(isSelected ? null : col.family)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      isSelected 
                        ? 'border-[#B38E46] bg-[#F7F2E9] font-medium shadow-2xs' 
                        : 'border-[#E8DFC9] bg-white hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/15 flex-shrink-0" 
                      style={{ backgroundColor: col.hex }} 
                    />
                    <span className="truncate text-[11px] text-[#4A4238]">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-[#E8DFC9]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs uppercase tracking-widest text-[#4A4238] font-bold">
                Max Investment
              </h4>
              <span className="text-xs font-serif font-bold text-[#1C1917]">
                ${priceMax}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1000"
              step="25"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#B38E46] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A8175] mt-1">
              <span>$200</span>
              <span>$1,000</span>
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-4 border-t border-[#E8DFC9]">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#4A4238] select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#D8CCB5] text-[#1C1917] focus:ring-[#D4AF37] accent-[#1C1917]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Product Grid Container */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9] mb-6">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D8CCB5] text-xs font-medium text-[#1C1917]"
              >
                <Filter className="w-3.5 h-3.5 text-[#B38E46]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <p className="text-xs text-[#8A8175]">
                Displaying <strong className="text-[#1C1917] font-semibold">{filteredProducts.length}</strong> luxury handbags
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-[#8A8175]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-[#D8CCB5] rounded-xl px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Atelier Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[11px] text-[#8A8175]">Active Filters:</span>
              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#F4ECE1] text-[#1C1917] text-xs px-2.5 py-1 rounded-full border border-[#E8DFC9]">
                  <span>Category: {activeCategory}</span>
                  <button onClick={() => setActiveCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedColorFamily && (
                <span className="inline-flex items-center gap-1 bg-[#F4ECE1] text-[#1C1917] text-xs px-2.5 py-1 rounded-full border border-[#E8DFC9]">
                  <span>Color: {selectedColorFamily}</span>
                  <button onClick={() => setSelectedColorFamily(null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceMax < 1000 && (
                <span className="inline-flex items-center gap-1 bg-[#F4ECE1] text-[#1C1917] text-xs px-2.5 py-1 rounded-full border border-[#E8DFC9]">
                  <span>Under ${priceMax}</span>
                  <button onClick={() => setPriceMax(1000)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-[#F4ECE1] text-[#1C1917] text-xs px-2.5 py-1 rounded-full border border-[#E8DFC9]">
                  <span>In Stock</span>
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#B38E46] hover:underline font-medium ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DFC9] p-12 text-center my-8">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-4 text-[#A39077]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#141414] mb-2">
                No Handbags Match Your Criteria
              </h3>
              <p className="text-xs text-[#8A8175] max-w-sm mx-auto mb-6">
                Try widening your price range, choosing another leather hue, or clearing active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#B38E46] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D8CCB5] text-[#1C1917] text-xs font-semibold uppercase tracking-widest transition-all shadow-xs hover:border-[#D4AF37]"
                  >
                    Load More Handbags ({filteredProducts.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setMobileFilterOpen(false)} 
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#4A4238]" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#4A4238] font-bold mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`block w-full text-left py-1 text-xs ${activeCategory === 'all' ? 'font-bold text-[#B38E46]' : 'text-[#6B6155]'}`}
                  >
                    All Handbags
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.slug)}
                      className={`block w-full text-left py-1 text-xs ${activeCategory === c.slug ? 'font-bold text-[#B38E46]' : 'text-[#6B6155]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="pt-4 border-t border-[#E8DFC9]">
                <h4 className="text-xs uppercase tracking-widest text-[#4A4238] font-bold mb-2">Color</h4>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.family}
                      onClick={() => setSelectedColorFamily(selectedColorFamily === c.family ? null : c.family)}
                      className={`p-1.5 border rounded-lg text-[11px] text-left truncate flex items-center gap-1.5 ${
                        selectedColorFamily === c.family ? 'border-[#B38E46] bg-[#F7F2E9]' : 'border-[#E8DFC9] bg-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-[#E8DFC9]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">Max Price</span>
                  <span className="font-bold">${priceMax}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="25"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#B38E46]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFC9]">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#1C1917] text-[#FAF8F5] rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
