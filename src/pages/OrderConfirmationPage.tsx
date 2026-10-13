import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Printer, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder, navigateTo } = useStore();

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#B38E46', '#FAF8F5', '#1C1917']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!lastOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold mb-3">No Recent Order Found</h2>
        <p className="text-xs text-[#8A8175] mb-6">Review your order history in your client account.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { title: 'Confirmed', desc: 'Atelier received order', done: true },
    { title: 'Processing', desc: 'Bespoke hand inspection', done: true },
    { title: 'Dispatched', desc: 'Complimentary VIP courier', done: false },
    { title: 'Delivered', desc: 'Signature handover', done: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Thank You Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8DFC9] shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold block">
          Order Authorized & Logged
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#141414] mt-1 mb-2">
          Thank You, {lastOrder.customerName.split(' ')[0]}
        </h1>

        <p className="text-xs sm:text-sm text-[#6B6155] max-w-lg mx-auto leading-relaxed">
          Your order has been recorded into the LUXEBAG Florence registry. A formal confirmation and tracking dossier have been dispatched to <strong className="text-[#1C1917]">{lastOrder.customerEmail}</strong>.
        </p>

        {/* Order Identifier Badge */}
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-[#F4ECE1] border border-[#E8DFC9] text-xs font-mono text-[#1C1917]">
          <span>Order Reference:</span>
          <strong className="font-bold text-[#B38E46]">{lastOrder.orderNumber}</strong>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full border border-[#D8CCB5] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-[#B38E46]" />
            <span>Print Atelier Receipt</span>
          </button>

          <button
            onClick={() => navigateTo('account')}
            className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            View in Account Dossier
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-2xs">
        <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#B38E46]" />
          <span>Fulfillment Status & Timeline</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                s.done ? 'bg-[#1C1917] text-[#D4AF37]' : 'bg-[#F2ECE1] text-[#8A8175]'
              }`}>
                {idx + 1}
              </div>
              <h4 className="text-xs font-bold text-[#1C1917]">{s.title}</h4>
              <p className="text-[10px] text-[#8A8175] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-2xs space-y-6">
        <h3 className="font-serif text-xl font-bold text-[#1C1917] pb-3 border-b border-[#F2ECE1]">
          Purchased Creations ({lastOrder.items.length})
        </h3>

        <div className="divide-y divide-[#F2ECE1]">
          {lastOrder.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-20 object-cover rounded-xl bg-[#FAF8F5] border border-[#E8DFC9]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base font-bold text-[#1C1917]">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#6B6155] mt-0.5">
                  <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.colorHex }} />
                  <span>{item.colorName}</span>
                  <span className="text-[#8A8175] font-mono">• SKU: {item.sku}</span>
                </div>
                <span className="text-xs text-[#8A8175]">
                  Qty: {item.quantity} × ${item.unitPrice}
                </span>
              </div>
              <div className="text-right font-serif text-base font-bold text-[#1C1917]">
                ${item.subtotal}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Grid */}
        <div className="pt-4 border-t border-[#F2ECE1] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#6B6155]">
          <div>
            <h4 className="font-semibold text-[#1C1917] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B38E46]" />
              <span>Delivery Destination</span>
            </h4>
            <p className="font-medium text-[#1C1917]">{lastOrder.customerName}</p>
            <p>{lastOrder.shippingAddress.street} {lastOrder.shippingAddress.apartment || ''}</p>
            <p>{lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state} {lastOrder.shippingAddress.postalCode}</p>
            <p>{lastOrder.shippingAddress.country}</p>
            <p className="mt-1 text-[#8A8175]">Phone: {lastOrder.customerPhone}</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="font-semibold text-[#1C1917] uppercase tracking-wider text-[11px] mb-2">
              Payment Summary
            </h4>
            <div className="flex justify-between sm:justify-end sm:gap-6">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1C1917]">${lastOrder.subtotal}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between sm:justify-end sm:gap-6 text-emerald-700">
                <span>Promotional Discount:</span>
                <span>-${lastOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between sm:justify-end sm:gap-6">
              <span>Delivery Fee:</span>
              <span>{lastOrder.shippingFee === 0 ? 'Complimentary' : `$${lastOrder.shippingFee}`}</span>
            </div>
            <div className="flex justify-between sm:justify-end sm:gap-6 text-base font-bold text-[#1C1917] pt-2 border-t border-[#F2ECE1]">
              <span className="font-serif">Total Amount:</span>
              <span className="font-serif">${lastOrder.totalAmount}</span>
            </div>
            <div className="pt-2 text-[11px] text-[#8A8175]">
              Method: <span className="uppercase font-semibold text-[#1C1917]">{lastOrder.paymentMethod.replace('_', ' ')}</span>
              {' '}(Status: <span className="font-semibold text-emerald-700">{lastOrder.paymentStatus}</span>)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs font-semibold uppercase tracking-widest text-[#1C1917] hover:text-[#B38E46] transition-colors inline-flex items-center gap-1.5"
        >
          <span>Continue Exploring Collections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
