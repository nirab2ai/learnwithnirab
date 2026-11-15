import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  ShieldCheck,
  Package,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Category, StoreSettings } from '../../types';

interface HeaderProps {
  categories: Category[];
  settings: StoreSettings;
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  settings,
  currentPath,
  navigate,
  onOpenSearch,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { itemCount, openCart, wishlist } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111] text-white shadow-xl">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] px-4 py-2 text-xs font-medium">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Announcement text */}
          <div className="flex items-center gap-2 overflow-hidden text-[#C5A46D]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse text-[#C5A46D]" />
            <span className="truncate tracking-wide text-xs">
              {settings.announcement || '✨ FREE DELIVERY on orders over ৳2,500 across Bangladesh! Cash on Delivery Available.'}
            </span>
          </div>

          {/* Contact quick links & Language Switcher */}
          <div className="hidden items-center gap-4 text-neutral-400 sm:flex">
            <a
              href={`https://wa.me/88${settings.whatsapp || '01733044222'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-[#C5A46D]"
            >
              <MessageCircle className="h-3 w-3 text-[#25D366]" />
              <span>WhatsApp: {settings.whatsapp || '01733044222'}</span>
            </a>
            <span className="text-[#333333]">|</span>
            <a
              href={`tel:${settings.phone1 || '01733044222'}`}
              className="flex items-center gap-1 transition-colors hover:text-[#C5A46D]"
            >
              <Phone className="h-3 w-3 text-[#C5A46D]" />
              <span>{settings.phone1 || '01733044222'}</span>
            </a>
            <span className="text-[#333333]">|</span>
            {/* Language toggle */}
            <div className="flex items-center rounded-sm bg-[#1A1A1A] p-0.5 text-[11px] font-semibold border border-[#333333]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-xs transition-all ${
                  language === 'en'
                    ? 'bg-[#C5A46D] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded-xs transition-all ${
                  language === 'bn'
                    ? 'bg-[#C5A46D] text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Left: Mobile hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-[#C5A46D]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <button
            onClick={onOpenSearch}
            className="p-2 text-neutral-300 hover:text-[#C5A46D]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Center / Brand Logo */}
        <div
          onClick={() => handleNav('/')}
          className="flex cursor-pointer flex-col items-center select-none text-center"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName}
              className="h-10 max-w-[200px] object-contain"
            />
          ) : (
            <div className="group flex flex-col items-center">
              <div className="flex items-center gap-1.5 font-serif tracking-[0.2em] text-lg sm:text-2xl font-bold text-white transition-all group-hover:text-[#C5A46D]">
                <span>SHOP WITH</span>
                <span className="text-[#C5A46D]">CLASSY NIRAB</span>
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-sans mt-0.5">
                {settings.tagline || 'STYLE • QUALITY • ELEGANCE'}
              </div>
            </div>
          )}
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Search (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden items-center gap-2 rounded-full border border-[#2B2B2B] bg-[#1A1A1A] px-3.5 py-1.5 text-xs text-neutral-400 hover:border-[#C5A46D] hover:text-white lg:flex"
          >
            <Search className="h-3.5 w-3.5 text-[#C5A46D]" />
            <span className="pr-4">{t('search_placeholder').slice(0, 24)}...</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => handleNav('/shop?view=wishlist')}
            className="relative p-2 text-neutral-300 transition-colors hover:text-[#C5A46D]"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A46D] text-[10px] font-bold text-black">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Profile / Admin */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 p-2 text-neutral-300 transition-colors hover:text-[#C5A46D]"
              title="Account"
            >
              <User className="h-5 w-5" />
              {isAdmin && (
                <span className="hidden sm:inline-block rounded-xs bg-[#C5A46D] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black">
                  Admin
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#2B2B2B] bg-[#161616] py-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {currentUser ? (
                  <>
                    <div className="border-b border-[#262626] px-4 py-2">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-white">
                        {userProfile?.displayName || currentUser.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('/admin')}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#C5A46D] hover:bg-[#222222]"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>{t('nav_admin')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleNav('/my-orders')}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-neutral-200 hover:bg-[#222222]"
                    >
                      <Package className="h-4 w-4 text-neutral-400" />
                      <span>{t('nav_my_orders')}</span>
                    </button>

                    <button
                      onClick={() => handleNav('/dashboard')}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-neutral-200 hover:bg-[#222222]"
                    >
                      <User className="h-4 w-4 text-neutral-400" />
                      <span>{t('nav_my_profile')}</span>
                    </button>

                    <div className="border-t border-[#262626] my-1" />

                    <button
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-[#222222]"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNav('/login')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#222222]"
                    >
                      <span>{t('nav_login')}</span>
                    </button>
                    <button
                      onClick={() => handleNav('/register')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs text-[#C5A46D] hover:bg-[#222222]"
                    >
                      <span>{t('nav_register')}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 rounded-full bg-[#C5A46D] px-3 sm:px-4 py-2 text-xs font-bold text-black transition-all hover:bg-[#dfca9b] hover:shadow-lg hover:shadow-[#c5a46d]/20 active:scale-95"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline font-sans uppercase tracking-wider">{t('cart_title').split(' ')[0]}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-extrabold text-[#C5A46D]">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR */}
      <nav className="hidden border-t border-[#222222] bg-[#161616] lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-2.5 text-xs font-medium tracking-wider uppercase">
          <button
            onClick={() => handleNav('/')}
            className={`transition-colors hover:text-[#C5A46D] ${
              currentPath === '/' ? 'text-[#C5A46D] font-bold border-b border-[#C5A46D]' : 'text-neutral-300'
            }`}
          >
            {t('nav_home')}
          </button>

          <button
            onClick={() => handleNav('/shop')}
            className={`transition-colors hover:text-[#C5A46D] ${
              currentPath === '/shop' ? 'text-[#C5A46D] font-bold border-b border-[#C5A46D]' : 'text-neutral-300'
            }`}
          >
            {t('nav_shop')}
          </button>

          {/* Categories Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1 text-neutral-300 transition-colors hover:text-[#C5A46D]"
            >
              <span>{t('nav_categories')}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="invisible absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-md border border-[#2B2B2B] bg-[#161616] py-2 shadow-2xl opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNav(`/shop?category=${cat.slug}`)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-xs text-neutral-300 hover:bg-[#222222] hover:text-[#C5A46D]"
                >
                  <span>{language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNav('/shop?tag=new')}
            className="text-neutral-300 transition-colors hover:text-[#C5A46D]"
          >
            {t('nav_new_arrivals')}
          </button>

          <button
            onClick={() => handleNav('/shop?tag=best')}
            className="text-neutral-300 transition-colors hover:text-[#C5A46D]"
          >
            {t('nav_best_sellers')}
          </button>

          <button
            onClick={() => handleNav('/shop?category=premium-panjabi')}
            className="flex items-center gap-1 text-[#C5A46D] font-semibold transition-colors hover:text-white"
          >
            <span>👑 {t('nav_panjabi')}</span>
          </button>

          <button
            onClick={() => handleNav('/shop?category=winter-collection')}
            className="flex items-center gap-1 text-neutral-300 transition-colors hover:text-[#C5A46D]"
          >
            <span>❄️ {t('nav_winter')}</span>
          </button>

          <button
            onClick={() => handleNav('/about')}
            className={`transition-colors hover:text-[#C5A46D] ${
              currentPath === '/about' ? 'text-[#C5A46D] font-bold' : 'text-neutral-300'
            }`}
          >
            {t('nav_about')}
          </button>

          <button
            onClick={() => handleNav('/contact')}
            className={`transition-colors hover:text-[#C5A46D] ${
              currentPath === '/contact' ? 'text-[#C5A46D] font-bold' : 'text-neutral-300'
            }`}
          >
            {t('nav_contact')}
          </button>
        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex w-4/5 max-w-sm flex-col bg-[#141414] text-white p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div className="font-serif text-lg font-bold text-[#C5A46D]">
                CLASSY NIRAB
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile language switch */}
            <div className="my-4 flex items-center justify-between rounded bg-[#1F1F1F] p-2 text-xs">
              <span className="text-neutral-400">Language / ভাষা</span>
              <div className="flex gap-1 font-bold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded ${language === 'en' ? 'bg-[#C5A46D] text-black' : 'text-neutral-300'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2.5 py-1 rounded ${language === 'bn' ? 'bg-[#C5A46D] text-black' : 'text-neutral-300'}`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm font-medium">
              <button
                onClick={() => handleNav('/')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_home')}
              </button>
              <button
                onClick={() => handleNav('/shop')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_shop')}
              </button>

              <div className="py-2">
                <p className="text-xs uppercase tracking-wider text-[#C5A46D] font-bold mb-2">
                  {t('nav_categories')}
                </p>
                <div className="grid grid-cols-1 gap-1.5 pl-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleNav(`/shop?category=${cat.slug}`)}
                      className="text-left py-1 text-xs text-neutral-300 hover:text-white"
                    >
                      • {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleNav('/shop?tag=new')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_new_arrivals')}
              </button>
              <button
                onClick={() => handleNav('/shop?tag=best')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_best_sellers')}
              </button>
              <button
                onClick={() => handleNav('/shop?category=premium-panjabi')}
                className="text-left py-2 border-b border-[#222222] text-[#C5A46D]"
              >
                👑 {t('nav_panjabi')}
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_about')}
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="text-left py-2 border-b border-[#222222] hover:text-[#C5A46D]"
              >
                {t('nav_contact')}
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="text-left py-2 font-bold text-[#C5A46D] flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('nav_admin')}</span>
                </button>
              )}
            </div>

            {/* Mobile Contact Quick */}
            <div className="mt-auto pt-6 border-t border-[#262626] text-xs text-neutral-400 space-y-2">
              <a
                href={`https://wa.me/88${settings.whatsapp || '01733044222'}`}
                className="flex items-center gap-2 text-white"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                WhatsApp: {settings.whatsapp || '01733044222'}
              </a>
              <a
                href={`tel:${settings.phone1 || '01733044222'}`}
                className="flex items-center gap-2 text-white"
              >
                <Phone className="h-4 w-4 text-[#C5A46D]" />
                Call: {settings.phone1 || '01733044222'}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
