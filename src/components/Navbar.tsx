import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { itemCount, openCart } = useCart();
  const { categories, wishlist, currentView, navigateTo, settings } = useStore();
  const { currentUser, userProfile, isAdmin, logout, toggleAdminSimulate, isSimulatingAdmin } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop', null, null);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC9] transition-all">
      {/* Top Announcement Bar */}
      {settings.announcementBarActive && (
        <div className="bg-[#1C1917] text-[#FAF8F5] text-xs py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{settings.announcementBarText}</span>
          <span className="hidden md:inline text-[#D4AF37]">• CODE: LUXE10</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#1C1917] hover:text-[#B38E46] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#1C1917] hover:text-[#B38E46] transition-colors ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search luxury bags, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3EDE2] text-sm text-[#1C1917] placeholder-[#8A8175] pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-[#D4AF37] focus:bg-white focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Center Luxury Brand Logo */}
          <div className="flex-1 lg:flex-initial text-center">
            <button 
              onClick={() => navigateTo('home')} 
              className="inline-flex flex-col items-center group cursor-pointer"
            >
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] text-[#141414] font-bold group-hover:text-[#B38E46] transition-colors uppercase">
                LUXEBAG
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-[#A39077] -mt-1 font-sans">
                Paris • Firenze
              </span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-1 max-w-xs">
            {/* Admin Badge/Link */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  currentView === 'admin'
                    ? 'bg-[#1C1917] text-[#D4AF37] border-[#1C1917]'
                    : 'bg-[#F2ECE1] text-[#1C1917] border-[#D8CCB5] hover:bg-[#E8DFC9]'
                }`}
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('account')}
              className="relative p-2 text-[#1C1917] hover:text-[#B38E46] transition-colors"
              aria-label="View wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B38E46] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    setUserDropdownOpen(!userDropdownOpen);
                  }
                }}
                className="p-2 text-[#1C1917] hover:text-[#B38E46] transition-colors flex items-center gap-1.5"
                aria-label="Account"
                title={currentUser ? currentUser.displayName || 'Account' : 'Sign In'}
              >
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="User" 
                    className="w-6 h-6 rounded-full border border-[#D4AF37] object-cover" 
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                {currentUser && (
                  <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">
                    {currentUser.displayName?.split(' ')[0] || 'Client'}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && currentUser && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E8DFC9] py-2 z-50 text-left"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F2ECE1]">
                    <p className="text-xs text-[#8A8175]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#1C1917] truncate">{currentUser.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] bg-[#D4AF37]/20 text-[#856514] px-2 py-0.5 rounded font-semibold uppercase">
                        Admin Privileges
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigateTo('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-[#1C1917] hover:bg-[#FAF8F5] text-left flex items-center justify-between"
                  >
                    <span>My Account & Orders</span>
                    <ChevronRight className="w-4 h-4 text-[#A39077]" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigateTo('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-[#B38E46] font-medium hover:bg-[#FAF8F5] text-left flex items-center justify-between"
                    >
                      <span>Admin Dashboard</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      toggleAdminSimulate();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-[#8A8175] hover:bg-[#FAF8F5] text-left flex items-center justify-between"
                  >
                    <span>{isSimulatingAdmin ? 'Exit Admin Simulation' : 'Simulate Admin Mode'}</span>
                  </button>
                  <div className="border-t border-[#F2ECE1] mt-1 pt-1">
                    <button
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#1C1917] hover:text-[#B38E46] transition-colors flex items-center gap-1 group"
              aria-label="Shopping bag"
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#1C1917] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider text-[#1C1917] ml-1">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {searchOpen && (
          <div className="py-2 pb-4 lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search bags, colors, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#F3EDE2] text-sm text-[#1C1917] pl-10 pr-4 py-2.5 rounded-full border border-[#D4AF37]/50 focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#8A8175] absolute left-3.5 top-3.5" />
            </form>
          </div>
        )}

        {/* Desktop Horizontal Category Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-[#E8DFC9]/60 text-xs tracking-[0.18em] uppercase font-medium text-[#4A4238]">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-[#B38E46] transition-colors pb-1 ${
              currentView === 'home' ? 'text-[#141414] font-bold border-b-2 border-[#D4AF37]' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('shop', null, null)}
            className={`hover:text-[#B38E46] transition-colors pb-1 ${
              currentView === 'shop' && !categories.some(c => c.slug === currentView) ? 'text-[#141414] font-bold border-b-2 border-[#D4AF37]' : ''
            }`}
          >
            All Handbags
          </button>
          {categories.filter(c => c.active).map(cat => (
            <button
              key={cat.id}
              onClick={() => navigateTo('shop', null, cat.slug)}
              className="hover:text-[#B38E46] transition-colors pb-1"
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => navigateTo('shop', null, 'bestsellers')}
            className="text-[#992222] font-semibold hover:text-[#B38E46] transition-colors pb-1"
          >
            Bestsellers
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#E8DFC9]">
              <span className="font-serif text-2xl tracking-[0.2em] font-bold text-[#141414]">
                LUXEBAG
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-1 text-[#1C1917] hover:text-[#B38E46]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <button
                onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-serif text-xl text-[#1C1917] hover:text-[#B38E46] py-1"
              >
                Home
              </button>
              <button
                onClick={() => { navigateTo('shop', null, null); setMobileMenuOpen(false); }}
                className="block w-full text-left font-serif text-xl text-[#1C1917] hover:text-[#B38E46] py-1"
              >
                All Handbags
              </button>
              
              <div className="pt-2 pb-2">
                <p className="text-[11px] uppercase tracking-widest text-[#8A8175] font-semibold mb-2">Categories</p>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { navigateTo('shop', null, cat.slug); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 text-sm text-[#4A4238] hover:text-[#B38E46] pl-2 border-l border-[#D8CCB5]"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E8DFC9] space-y-3">
                <button
                  onClick={() => { navigateTo('account'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm text-[#1C1917] font-medium"
                >
                  <UserIcon className="w-4 h-4 text-[#B38E46]" />
                  <span>My Account & Orders</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm text-[#B38E46] font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                {!currentUser ? (
                  <button
                    onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                    className="w-full mt-4 bg-[#1C1917] text-[#D4AF37] py-2.5 rounded-full text-sm font-medium tracking-wide uppercase"
                  >
                    Client Sign In
                  </button>
                ) : (
                  <button
                    onClick={async () => { await logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm text-red-600 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
