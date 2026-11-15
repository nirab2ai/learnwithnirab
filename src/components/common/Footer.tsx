import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Phone,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Category, StoreSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  categories: Category[];
  settings: StoreSettings;
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, settings, navigate }) => {
  const { language, t } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t border-[#222222] bg-[#0E0E0E] text-white">
      {/* 1. BRAND VALUE PILLARS */}
      <div className="border-b border-[#1F1F1F] bg-[#141414] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-[#C5A46D] border border-[#2B2B2B]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Nationwide Delivery
              </h4>
              <p className="text-xs text-neutral-400">
                Inside Dhaka 24-48h, Outside Dhaka 48-72h with tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-[#C5A46D] border border-[#2B2B2B]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Cash On Delivery
              </h4>
              <p className="text-xs text-neutral-400">
                Inspect your luxury apparel at your doorstep before paying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-[#C5A46D] border border-[#2B2B2B]">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                7-Day Easy Exchange
              </h4>
              <p className="text-xs text-neutral-400">
                Hassle-free size and product exchange guarantee.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-[#C5A46D] border border-[#2B2B2B]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                100% Premium Fabric
              </h4>
              <p className="text-xs text-neutral-400">
                Double-mercerized Egyptian cotton & authentic raw denim.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 & 2: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                SHOP WITH <span className="text-[#C5A46D]">CLASSY NIRAB</span>
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mt-1">
                {settings.tagline || 'STYLE • QUALITY • ELEGANCE'}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-400 max-w-md">
              A premier international fashion label curating high-end men's luxury apparel.
              From regal Jacquard Panjabis to Italian-inspired polos and selvedge denim,
              we craft distinctive silhouettes with unrivaled sartorial precision.
            </p>

            {/* Clickable Contact Icons & Buttons */}
            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#C5A46D] mb-3">
                Customer Support & Instant Inquiries
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/88${settings.whatsapp || '01733044222'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-[#25D366]/10 px-3 py-2 text-xs font-medium text-[#25D366] border border-[#25D366]/30 transition-all hover:bg-[#25D366] hover:text-black"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp: {settings.whatsapp || '01733044222'}</span>
                </a>

                {/* Direct Call Button 1 */}
                <a
                  href={`tel:${settings.phone1 || '01733044222'}`}
                  className="flex items-center gap-2 rounded bg-[#1F1F1F] px-3 py-2 text-xs font-medium text-neutral-200 border border-[#333333] transition-all hover:border-[#C5A46D] hover:text-[#C5A46D]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#C5A46D]" />
                  <span>{settings.phone1 || '01733044222'}</span>
                </a>

                {/* Direct Call Button 2 */}
                <a
                  href={`tel:${settings.phone2 || '01726590653'}`}
                  className="flex items-center gap-2 rounded bg-[#1F1F1F] px-3 py-2 text-xs font-medium text-neutral-200 border border-[#333333] transition-all hover:border-[#C5A46D] hover:text-[#C5A46D]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#C5A46D]" />
                  <span>{settings.phone2 || '01726590653'}</span>
                </a>

                {/* Email Link */}
                <a
                  href={`mailto:${settings.email || 'nirab2ai@gmail.com'}`}
                  className="flex items-center gap-2 rounded bg-[#1F1F1F] px-3 py-2 text-xs font-medium text-neutral-200 border border-[#333333] transition-all hover:border-[#C5A46D] hover:text-[#C5A46D]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#C5A46D]" />
                  <span>{settings.email || 'nirab2ai@gmail.com'}</span>
                </a>

                {/* Facebook Profile Link */}
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/profile.php?id=61594699696202'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-[#1877F2]/10 px-3 py-2 text-xs font-medium text-[#1877F2] border border-[#1877F2]/30 transition-all hover:bg-[#1877F2] hover:text-white"
                >
                  <Facebook className="h-4 w-4 shrink-0" />
                  <span>Facebook Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A46D] mb-4">
              {t('nav_categories')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/shop?category=${cat.slug}`)}
                    className="transition-colors hover:text-[#C5A46D]"
                  >
                    {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A46D] mb-4">
              Explore & Support
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-[#C5A46D]">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/my-orders')} className="hover:text-[#C5A46D]">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#C5A46D]">
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#C5A46D]">
                  Contact & Store Info
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?category=premium-panjabi')} className="hover:text-[#C5A46D]">
                  Eid & Festival Panjabi
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?category=winter-collection')} className="hover:text-[#C5A46D]">
                  Winter Luxury Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: VIP Club / Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A46D] mb-4">
              VIP Club Access
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Subscribe to receive exclusive early access to bespoke drops and VIP seasonal previews.
            </p>
            {subscribed ? (
              <div className="rounded bg-[#1A1A1A] p-3 text-xs text-[#C5A46D] border border-[#C5A46D]/30 font-medium">
                ✓ Thank you for subscribing to Classy Nirab VIP Club!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-sm border border-[#2B2B2B] bg-[#1A1A1A] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#C5A46D] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full rounded-sm bg-[#C5A46D] py-2 text-xs font-bold text-black transition-all hover:bg-[#dfca9b]"
                >
                  JOIN VIP PRIVILEGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. PAYMENT GATEWAYS & COPYRIGHT */}
      <div className="border-t border-[#1C1C1C] bg-[#0A0A0A] py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p>© 2026 SHOP WITH CLASSY NIRAB. All Rights Reserved. Style • Quality • Elegance.</p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] uppercase font-semibold text-neutral-400">
            <span className="rounded bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-1 text-white">
              Cash On Delivery
            </span>
            <span className="rounded bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/30 px-2 py-1 font-bold">
              bKash Ready
            </span>
            <span className="rounded bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/30 px-2 py-1 font-bold">
              Nagad Ready
            </span>
            <span className="rounded bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-1 text-white">
              SSLCommerz
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
