import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
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

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-[#F3EDE2] flex items-center justify-center mx-auto mb-6 text-[#A39077]">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-[#8A8175] max-w-md mx-auto mb-8">
          You haven't selected any handbags yet. Discover our curated Italian leather collection and select your signature shade.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-4 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2"
        >
          <span>Discover Handbags</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC9] mb-8 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
            Atelier Order Preview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mt-1">
            Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="text-xs text-[#6B6155] hover:text-[#1C1917] flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-[#F4ECE1] p-4 rounded-2xl border border-[#E8DFC9]">
            <div className="flex items-center justify-between text-xs text-[#4A4238] mb-2 font-medium">
              <span>
                {amountToFreeShipping > 0 ? (
                  <>Add <strong className="text-[#141414] font-bold">${amountToFreeShipping}</strong> more to qualify for Complimentary VIP Express Shipping</>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Complimentary VIP Express Shipping Included!
                  </span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5D8C3] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] divide-y divide-[#F2ECE1] overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variationId}`} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-24 h-28 object-cover rounded-2xl bg-[#F6F2EC] border border-[#E8DFC9] flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      {item.productName}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.productId, item.variationId)}
                      className="text-[#8A8175] hover:text-rose-600 transition-colors p-1"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B6155] pt-0.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block" 
                      style={{ backgroundColor: item.colorHex }} 
                    />
                    <span className="font-medium text-[#1C1917]">{item.colorName}</span>
                    <span className="text-[#8A8175] font-mono text-[11px]">• SKU: {item.sku}</span>
                  </div>

                  <p className="text-xs text-[#8A8175] pt-1">
                    Unit Price: <span className="font-semibold text-[#1C1917]">${item.unitPrice}</span>
                  </p>
                </div>

                {/* Quantity Controls & Line Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-[#D8CCB5] rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variationId, item.quantity - 1)}
                      className="p-2 text-[#4A4238] hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#1C1917]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variationId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-2 text-[#4A4238] hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-[#1C1917]">
                      ${item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-[#8A8175]">
            <button
              onClick={clearCart}
              className="text-rose-600 hover:underline"
            >
              Clear Entire Bag
            </button>
            <span>Bespoke presentation packaging and silk dust cover included</span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs space-y-6 sticky top-24">
            <h2 className="font-serif text-2xl font-bold text-[#141414] pb-3 border-b border-[#F2ECE1]">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                Promotional Code or Gift Card
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <strong>{couponCode}</strong> applied (-${discount})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 underline hover:text-emerald-900 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. LUXE10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-[#FAF8F5] text-xs px-3.5 py-2.5 rounded-xl border border-[#D8CCB5] uppercase focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && (
                <p className={`text-[11px] mt-1.5 ${couponFeedback.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {couponFeedback.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#6B6155] border-t border-[#F2ECE1] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1917]">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>VIP Express Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">Complimentary</strong> : `$${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Complimentary Silk Gift Box</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#1C1917] pt-4 border-t border-[#F2ECE1]">
                <span className="font-serif">Total</span>
                <span className="font-serif">${total}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 px-6 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-[#8A8175]">
                <ShieldCheck className="w-4 h-4 text-[#B38E46]" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
              <p className="text-[11px] text-[#A39077]">
                We accept Visa, Mastercard, American Express, Apple Pay, and Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
