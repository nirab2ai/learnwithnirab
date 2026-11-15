import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Product, Category, Banner, StoreSettings } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: StoreSettings;
  navigate: (path: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  banners,
  settings,
  navigate,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedBestSellerCat, setSelectedBestSellerCat] = useState<string>('all');

  const activeBanners = banners.length > 0 ? banners : [];
  const currentBanner = activeBanners[activeBannerIndex] || activeBanners[0];

  const handlePrevBanner = () => {
    setActiveBannerIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setActiveBannerIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  };

  // Filtered collections
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival || p.isFeatured).slice(0, 8);

  const bestSellers = products
    .filter((p) => {
      if (selectedBestSellerCat === 'all') return p.isBestSeller;
      return p.category === selectedBestSellerCat;
    })
    .slice(0, 8);

  const customerReviews = [
    {
      id: 'rev-1',
      name: 'Tanvir Ahmed',
      rating: 5,
      product: 'Heritage Panjabi',
      comment: 'The Jacquard fabric and gold embroidery work is simply unmatched. Received compliments throughout the wedding ceremony. Delivery inside Dhaka was under 24 hours!',
      verified: true,
      location: 'Gulshan, Dhaka',
    },
    {
      id: 'rev-2',
      name: 'Rashedul Islam',
      rating: 5,
      product: 'Royal Champagne Classic Polo',
      comment: 'Super soft mercerized cotton with substantial weight. Doesn’t shrink or fade after multiple washes. Truly international grade quality.',
      verified: true,
      location: 'Agrabad, Chattogram',
    },
    {
      id: 'rev-3',
      name: 'Mahmudur Rahman',
      rating: 5,
      product: 'Raw Indigo Selvedge Denim',
      comment: 'Finally an authentic selvedge denim in Bangladesh with modern comfort stretch. Exceptional craftsmanship and premium packaging.',
      verified: true,
      location: 'Uttara, Dhaka',
    },
  ];

  return (
    <div className="flex flex-col bg-[#F7F7F5] text-[#111111]">
      {/* 1. LUXURY HERO BANNER CAROUSEL */}
      {currentBanner && (
        <section className="relative w-full overflow-hidden bg-black text-white">
          <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] w-full flex items-center">
            {/* Background Image with Dark Luxury Gradient */}
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.65]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

            {/* Banner Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A46D]/40 bg-black/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A46D] backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" />
                  <span>PREMIUM LUXURY APPAREL</span>
                </div>

                <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
                  {currentBanner.title}
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
                  {currentBanner.subtitle || 'STYLE • QUALITY • ELEGANCE — Designed for the discerning gentleman.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={() => navigate(currentBanner.linkUrl || '/shop')}
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#C5A46D] px-7 py-3.5 text-xs font-extrabold uppercase tracking-widest text-black shadow-xl shadow-[#C5A46D]/20 transition-all hover:bg-[#dfca9b] hover:scale-105 active:scale-95"
                  >
                    <span>{currentBanner.buttonText || t('shop_now')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href={`https://wa.me/88${settings.whatsapp || '01733044222'}?text=Hello%20Classy%20Nirab,%20I%20would%20like%20to%20place%20an%20order.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 bg-black/40 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-[#C5A46D] hover:text-[#C5A46D]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Slider Navigation arrows */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={handlePrevBanner}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-[#C5A46D] hover:text-black transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-[#C5A46D] hover:text-black transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBannerIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeBannerIndex === idx
                          ? 'w-8 bg-[#C5A46D]'
                          : 'w-2 bg-white/40 hover:bg-white'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* 2. CATEGORY COLLECTIONS SHOWCASE */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E0E0DB] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
              DISCOVER OUR WORLD
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
              Curated Collections
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#C5A46D] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 10 Category Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="group relative flex flex-col overflow-hidden rounded-md border border-[#E5E5E0] bg-white shadow-xs transition-all duration-300 hover:border-[#C5A46D] hover:shadow-xl cursor-pointer"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-2 bottom-3 text-center">
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide">
                    {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A46D] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="bg-white py-14 sm:py-20 border-y border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
                FRESH OFF THE ATELIER
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
                {t('nav_new_arrivals')}
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop?tag=new')}
              className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#C5A46D] transition-colors"
            >
              <span>See All Arrivals</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HERITAGE PANJABI SPOTLIGHT BANNER */}
      <section className="relative overflow-hidden bg-[#111111] py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-block rounded-xs bg-[#C5A46D]/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D] border border-[#C5A46D]/30">
              ROYAL FESTIVE ATTIRE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Classy Nirab Heritage Panjabi Collection
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
              Imbued with regal dignity, our Panjabi collection merges ancient royal Jacquard silk-cotton weaving with contemporary silhouette tailoring and hand-finished metallic gold embroidery.
            </p>

            <ul className="space-y-2.5 text-xs text-neutral-300 pt-2">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A46D]" />
                <span>Double-twist Egyptian Combed Compact cotton blend</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A46D]" />
                <span>Custom gold metallic buttons and anti-crease satin finish</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A46D]" />
                <span>Tailored comfort fit engineered specifically for South Asian stature</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/shop?category=premium-panjabi')}
                className="rounded-sm bg-[#C5A46D] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-black shadow-lg shadow-[#c5a46d]/20 hover:bg-[#dfca9b] transition-all"
              >
                EXPLORE PANJABI
              </button>
              <button
                onClick={() => navigate('/shop?category=winter-collection')}
                className="rounded-sm border border-neutral-600 bg-neutral-900 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:border-[#C5A46D] hover:text-[#C5A46D] transition-all"
              >
                WINTER LUXURY
              </button>
            </div>
          </div>

          <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-[#2B2B2B] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"
              alt="Heritage Panjabi"
              className="h-full w-full object-cover object-top filter contrast-105"
            />
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION WITH CATEGORY TABS */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
              CUSTOMER FAVORITES
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
              {t('nav_best_sellers')}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setSelectedBestSellerCat('all')}
              className={`px-3.5 py-1.5 rounded-xs transition-all ${
                selectedBestSellerCat === 'all'
                  ? 'bg-[#111111] text-[#C5A46D] font-bold'
                  : 'bg-white border border-[#E0E0DB] text-neutral-600 hover:text-black'
              }`}
            >
              All Best Sellers
            </button>
            <button
              onClick={() => setSelectedBestSellerCat('premium-polo')}
              className={`px-3.5 py-1.5 rounded-xs transition-all ${
                selectedBestSellerCat === 'premium-polo'
                  ? 'bg-[#111111] text-[#C5A46D] font-bold'
                  : 'bg-white border border-[#E0E0DB] text-neutral-600 hover:text-black'
              }`}
            >
              Polos
            </button>
            <button
              onClick={() => setSelectedBestSellerCat('solid-tshirt')}
              className={`px-3.5 py-1.5 rounded-xs transition-all ${
                selectedBestSellerCat === 'solid-tshirt'
                  ? 'bg-[#111111] text-[#C5A46D] font-bold'
                  : 'bg-white border border-[#E0E0DB] text-neutral-600 hover:text-black'
              }`}
            >
              Solid Tees
            </button>
            <button
              onClick={() => setSelectedBestSellerCat('denim-jeans')}
              className={`px-3.5 py-1.5 rounded-xs transition-all ${
                selectedBestSellerCat === 'denim-jeans'
                  ? 'bg-[#111111] text-[#C5A46D] font-bold'
                  : 'bg-white border border-[#E0E0DB] text-neutral-600 hover:text-black'
              }`}
            >
              Denim
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {(bestSellers.length > 0 ? bestSellers : products.slice(0, 4)).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="bg-white py-14 sm:py-20 border-t border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
              TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
              Words From Our Patrons
            </h2>
            <div className="flex justify-center items-center gap-1 mt-2 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-neutral-700 ml-2">4.9 / 5.0 (500+ Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between rounded-lg border border-[#E8E8E3] bg-[#FAFAF8] p-6 shadow-xs hover:border-[#C5A46D] transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed italic mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="border-t border-[#E8E8E3] pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">{rev.name}</h4>
                      <p className="text-[10px] text-neutral-400">{rev.location}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-[#C5A46D] font-semibold mt-1">
                    Purchased: {rev.product}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
