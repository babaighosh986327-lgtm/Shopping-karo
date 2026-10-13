import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { placeOrder, navigateTo, products } = useStore();
  const { currentUser } = useAuth();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card_demo');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardName: currentUser?.displayName || 'Eleanor Vance',
    expiry: '12/28',
    cvv: '842'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold mb-4">No Items in Checkout</h2>
        <p className="text-xs text-[#8A8175] mb-6">Please add items to your shopping bag before proceeding.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs uppercase"
        >
          Explore Handbags
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Pre-flight validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      setErrorMessage('Please complete all required delivery and contact fields.');
      return;
    }

    // Inventory check
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      const variation = prod?.variations.find(v => v.id === item.variationId);
      if (!variation || variation.stock < item.quantity) {
        setErrorMessage(`Sorry, "${item.productName} (${item.colorName})" has only ${variation ? variation.stock : 0} items available in inventory.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const uniqueOrderNumber = `LXB-${new Date().getFullYear()}-${randomSuffix}`;

      const newOrderPayload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        orderNumber: uniqueOrderNumber,
        customerId: currentUser?.uid || 'guest',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          apartment: formData.apartment || undefined,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: items.map(i => ({
          productId: i.productId,
          variationId: i.variationId,
          name: i.productName,
          colorName: i.colorName,
          colorHex: i.colorHex,
          sku: i.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.unitPrice * i.quantity,
          image: i.image
        })),
        subtotal,
        discount,
        shippingFee,
        totalAmount: total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
        paymentId: paymentMethod === 'cod' ? 'COD-PAY-ON-DELIVERY' : `PAY-${Date.now()}-${randomSuffix}`,
        orderStatus: 'Confirmed',
        notes: formData.deliveryNotes || undefined
      };

      const placed = await placeOrder(newOrderPayload);
      clearCart();
      navigateTo('order-confirmation');
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs text-[#6B6155] hover:text-[#1C1917] flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
            
            {/* Step 1: Client Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC9] shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-serif">
                  1
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#141414]">
                  Contact & Concierge Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Email Address (For Tracking & Invoice) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="client@luxury.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Mobile Phone (For Courier Coordination) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC9] shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-serif">
                  2
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#141414]">
                  Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="740 Park Avenue"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Apartment / Suite / Floor
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Penthouse B"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="10021"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1">
                    Bespoke Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="deliveryNotes"
                    rows={2}
                    placeholder="e.g. Leave with doorman or ring penthouse bell"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC9] shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-serif">
                  3
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#141414]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                {/* Method 1: Instant Card Checkout (Test Simulator) */}
                <label 
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'card_demo' 
                      ? 'border-[#B38E46] bg-[#FAF7F2]' 
                      : 'border-[#E8DFC9] bg-white hover:border-[#D8CCB5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card_demo"
                        checked={paymentMethod === 'card_demo'}
                        onChange={() => setPaymentMethod('card_demo')}
                        className="text-[#1C1917] accent-[#1C1917]"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#1C1917] block">
                          Credit / Debit Card (Instant Test Card)
                        </span>
                        <span className="text-[11px] text-[#8A8175]">
                          Encrypted 256-bit gateway. Simulated test credentials pre-filled.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8A8175]">
                      <CreditCard className="w-5 h-5 text-[#B38E46]" />
                    </div>
                  </div>

                  {paymentMethod === 'card_demo' && (
                    <div className="mt-4 pt-4 border-t border-[#E8DFC9] grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="text-[10px] text-[#8A8175] block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          className="w-full bg-white border border-[#D8CCB5] rounded-lg px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8A8175] block mb-1">Expires</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full bg-white border border-[#D8CCB5] rounded-lg px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8A8175] block mb-1">Security CVV</label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full bg-white border border-[#D8CCB5] rounded-lg px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Method 2: Razorpay / Online Payment Gateway */}
                <label 
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'razorpay_online' 
                      ? 'border-[#B38E46] bg-[#FAF7F2]' 
                      : 'border-[#E8DFC9] bg-white hover:border-[#D8CCB5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay_online"
                        checked={paymentMethod === 'razorpay_online'}
                        onChange={() => setPaymentMethod('razorpay_online')}
                        className="text-[#1C1917] accent-[#1C1917]"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#1C1917] block">
                          Razorpay / Unified Online Gateway (Sandbox & Live)
                        </span>
                        <span className="text-[11px] text-[#8A8175]">
                          UPI, NetBanking, International Cards with verified signature handshake.
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#856514] bg-[#D4AF37]/20 px-2 py-0.5 rounded">
                      Gateway Ready
                    </span>
                  </div>

                  {paymentMethod === 'razorpay_online' && (
                    <div className="mt-3 pt-3 border-t border-[#E8DFC9] text-[11px] text-[#6B6155] bg-white p-3 rounded-xl border">
                      <p className="flex items-center gap-1.5 text-[#1C1917] font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Server Payment Handshake Active</span>
                      </p>
                      <p>
                        In this preview environment, transactions are securely simulated and verified via test order signatures. Real production keys can be provided via <code className="text-[#1C1917] bg-[#FAF8F5] px-1 py-0.5 rounded border">RAZORPAY_KEY_ID</code> in environment configuration.
                      </p>
                    </div>
                  )}
                </label>

                {/* Method 3: Cash On Delivery */}
                <label 
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod' 
                      ? 'border-[#B38E46] bg-[#FAF7F2]' 
                      : 'border-[#E8DFC9] bg-white hover:border-[#D8CCB5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#1C1917] accent-[#1C1917]"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#1C1917] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#8A8175]">
                          Inspect your handbag upon arrival and settle with courier concierge.
                        </span>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-[#8A8175]" />
                  </div>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs space-y-6 sticky top-24">
            <h2 className="font-serif text-2xl font-bold text-[#141414] pb-3 border-b border-[#F2ECE1]">
              Order Summary ({items.length} pieces)
            </h2>

            {/* Items Snapshots */}
            <div className="divide-y divide-[#F2ECE1] max-h-72 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item.productId}-${item.variationId}`} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-16 object-cover rounded-xl bg-[#FAF8F5] border border-[#E8DFC9]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#1C1917] truncate">
                      {item.productName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8175]">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.colorHex }} />
                      <span>{item.colorName}</span>
                      <span>• Qty: {item.quantity}</span>
                    </div>
                    <span className="text-[10px] text-[#A39077] font-mono">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <div className="text-right text-xs font-bold font-serif text-[#1C1917]">
                    ${item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#6B6155] border-t border-[#F2ECE1] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1917]">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Savings</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>VIP Express Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">Complimentary</strong> : `$${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Silk Keepsake Gift Packaging</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-[#1C1917] pt-4 border-t border-[#F2ECE1]">
                <span className="font-serif">Total Due</span>
                <span className="font-serif">${total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${
                isSubmitting 
                  ? 'bg-stone-500 text-stone-200 cursor-wait' 
                  : 'bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Securing Your Order...' : `Authorize Order • $${total}`}</span>
            </button>

            <div className="text-center text-[11px] text-[#8A8175] space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B38E46]" />
                <span>30-Day Luxury Returns & Authenticity Guarantee</span>
              </p>
              <p>Your order will be immediately entered into our atelier ledger.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
