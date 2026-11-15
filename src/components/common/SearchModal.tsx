import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onSelectProduct: (productId: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { language, t } = useLanguage();

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.nameBn && p.nameBn.includes(term)) ||
          p.category.toLowerCase().includes(term) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(term))
      )
      .slice(0, 8);
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-xl border border-[#2B2B2B] bg-[#141414] p-5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
          <Search className="h-5 w-5 text-[#C5A46D] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            autoFocus
            className="w-full bg-transparent text-base font-medium text-white placeholder-neutral-500 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded p-1 text-xs text-neutral-400 hover:bg-[#222222] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Popular Categories Shortcut */}
        {!searchTerm && (
          <div className="pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Popular Collections
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.slug);
                    onClose();
                  }}
                  className="rounded-full border border-[#2E2E2E] bg-[#1C1C1C] px-3 py-1.5 text-xs text-neutral-300 hover:border-[#C5A46D] hover:text-[#C5A46D]"
                >
                  {language === 'bn' && c.nameBn ? c.nameBn : c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {searchTerm && (
          <div className="pt-4 max-h-96 overflow-y-auto space-y-2">
            <div className="text-xs text-neutral-400 pb-1">
              Found {results.length} results for "{searchTerm}":
            </div>

            {results.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No products found matching "{searchTerm}". Try searching for Polo, Panjabi, T-Shirt, or Denim.
              </div>
            ) : (
              results.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod.id);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-lg border border-[#222222] bg-[#1A1A1A] p-2.5 hover:border-[#C5A46D] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200'}
                      alt={prod.name}
                      className="h-12 w-10 rounded object-cover border border-[#2E2E2E]"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {language === 'bn' && prod.nameBn ? prod.nameBn : prod.name}
                      </h4>
                      <p className="text-[10px] text-[#C5A46D] uppercase font-bold">
                        {prod.categoryName || prod.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xs font-bold text-white">
                      ৳{(prod.discountPrice || prod.price).toLocaleString()}
                    </span>
                    <ArrowRight className="h-4 w-4 text-neutral-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
