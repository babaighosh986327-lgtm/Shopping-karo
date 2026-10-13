import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, navigateTo } = useStore();

  const [selectedVarIndex, setSelectedVarIndex] = useState(product.defaultColorIndex || 0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const activeVariation = product.variations[selectedVarIndex] || product.variations[0];
  const isWishlisted = isInWishlist(product.id);

  // Active prices (variation specific or base)
  const currentPrice = activeVariation?.price ?? product.price;
  const currentSalePrice = activeVariation?.salePrice ?? product.salePrice;
  const hasSale = currentSalePrice && currentSalePrice < currentPrice;
  const discountPercent = hasSale ? Math.round(((currentPrice - currentSalePrice!) / currentPrice) * 100) : 0;

  // Primary image and hover secondary image
  const primaryImage = activeVariation?.images[0] || 'https://images.unsplash.com/photo-1591561954557-26941169b49e';
  const secondaryImage = activeVariation?.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeVariation || activeVariation.stock <= 0) return;

    addToCart(product, activeVariation, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleColorClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedVarIndex(index);
  };

  return (
    <div 
      onClick={() => navigateTo('product-detail', product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EDE5D8] hover:border-[#D4AF37]/60 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-4/5 overflow-hidden bg-[#F6F2EC]">
        <img
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={`${product.name} in ${activeVariation.colorName}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasSale && (
            <span className="bg-[#1C1917] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#FAF8F5]/90 text-[#856514] text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#FAF8F5]/90 text-[#1C1917] text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-[#EDE5D8] shadow-xs">
              New Capsule
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 shadow-md' 
              : 'bg-white/80 hover:bg-white text-[#4A4238] hover:text-rose-600 shadow-xs'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={activeVariation.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 ${
              activeVariation.stock <= 0
                ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                : addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : activeVariation.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add • {activeVariation.colorName}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8A8175] mb-1">
            <span className="uppercase tracking-widest text-[10px] font-medium">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-stone-800 text-[11px]">{product.rating.toFixed(1)}</span>
              <span className="text-[#A39077] text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-[#1C1917] group-hover:text-[#B38E46] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Color Variation Swatches */}
          <div className="flex items-center gap-1.5 mt-3 mb-2">
            {product.variations.map((v, idx) => (
              <button
                key={v.id}
                onClick={(e) => handleColorClick(e, idx)}
                title={`${v.colorName} (${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})`}
                className={`relative w-4.5 h-4.5 rounded-full border transition-transform ${
                  selectedVarIndex === idx 
                    ? 'ring-2 ring-[#B38E46] ring-offset-1 scale-110' 
                    : 'border-black/10 hover:scale-105'
                }`}
                style={{ backgroundColor: v.colorHex }}
                aria-label={`Select color ${v.colorName}`}
              >
                {selectedVarIndex === idx && (
                  <span className="absolute inset-0 rounded-full border border-white/40" />
                )}
              </button>
            ))}
            <span className="text-[10px] text-[#8A8175] ml-1 font-sans">
              {activeVariation.colorName}
            </span>
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasSale ? (
              <>
                <span className="font-serif text-lg font-bold text-[#1C1917]">
                  ${currentSalePrice}
                </span>
                <span className="text-xs text-[#8A8175] line-through font-sans">
                  ${currentPrice}
                </span>
              </>
            ) : (
              <span className="font-serif text-lg font-bold text-[#1C1917]">
                ${currentPrice}
              </span>
            )}
          </div>

          <div>
            {activeVariation.stock <= 0 ? (
              <span className="text-[11px] text-rose-600 font-medium">Sold Out</span>
            ) : activeVariation.stock <= 5 ? (
              <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                Only {activeVariation.stock} left
              </span>
            ) : (
              <span className="text-[10px] text-emerald-700 font-medium">In Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
