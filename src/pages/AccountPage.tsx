import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ShoppingBag, 
  ExternalLink, 
  Clock, 
  Calendar,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Order, Product } from '../types';

export const AccountPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const { orders, wishlist, products, navigateTo } = useStore();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for this client
  const myOrders = orders.filter(o => 
    (currentUser && o.customerId === currentUser.uid) || 
    (currentUser && o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())
  );

  // Wishlist products
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F3EDE2] flex items-center justify-center mx-auto mb-6 text-[#A39077]">
          <User className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#141414] mb-3">
          Client Sanctuary
        </h1>
        <p className="text-xs text-[#8A8175] mb-8 leading-relaxed">
          Please sign in to access your bespoke orders dossier, saved wishlist items, and concierge privileges.
        </p>
        <button
          onClick={onOpenAuth}
          className="w-full py-3.5 px-6 rounded-full bg-[#1C1917] hover:bg-[#B38E46] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-md"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-[#D4AF37] object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#1C1917] text-[#D4AF37] flex items-center justify-center font-serif text-2xl font-bold">
              {(currentUser.displayName || currentUser.email || 'C').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#141414]">
                {currentUser.displayName || 'Distinguished Client'}
              </h1>
              {isAdmin && (
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#856514] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A8175] mt-0.5">{currentUser.email}</p>
            <span className="text-[10px] text-[#A39077] tracking-wider uppercase">
              Member since {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 rounded-full bg-[#F4ECE1] hover:bg-[#E8DFC9] text-xs font-semibold text-[#1C1917] flex items-center gap-1.5 border border-[#D8CCB5] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-full border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8DFC9] mb-8 text-xs font-semibold tracking-wider uppercase">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders' 
              ? 'border-[#D4AF37] text-[#1C1917]' 
              : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <Package className="w-4 h-4 text-[#B38E46]" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'wishlist' 
              ? 'border-[#D4AF37] text-[#1C1917]' 
              : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-6 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile' 
              ? 'border-[#D4AF37] text-[#1C1917]' 
              : 'border-transparent text-[#8A8175] hover:text-[#1C1917]'
          }`}
        >
          <User className="w-4 h-4 text-[#B38E46]" />
          <span>Profile Dossier</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div>
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFC9]">
              <Package className="w-12 h-12 text-[#A39077] mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-[#141414] mb-2">No Orders Placed Yet</h3>
              <p className="text-xs text-[#8A8175] mb-6">Your ordered luxury handbags and tracking numbers will appear here.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Explore Handbags
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl p-6 border border-[#E8DFC9] shadow-2xs hover:border-[#D4AF37]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#B38E46]">
                        {order.orderNumber}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        order.orderStatus === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : order.orderStatus === 'Shipped' 
                            ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <p className="text-xs text-[#8A8175]">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.items.length} pieces
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#1C1917] pt-1">
                      <span className="font-semibold font-serif text-base">${order.totalAmount}</span>
                      <span className="text-[11px] text-[#8A8175] uppercase">({order.paymentMethod.replace('_', ' ')})</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-lg bg-[#FAF8F5] border border-[#E8DFC9]"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-[#8A8175] font-semibold pl-1">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D8CCB5] text-xs font-semibold text-[#1C1917] transition-colors"
                  >
                    View Order Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFC9]">
              <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-[#141414] mb-2">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#8A8175] mb-6">Save your favorite handbags by clicking the heart icon on any product.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Browse Handbags
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map(prod => {
                const defVariation = prod.variations[0];
                return (
                  <div key={prod.id} className="bg-white rounded-2xl border border-[#E8DFC9] p-4 flex flex-col justify-between">
                    <img
                      src={defVariation.images[0]}
                      alt={prod.name}
                      className="w-full aspect-4/5 object-cover rounded-xl bg-[#FAF8F5] mb-3"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#1C1917] truncate">{prod.name}</h4>
                      <p className="text-xs text-[#8A8175]">{prod.categoryName}</p>
                      <span className="font-serif text-base font-bold text-[#1C1917] block mt-1">
                        ${defVariation.price ?? prod.price}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigateTo('product-detail', prod.id)}
                        className="flex-1 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-semibold text-[#1C1917] border border-[#D8CCB5]"
                      >
                        View Piece
                      </button>
                      <button
                        onClick={() => addToCart(prod, defVariation, 1)}
                        className="p-2 rounded-xl bg-[#1C1917] text-[#FAF8F5] hover:bg-[#B38E46]"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Details */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] max-w-xl space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#141414] pb-2 border-b border-[#F2ECE1]">
            Client Identification
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#8A8175] block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser.displayName || 'Valued Client'}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="text-[#8A8175] block mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={currentUser.email || ''}
                className="w-full bg-[#FAF8F5] border border-[#D8CCB5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="text-[#8A8175] block mb-1">Membership Privilege</label>
              <span className="inline-block px-3 py-1 bg-[#F4ECE1] text-[#856514] font-semibold rounded-lg">
                LUXEBAG Private Concierge Tier
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B38E46] font-bold">Order Details</span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#8A8175] hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-[#E8DFC9]">
                <div>
                  <span className="text-[#8A8175] block">Current Status</span>
                  <strong className="text-[#1C1917] text-sm">{selectedOrder.orderStatus}</strong>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="text-right">
                    <span className="text-[#8A8175] block">Tracking Code</span>
                    <strong className="font-mono text-[#B38E46]">{selectedOrder.trackingNumber}</strong>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="divide-y divide-[#E8DFC9] bg-white p-4 rounded-xl border border-[#E8DFC9]">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center gap-3 first:pt-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />
                    <div className="flex-1 text-xs">
                      <h4 className="font-semibold text-[#1C1917]">{item.name}</h4>
                      <p className="text-[#8A8175]">{item.colorName} • Qty {item.quantity}</p>
                    </div>
                    <span className="font-serif font-bold text-sm">${item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="text-xs space-y-1 text-right bg-white p-4 rounded-xl border border-[#E8DFC9]">
                <p>Subtotal: <strong>${selectedOrder.subtotal}</strong></p>
                {selectedOrder.discount > 0 && <p className="text-emerald-700">Discount: -${selectedOrder.discount}</p>}
                <p>Shipping: <strong>{selectedOrder.shippingFee === 0 ? 'Complimentary' : `$${selectedOrder.shippingFee}`}</strong></p>
                <p className="text-base font-serif font-bold pt-1 border-t text-[#1C1917]">
                  Total: ${selectedOrder.totalAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
