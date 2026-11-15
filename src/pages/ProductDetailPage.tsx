import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  MessageCircle,
  Share2,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { Product, ClothingSize, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  settings: StoreSettings;
  navigate: (path: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  settings,
  navigate,
  onSelectProduct,
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { language, t } = useLanguage();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(product.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addedNotice, setAddedNotice] = useState(false);
  const [reviewNotice, setReviewNotice] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900'];

  const currentImage = images[activeImageIndex] || images[0];

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const savings = hasDiscount ? product.price - product.discountPrice! : 0;
  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Classy Nirab, I would like to order:
Product: ${product.name}
Size: ${selectedSize}
Color: ${selectedColor || 'Default'}
Quantity: ${quantity}
Price: ৳${(currentPrice * quantity).toLocaleString()}
Please confirm delivery details.`
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Collections</span>
        </button>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 bg-white p-6 sm:p-10 rounded-xl border border-[#E0E0DB] shadow-xs">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Primary Display */}
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-neutral-100 border border-[#E8E8E3]">
              <img
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover object-top"
              />

              {hasDiscount && (
                <div className="absolute top-3 left-3 rounded-xs bg-red-600 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                  SAVE ৳{savings.toLocaleString()}
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-md transition-all hover:scale-110 ${
                  inWish ? 'text-red-500' : 'text-neutral-500 hover:text-black'
                }`}
                title="Wishlist"
              >
                <Heart className={`h-5 w-5 ${inWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#C5A46D] shadow-md scale-105'
                        : 'border-[#E8E8E3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchasing & Specifications */}
          <div className="flex flex-col space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A46D]">
                {product.categoryName || product.category.replace('-', ' ')}
              </span>

              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
                {product.name}
              </h1>

              {product.nameBn && (
                <p className="font-sans text-sm text-neutral-500 mt-0.5">
                  {product.nameBn}
                </p>
              )}

              {/* Rating & Stock */}
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="font-bold text-neutral-700 ml-1">4.9</span>
                  <span className="text-neutral-400">(42 Reviews)</span>
                </div>

                <span className="text-neutral-300">|</span>

                <div className="flex items-center gap-1.5 font-bold">
                  {product.stock > 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      In Stock ({product.stock} Units)
                    </span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="rounded-lg bg-[#F9F9F7] p-4 border border-[#E8E8E3]">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-[#111111]">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-medium text-neutral-400 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs font-bold">
                    Special Offer
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Prices include all VAT & taxes. Cash on delivery available nationwide.
              </p>
            </div>

            {/* Color variants selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
                  <span>SELECT COLOR:</span>
                  <span className="text-[#C5A46D]">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`rounded-sm px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        selectedColor === c
                          ? 'bg-[#111111] text-[#C5A46D] ring-2 ring-[#C5A46D]'
                          : 'border border-[#D0D0CA] bg-white text-neutral-700 hover:border-black'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector & Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
                  <span>SELECT SIZE:</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#C5A46D] hover:underline"
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    <span>{t('size_guide')}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`flex h-11 w-12 items-center justify-center rounded-sm text-xs font-bold uppercase transition-all ${
                        selectedSize === s
                          ? 'bg-[#111111] text-[#C5A46D] shadow-md ring-2 ring-[#C5A46D]'
                          : 'border border-[#D0D0CA] bg-white text-neutral-800 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <span className="text-xs font-bold text-neutral-800 mb-2 block">
                QUANTITY:
              </span>
              <div className="flex w-32 items-center rounded-sm border border-[#D0D0CA] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm font-bold text-neutral-600 hover:text-black"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold text-neutral-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="px-3 py-2 text-sm font-bold text-neutral-600 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex items-center justify-center gap-2 rounded-sm py-3.5 text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-98 ${
                    addedNotice
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-[#C5A46D]'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>{t('add_to_cart')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 rounded-sm bg-[#C5A46D] py-3.5 text-xs font-extrabold uppercase tracking-widest text-black shadow-lg shadow-[#c5a46d]/20 hover:bg-[#dfca9b] active:scale-98 transition-all"
                >
                  <span>{t('buy_now')}</span>
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/88${settings.whatsapp || '01733044222'}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 text-xs font-bold uppercase tracking-wider text-black shadow-md hover:bg-[#20ba59] transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t('whatsapp_order')}</span>
              </a>
            </div>

            {/* Delivery & Service Assurances */}
            <div className="rounded-lg border border-[#E5E5E0] bg-[#FAFAF8] p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-neutral-700">
                <ShieldCheck className="h-4 w-4 text-[#C5A46D] shrink-0" />
                <span>Cash on delivery available all across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Truck className="h-4 w-4 text-[#C5A46D] shrink-0" />
                <span>Inside Dhaka: 24-48 Hours (৳70) | Outside Dhaka: 48-72 Hours (৳130)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <RotateCcw className="h-4 w-4 text-[#C5A46D] shrink-0" />
                <span>7-Day easy size exchange guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Fabric Specs, Reviews) */}
        <div className="mt-12 rounded-xl border border-[#E0E0DB] bg-white p-6 sm:p-10 shadow-xs">
          <div className="flex border-b border-[#E5E5E0] gap-6 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'desc'
                  ? 'border-[#C5A46D] text-[#111111]'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-[#C5A46D] text-[#111111]'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Fabric & Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-[#C5A46D] text-[#111111]'
                  : 'border-transparent text-neutral-400 hover:text-black'
              }`}
            >
              Reviews (42)
            </button>
          </div>

          <div className="py-6 text-xs text-neutral-700 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm font-medium text-neutral-800">
                  {product.description}
                </p>
                {product.descriptionBn && (
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-4 rounded-md border border-neutral-200">
                    {product.descriptionBn}
                  </p>
                )}
                <div className="pt-2">
                  <h4 className="font-bold text-[#111111] uppercase tracking-wider mb-2">
                    Key Features:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Engineered with long-staple compact combed luxury yarn</li>
                    <li>Anti-pilling treatment for lasting smooth drape</li>
                    <li>Reinforced stitching along critical tension points</li>
                    <li>Pre-washed to minimize shrinkage and ensure optimal comfort</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4 max-w-xl">
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-3">
                  <span className="font-bold text-neutral-900">Material Composition:</span>
                  <span>{product.fabric || '100% Combed Compact Cotton (220 GSM)'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-3">
                  <span className="font-bold text-neutral-900">Care Instructions:</span>
                  <span>{product.careInstructions || 'Machine wash cold, do not bleach, warm iron.'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-3">
                  <span className="font-bold text-neutral-900">Country of Origin:</span>
                  <span>Bangladesh (Bespoke Handcrafted)</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-2xl">
                <div className="rounded-lg bg-[#FAFAF8] p-5 border border-[#E8E8E3] flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-extrabold font-serif text-[#111111]">4.9</span>
                    <span className="text-xs text-neutral-400"> / 5.0</span>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setReviewNotice(true);
                      setTimeout(() => setReviewNotice(false), 3500);
                    }}
                    className="rounded bg-[#111111] px-4 py-2 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {reviewNotice && (
                  <div className="rounded bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                    Review submission is open to verified purchasers upon order delivery.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111111]">Farhan S. (Dhaka)</span>
                      <span className="text-neutral-400 text-[11px]">2 days ago</span>
                    </div>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-600">
                      Top tier finish! The fabric has a premium sheen that looks identical to luxury designer brands. Will order more colors soon.
                    </p>
                  </div>

                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111111]">Kazi N. (Sylhet)</span>
                      <span className="text-neutral-400 text-[11px]">1 week ago</span>
                    </div>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-600">
                      Fitting is exact according to the size chart. Very comfortable in humid weather. Excellent support via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Items Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 border-b border-[#E0E0DB] pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
                COMPLETE THE LOOK
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mt-1">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};
