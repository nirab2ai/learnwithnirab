import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ClothingSize } from '../../types';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { language, t } = useLanguage();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(product.sizes?.[0] || 'L');
  const [isAdded, setIsAdded] = useState(false);

  const inWish = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=700';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleSizeClick = (e: React.MouseEvent, size: ClothingSize) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  return (
    <div
      onClick={() => onSelect(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-md border border-[#E5E5E0] bg-white transition-all duration-300 hover:border-[#C5A46D] hover:shadow-xl cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-100">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="rounded-xs bg-[#C5A46D] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow-md">
              BEST SELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-xs bg-[#111111] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-xs bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-md transition-all hover:scale-110 ${
            inWish ? 'text-red-500' : 'text-neutral-500 hover:text-black'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`h-4 w-4 ${inWish ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-2 bottom-2 hidden flex-col gap-1.5 transition-all duration-200 group-hover:flex">
          {/* Quick sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div
              className="flex justify-center gap-1 rounded bg-black/70 backdrop-blur-xs p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => handleSizeClick(e, s)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${
                    selectedSize === s
                      ? 'bg-[#C5A46D] text-black'
                      : 'text-neutral-200 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`flex w-full items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
              product.stock <= 0
                ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#111111] text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added to Bag</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>+ Add to Bag ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details info */}
      <div className="flex flex-1 flex-col p-3.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          {product.categoryName || product.category.replace('-', ' ')}
        </span>

        <h3 className="mt-1 line-clamp-1 font-serif text-sm font-semibold text-[#111111] transition-colors group-hover:text-[#C5A46D]">
          {language === 'bn' && product.nameBn ? product.nameBn : product.name}
        </h3>

        {/* Price display */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold text-[#111111]">
              ৳{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock hint */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] font-medium text-amber-600">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-3 block lg:hidden">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-1 rounded bg-[#111111] py-1.5 text-[11px] font-bold text-white hover:bg-[#C5A46D] hover:text-black"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>{product.stock <= 0 ? 'Out of Stock' : t('add_to_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
