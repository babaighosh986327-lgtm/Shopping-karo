import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, Award, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo, categories } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141414] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A2622]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2A2622]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#24201C] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Florentine Leathers</h4>
              <p className="text-xs text-[#9E9488] mt-0.5">100% full-grain calfskin certified by Italian tanneries</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#24201C] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Express Delivery</h4>
              <p className="text-xs text-[#9E9488] mt-0.5">Complimentary shipping on orders exceeding $250</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#24201C] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Effortless Returns</h4>
              <p className="text-xs text-[#9E9488] mt-0.5">30-day complimentary luxury concierge returns</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#24201C] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Lifetime Warranty</h4>
              <p className="text-xs text-[#9E9488] mt-0.5">Craftsmanship protection for all hardware & seams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-white block">
              LUXEBAG
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mt-1">
              Paris • Firenze • Milano
            </span>
            <p className="text-xs text-[#A89D8F] mt-4 max-w-sm leading-relaxed">
              Founded on the belief that a handbag is not merely an accessory, but an heirloom of personal style. Handcrafted in limited artisanal batches with bespoke champagne gold hardware.
            </p>
            
            <div className="mt-6 flex items-center gap-3 text-xs text-[#8A8175]">
              <span>Customer Concierge:</span>
              <a href="mailto:concierge@luxebag-paris.com" className="text-[#D4AF37] hover:underline">
                concierge@luxebag-paris.com
              </a>
            </div>
          </div>

          {/* Handbags Collection */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wider">
              Handbag Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A89D8F]">
              <li>
                <button onClick={() => navigateTo('shop', null, null)} className="hover:text-[#D4AF37] transition-colors">
                  All Collections
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button onClick={() => navigateTo('shop', null, cat.slug)} className="hover:text-[#D4AF37] transition-colors">
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigateTo('shop', null, 'bestsellers')} className="hover:text-[#D4AF37] transition-colors">
                  Signature Bestsellers
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wider">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A89D8F]">
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-[#D4AF37] transition-colors">
                  My Orders & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-[#D4AF37] transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <span className="cursor-default hover:text-[#D4AF37] transition-colors">
                  Care & Leather Restoration
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-[#D4AF37] transition-colors">
                  Bespoke Gift Boxing
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-[#D4AF37] transition-colors">
                  Authentication Certificate
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-2 tracking-wider">
              The LUXEBAG Gazette
            </h4>
            <p className="text-xs text-[#A89D8F] mb-4">
              Receive private invitations to private capsule releases and $50 towards your first heirloom piece.
            </p>

            {subscribed ? (
              <div className="bg-[#24201C] p-3 rounded-xl border border-[#D4AF37]/40 text-xs text-[#D4AF37]">
                Thank you for subscribing. Use promo code <strong>WELCOME20</strong> for 20% off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1F1C18] border border-[#3D352B] rounded-xl px-3 py-2.5 text-xs text-white placeholder-[#786E63] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 bg-[#D4AF37] hover:bg-[#B38E46] text-[#141414] rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#6E6457] block">
                  By subscribing, you agree to our privacy policy. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#24201C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#786E63] gap-4">
        <div>
          © {new Date().getFullYear()} LUXEBAG Haute Maroquinerie. All rights reserved.
        </div>
        <div className="flex items-center space-x-6 text-[11px]">
          <span>Secure 256-bit SSL</span>
          <span>Visa • Mastercard • Amex • Apple Pay • Razorpay</span>
        </div>
      </div>
    </footer>
  );
};
