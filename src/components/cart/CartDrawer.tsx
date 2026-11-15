import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    deliveryZone,
    setDeliveryZone,
  } = useCart();

  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-[#141414] text-white shadow-2xl border-l border-[#262626] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#C5A46D]" />
            <h2 className="font-serif text-lg font-bold tracking-wide text-white">
              {t('cart_title')} ({cart.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-1 text-neutral-400 hover:bg-[#222222] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#1A1A1A] p-3 text-xs border-b border-[#262626]">
          <div className="flex items-center justify-between text-neutral-300 font-medium mb-1.5">
            {amountNeeded > 0 ? (
              <span>
                Add <strong className="text-[#C5A46D]">৳{amountNeeded}</strong> more for{' '}
                <strong className="text-white">FREE DELIVERY</strong> across Bangladesh!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                Congratulations! You unlocked FREE DELIVERY!
              </span>
            )}
            <span className="text-neutral-400">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
            <div
              className="h-full bg-linear-to-r from-[#C5A46D] to-[#E3CBA0] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F1F1F] text-[#C5A46D] mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-base font-bold text-white mb-1">
                {t('cart_empty')}
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mb-6">
                {t('cart_empty_sub')}
              </p>
              <button
                onClick={handleContinueShopping}
                className="rounded-sm bg-[#C5A46D] px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-[#dfca9b]"
              >
                {t('continue_shopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3 rounded-lg border border-[#262626] bg-[#1A1A1A] p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-16 rounded object-cover border border-[#333333] shrink-0"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-neutral-500 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                      <span className="rounded bg-[#282828] px-1.5 py-0.5 font-bold text-white">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="rounded bg-[#282828] px-1.5 py-0.5">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded border border-[#333333] bg-[#222222]">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="p-1 hover:text-[#C5A46D]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="p-1 hover:text-[#C5A46D]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#C5A46D]">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer calculation */}
        {cart.length > 0 && (
          <div className="border-t border-[#262626] bg-[#161616] p-4 sm:p-5 space-y-3">
            {/* Delivery zone radio */}
            <div className="rounded bg-[#1F1F1F] p-2.5 text-xs border border-[#2B2B2B]">
              <div className="font-semibold text-neutral-300 mb-1.5">Delivery Destination:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('inside_dhaka')}
                  className={`rounded p-1.5 text-center transition-all ${
                    deliveryZone === 'inside_dhaka'
                      ? 'bg-[#C5A46D] text-black font-bold'
                      : 'bg-[#282828] text-neutral-300 hover:bg-[#333333]'
                  }`}
                >
                  Inside Dhaka (৳70)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside_dhaka')}
                  className={`rounded p-1.5 text-center transition-all ${
                    deliveryZone === 'outside_dhaka'
                      ? 'bg-[#C5A46D] text-black font-bold'
                      : 'bg-[#282828] text-neutral-300 hover:bg-[#333333]'
                  }`}
                >
                  Outside Dhaka (৳130)
                </button>
              </div>
            </div>

            {/* Subtotal & Delivery Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-white">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>{t('delivery_fee')}</span>
                <span className="font-semibold text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase">Free</span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#2B2B2B] pt-2 text-sm font-bold text-white">
                <span>{t('total')}</span>
                <span className="text-base text-[#C5A46D]">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#C5A46D] py-3 text-xs font-bold tracking-widest text-black uppercase hover:bg-[#dfca9b] active:scale-98 transition-all shadow-lg shadow-[#c5a46d]/20"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <button
                  onClick={clearCart}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Clear Bag
                </button>
                <div className="flex items-center gap-1 text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C5A46D]" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
