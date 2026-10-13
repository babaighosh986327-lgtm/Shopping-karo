import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronRight,
  Star,
  Quote
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { products, categories, navigateTo, settings } = useStore();

  const bestsellerProducts = products.filter(p => p.isBestseller && p.active).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival && p.active).slice(0, 4);
  const featuredProducts = products.filter(p => p.isFeatured && p.active).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[700px] flex items-center bg-[#191614] overflow-hidden">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.bannerImageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"}
            alt="LUXEBAG Hero Collection"
            className="w-full h-full object-cover object-center opacity-65 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-xs tracking-widest uppercase text-[#FAF8F5]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Haute Maroquinerie • Autumn Edition</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              {settings.bannerTitle || "L’Art de la Maroquinerie"}
            </h1>

            <p className="text-base sm:text-lg text-[#DFD7C5] leading-relaxed max-w-lg font-light">
              {settings.bannerSubtitle || "Handcrafted in limited artisanal ateliers from buttery full-grain Florentine leathers with custom champagne gold accents."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigateTo('shop', null, null)}
                className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#B38E46] text-[#141414] font-semibold text-xs tracking-[0.2em] uppercase transition-all shadow-xl hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateTo('shop', null, 'bestsellers')}
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center cursor-pointer"
              >
                <span>Signature Bestsellers</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Horizontal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
              Curated Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-3 sm:mt-0 text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:text-[#B38E46] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.filter(c => c.active).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', null, cat.slug)}
              className="group relative rounded-2xl overflow-hidden bg-[#F6F2EC] border border-[#E8DFC9] hover:border-[#D4AF37] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-[#EDE5D8]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-750 ease-out"
                />
              </div>
              <div className="p-4 text-center bg-white flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-base font-semibold text-[#1C1917] group-hover:text-[#B38E46] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#8A8175] mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
              Client Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mt-1">
              Signature Bestsellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop', null, 'bestsellers')}
            className="mt-3 sm:mt-0 text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:text-[#B38E46] flex items-center gap-1 transition-colors"
          >
            <span>Explore All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Atelier Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#1C1917] text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80"
              alt="Atelier Craft"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block">
              The Florentine Legacy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Crafted in Italy. Worn Across Continents.
            </h2>
            <p className="text-sm sm:text-base text-[#DFD7C5] leading-relaxed font-light">
              Every LUXEBAG creation requires over 36 hours of rigorous hand assembly by multi-generational leather artisans in Tuscany. Sealed with burnished edges and hand-stitched saddle thread.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-3.5 rounded-full bg-white text-[#141414] hover:bg-[#D4AF37] hover:text-[#141414] font-semibold text-xs tracking-widest uppercase transition-all shadow-md"
              >
                Discover The Craft
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B38E46] font-semibold">
              Fresh From Florence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop', null, 'new-arrivals')}
            className="mt-3 sm:mt-0 text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:text-[#B38E46] flex items-center gap-1 transition-colors"
          >
            <span>View New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Press & Client Quotes */}
      <section className="bg-[#F4ECE1] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B38E46] font-bold">
              Global Acclaim
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#141414] mt-1">
              Words From Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E8DFC9] shadow-xs flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-[#D4AF37]/60 mb-4" />
                <p className="font-serif text-base text-[#1C1917] italic leading-relaxed">
                  "The Palazzo Flap has permanently replaced my other luxury bags. The leather feel is divine and the champagne gold hardware doesn't tarnish."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1C1917]">Camilla D’Orsay</h4>
                  <span className="text-[10px] text-[#8A8175]">Verified Client • Milan</span>
                </div>
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8DFC9] shadow-xs flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-[#D4AF37]/60 mb-4" />
                <p className="font-serif text-base text-[#1C1917] italic leading-relaxed">
                  "The Sienna Grand Tote fits my MacBook Pro seamlessly while maintaining pristine architectural poise in high-stakes boardrooms."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1C1917]">Vivienne Sterling</h4>
                  <span className="text-[10px] text-[#8A8175]">Verified Client • London</span>
                </div>
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8DFC9] shadow-xs flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-[#D4AF37]/60 mb-4" />
                <p className="font-serif text-base text-[#1C1917] italic leading-relaxed">
                  "Fastest VIP delivery and the bespoke packaging felt like opening fine jewelry. LUXEBAG is defining modern quiet luxury."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1C1917]">Claire Fontaine</h4>
                  <span className="text-[10px] text-[#8A8175]">Verified Client • Paris</span>
                </div>
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
