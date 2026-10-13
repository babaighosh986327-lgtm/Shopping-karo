import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    items, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    discount, 
    shippingFee, 
    total, 
    couponCode, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const { navigateTo, settings } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 250;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E8DFC9]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8DFC9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B38E46]" />
              <h2 className="font-serif text-2xl font-bold text-[#141414]">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 text-[#4A4238] hover:text-[#B38E46] transition-colors rounded-full hover:bg-[#FAF8F5]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="bg-[#F4ECE1] px-6 py-3 border-b border-[#E8DFC9]">
            <div className="flex items-center justify-between text-xs text-[#4A4238] mb-1.5 font-medium">
              <span>
                {amountToFreeShipping > 0 ? (
                  <>Add <strong className="text-[#141414] font-bold">${amountToFreeShipping}</strong> for Complimentary VIP Shipping</>
                ) : (
                  <span className="text-[#1B4D3E] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Complimentary Express Shipping Unlocked!
                  </span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5D8C3] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#EFE7D8]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#F3EDE2] flex items-center justify-center mb-4 text-[#A39077]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#141414] mb-2">
                  Your Bag is Empty
                </h3>
                <p className="text-sm text-[#8A8175] max-w-xs mb-6">
                  Explore our curated Italian leather handbag collections and find your signature piece.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('shop');
                  }}
                  className="px-6 py-3 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#B38E46] transition-colors shadow-md"
                >
                  Discover Handbags
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variationId}`} className="py-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-xl bg-[#F6F2EC] border border-[#E8DFC9] flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-semibold text-[#1C1917] leading-tight">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variationId)}
                          className="text-[#A39077] hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Selected Color & SKU */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6B6155]">
                        <span 
                          className="w-3 h-3 rounded-full border border-black/10 inline-block" 
                          style={{ backgroundColor: item.colorHex }} 
                        />
                        <span>{item.colorName}</span>
                        <span className="text-[#A39077]">• SKU: {item.sku}</span>
                      </div>
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#D8CCB5] rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variationId, item.quantity - 1)}
                          className="p-1.5 text-[#4A4238] hover:bg-[#FAF8F5] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variationId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1.5 text-[#4A4238] hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-base font-bold text-[#1C1917]">
                          ${item.unitPrice * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-[#8A8175]">
                            ${item.unitPrice} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DFC9] space-y-4">
              
              {/* Promo code input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Promo <strong>{couponCode}</strong> applied (-${discount})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-emerald-700 underline hover:text-emerald-900"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. LUXE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] text-xs px-3 py-2 rounded-lg border border-[#D8CCB5] uppercase focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EAE3D2] border border-[#D8CCB5] text-xs font-semibold text-[#1C1917] rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B6155] border-t border-[#F2ECE1] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1C1917]">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C1917] pt-2 border-t border-[#F2ECE1]">
                  <span className="font-serif">Total</span>
                  <span className="font-serif">${total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('checkout');
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('cart');
                  }}
                  className="w-full py-2.5 px-6 rounded-full border border-[#D8CCB5] text-xs font-medium text-[#4A4238] hover:bg-[#FAF8F5] transition-colors"
                >
                  View Full Bag Details
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A8175] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B38E46]" />
                <span>Encrypted checkout • Complimentary returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
