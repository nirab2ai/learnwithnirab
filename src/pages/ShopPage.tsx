import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Product, Category, ClothingSize } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialTag?: string;
  initialView?: string;
  onSelectProduct: (productId: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  initialCategory,
  initialTag,
  initialView,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { wishlist } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<ClothingSize | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [priceMax, setPriceMax] = useState<number>(4500);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Wishlist view
        if (initialView === 'wishlist') {
          return wishlist.includes(p.id);
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Tag filter (new / best)
        if (initialTag === 'new' && !p.isNewArrival) return false;
        if (initialTag === 'best' && !p.isBestSeller) return false;

        // Size filter
        if (selectedSize !== 'all' && !p.sizes?.includes(selectedSize)) {
          return false;
        }

        // Price filter
        const price = p.discountPrice || p.price;
        if (price > priceMax) return false;

        // Stock filter
        if (onlyInStock && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'popular') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
  }, [
    products,
    selectedCategory,
    selectedSize,
    sortBy,
    priceMax,
    onlyInStock,
    initialTag,
    initialView,
    wishlist,
  ]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setPriceMax(4500);
    setOnlyInStock(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    priceMax < 4500 ||
    onlyInStock;

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Page Header */}
        <div className="mb-8 border-b border-[#E0E0DB] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
                EXCLUSIVE CATALOG
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
                {initialView === 'wishlist'
                  ? 'My Saved Wishlist'
                  : activeCategoryObj
                  ? language === 'bn' && activeCategoryObj.nameBn
                    ? activeCategoryObj.nameBn
                    : activeCategoryObj.name
                  : initialTag === 'new'
                  ? 'New Arrivals'
                  : initialTag === 'best'
                  ? 'Best Sellers'
                  : t('nav_shop')}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Showing {filteredProducts.length} luxury apparel items
              </p>
            </div>

            {/* Mobile Filter & Sort Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 rounded-sm border border-[#D5D5D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#111111] shadow-xs lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#C5A46D]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 rounded-sm border border-[#D5D5D0] bg-white px-3 py-1.5 text-xs text-[#111111] shadow-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium focus:outline-hidden"
                >
                  <option value="newest">{t('newest')}</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-asc">{t('price_low_high')}</option>
                  <option value="price-desc">{t('price_high_low')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded bg-[#111111] text-[#C5A46D] px-2.5 py-1 text-xs">
                  Category: {activeCategoryObj?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded bg-[#111111] text-white px-2.5 py-1 text-xs">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('all')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {priceMax < 4500 && (
                <span className="inline-flex items-center gap-1 rounded bg-[#111111] text-white px-2.5 py-1 text-xs">
                  Max: ৳{priceMax}
                  <button onClick={() => setPriceMax(4500)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 underline ml-2 hover:text-red-700"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 rounded-lg border border-[#E0E0DB] bg-white p-5 shadow-xs h-fit">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#111111]">
                Filter Catalog
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#C5A46D] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                {t('nav_categories')}
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex w-full items-center justify-between py-1 text-left transition-colors ${
                    selectedCategory === 'all'
                      ? 'font-bold text-[#C5A46D]'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>All Categories</span>
                  <span>({products.length})</span>
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.slug).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`flex w-full items-center justify-between py-1 text-left transition-colors ${
                        selectedCategory === c.slug
                          ? 'font-bold text-[#C5A46D]'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <span className="truncate">
                        {language === 'bn' && c.nameBn ? c.nameBn : c.name}
                      </span>
                      <span className="text-neutral-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="border-t border-[#E5E5E0] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                Select Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s as any)}
                    className={`rounded px-3 py-1 text-xs font-bold uppercase transition-all ${
                      selectedSize === s
                        ? 'bg-[#111111] text-[#C5A46D]'
                        : 'border border-[#DCDCD5] bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-[#E5E5E0] pt-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                <span>Max Price:</span>
                <span className="text-[#C5A46D]">৳{priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="4500"
                step="100"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#C5A46D]"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>৳500</span>
                <span>৳4,500</span>
              </div>
            </div>

            {/* In stock toggle */}
            <div className="border-t border-[#E5E5E0] pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-[#C5A46D]"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#D0D0CA] bg-white p-12 text-center">
                <Filter className="h-10 w-10 text-neutral-400 mb-3" />
                <h3 className="font-serif text-base font-bold text-[#111111]">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-5">
                  Try adjusting or clearing your filters to see more of our luxury apparel collection.
                </p>
                <button
                  onClick={clearFilters}
                  className="rounded-sm bg-[#111111] px-5 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-[#111111]">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-neutral-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category selection */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Category
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`block w-full text-left py-1 ${
                    selectedCategory === 'all' ? 'font-bold text-[#C5A46D]' : 'text-neutral-600'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block w-full text-left py-1 ${
                      selectedCategory === c.slug ? 'font-bold text-[#C5A46D]' : 'text-neutral-600'
                    }`}
                  >
                    {language === 'bn' && c.nameBn ? c.nameBn : c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-4 border-t border-[#E5E5E0] pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s as any)}
                    className={`rounded px-2.5 py-1 text-xs font-bold ${
                      selectedSize === s
                        ? 'bg-[#111111] text-[#C5A46D]'
                        : 'border border-[#D0D0CA] bg-neutral-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply & Close */}
            <div className="mt-auto pt-4 border-t border-[#E5E5E0] flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 rounded border border-[#D0D0CA] py-2 text-xs font-bold text-neutral-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded bg-[#111111] py-2 text-xs font-bold text-[#C5A46D]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
