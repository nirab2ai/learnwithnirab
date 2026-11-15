import React from 'react';
import { Sparkles, ShieldCheck, Award, HeartHandshake, ArrowRight } from 'lucide-react';

interface AboutUsPageProps {
  navigate: (path: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F5] py-12 sm:py-20 text-[#111111]">
      <div className="mx-auto max-w-5xl px-4 space-y-16">
        {/* Hero Narrative */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A46D]">
            THE MAISON STORY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#111111]">
            SHOP WITH CLASSY NIRAB
          </h1>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#C5A46D]">
            STYLE • QUALITY • ELEGANCE
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2">
            Founded with a vision to redefine luxury menswear in Bangladesh, Classy Nirab represents the pinnacle of contemporary sartorial distinction. We cater to gentlemen who appreciate meticulous craftsmanship, rare long-staple Egyptian cottons, and timeless elegance.
          </p>
        </div>

        {/* Feature Image Banner */}
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-[#E0E0DB] shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Classy Nirab Atelier"
            className="h-full w-full object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-lg">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A46D]">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold mt-1">
                Luxury without Compromise
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                Every thread, seam, and button is selected to endure and inspire confidence.
              </p>
            </div>
          </div>
        </div>

        {/* The 4 Pillars of Classy Nirab */}
        <div>
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
              The Four Pillars of Excellence
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Why thousands of discerning clients choose Shop With Classy Nirab.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                1. Rare Fabrics
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Imported double-mercerized Egyptian Giza yarn, heavyweight 380 GSM thermal fleece, and authentic shuttle-loomed selvedge denim.
              </p>
            </div>

            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                2. Royal Heritage
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Celebrated Jacquard panjabis blending traditional festive majesty with clean, athletic modern silhouettes.
              </p>
            </div>

            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                3. Total Trust
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Nationwide Cash on Delivery with full door-to-door inspection before payment and 7-day hassle-free size exchange.
              </p>
            </div>

            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs hover:border-[#C5A46D] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-[#C5A46D] mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                4. VIP Service
              </h3>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Direct WhatsApp styling advice and dedicated support hotlines to assist with any fitting or delivery need.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl bg-[#111111] p-8 sm:p-12 text-center text-white space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
            ELEVATE YOUR WARDROBE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Experience Classy Nirab Luxury Today
          </h2>
          <p className="text-xs text-neutral-300 max-w-md mx-auto">
            Browse our new season releases and enjoy free delivery across Bangladesh on orders over ৳2,500.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 rounded-sm bg-[#C5A46D] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-black hover:bg-[#dfca9b] transition-all shadow-xl shadow-[#C5A46D]/20"
            >
              <span>Explore The Shop</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
