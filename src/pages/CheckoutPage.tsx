import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { createOrder } from '../firebase/services';
import { DeliveryZone, Order, PaymentMethod } from '../types';

interface CheckoutPageProps {
  navigate: (path: string) => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate, onOrderCompleted }) => {
  const { cart, subtotal, deliveryFee, total, deliveryZone, setDeliveryZone, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { language, t } = useLanguage();

  // Form states
  const [fullName, setFullName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [district, setDistrict] = useState(userProfile?.district || 'Dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="rounded-sm bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
        >
          Explore Luxury Collections
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full recipient name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[- ]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01733044222).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please enter your detailed street and delivery address.');
      return;
    }

    setLoading(true);

    try {
      const orderNumber = `SCN-${Date.now().toString().slice(-6)}`;
      const orderPayload = {
        orderNumber,
        customerId: currentUser?.uid || 'guest_' + cleanPhone,
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        customerEmail: email.trim() || undefined,
        deliveryAddress: address.trim(),
        district,
        deliveryArea: deliveryZone,
        orderNotes: orderNotes.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        status: 'Pending' as const,
      };

      const placedOrder = await createOrder(orderPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A46D', '#111111', '#DFCA9B', '#FFFFFF'],
        });
      } catch {
        // ignore if canvas unsupported
      }

      clearCart();
      onOrderCompleted(placedOrder);
      navigate(`/order-success?orderId=${placedOrder.id}`);
    } catch (error) {
      console.error('Order creation error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to place order. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Shopping</span>
        </button>

        <div className="mb-8 border-b border-[#E0E0DB] pb-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
            SECURE CHECKOUT
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#111111] mt-1">
            Complete Your Order
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Fast, secure shipping across all 64 districts in Bangladesh.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Shipping & Customer Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact & Delivery Info */}
            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
                <h3 className="font-serif text-base font-bold text-[#111111]">
                  1. Delivery Information
                </h3>
                <span className="text-[11px] font-semibold text-[#C5A46D]">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Mobile Number (11 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Delivery Zone selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Delivery Zone *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setDeliveryZone('inside_dhaka');
                      setDistrict('Dhaka');
                    }}
                    className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-[#C5A46D] bg-[#C5A46D]/10 ring-1 ring-[#C5A46D]'
                        : 'border-[#E0E0DB] bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Inside Dhaka
                      </span>
                      <span className="text-xs font-bold text-[#C5A46D]">
                        {subtotal >= 2500 ? 'FREE' : '৳70'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Delivery in 24 - 48 Hours
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryZone('outside_dhaka')}
                    className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-[#C5A46D] bg-[#C5A46D]/10 ring-1 ring-[#C5A46D]'
                        : 'border-[#E0E0DB] bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Outside Dhaka
                      </span>
                      <span className="text-xs font-bold text-[#C5A46D]">
                        {subtotal >= 2500 ? 'FREE' : '৳130'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Delivery in 48 - 72 Hours (64 Districts)
                    </p>
                  </div>
                </div>
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Select District *
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const d = e.target.value;
                    setDistrict(d);
                    if (d === 'Dhaka') {
                      setDeliveryZone('inside_dhaka');
                    } else {
                      setDeliveryZone('outside_dhaka');
                    }
                  }}
                  className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Street Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Detailed Address (House, Road, Area, Thana) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House #14, Road #7, Sector #4, Uttara, Dhaka"
                  className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] focus:outline-hidden"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Order Notes / Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before arrival, leave with security, etc."
                  className="w-full rounded-md border border-[#D0D0CA] bg-white px-3.5 py-2.5 text-xs text-neutral-900 focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
                <h3 className="font-serif text-base font-bold text-[#111111]">
                  2. Payment Method
                </h3>
                <span className="text-[11px] font-semibold text-[#C5A46D]">Step 2 of 2</span>
              </div>

              {/* Cash on delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#C5A46D] bg-[#FAFAF8] ring-1 ring-[#C5A46D]'
                    : 'border-[#E0E0DB] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-[#C5A46D] h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Pay in cash upon receiving and checking your luxury apparel at your doorstep.
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-[#C5A46D] shrink-0" />
                </div>
              </div>

              {/* Digital payment option notes */}
              <div className="rounded-lg border border-[#E0E0DB] bg-neutral-50 p-3.5 text-xs text-neutral-600">
                <div className="font-semibold text-neutral-800 mb-1">
                  Want to pay via bKash / Nagad?
                </div>
                <p className="text-[11px] text-neutral-500">
                  Select Cash on Delivery now and reply to our confirmation call/WhatsApp if you prefer to send payment via merchant bKash or Nagad.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-sm space-y-5">
              <h3 className="font-serif text-base font-bold text-[#111111] border-b border-[#EAEAE5] pb-3">
                Order Summary ({cart.length} Items)
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex items-center gap-3 pt-3 first:pt-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-12 rounded object-cover border border-[#E0E0DB] shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <h4 className="font-semibold text-neutral-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Size: <strong className="text-black">{item.size}</strong>{' '}
                        {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-xs font-bold text-neutral-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 border-t border-[#EAEAE5] pt-4 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee ({deliveryZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="font-semibold text-neutral-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EAEAE5] pt-3 text-base font-bold text-neutral-900">
                  <span>Grand Total</span>
                  <span className="font-serif text-xl text-[#C5A46D]">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#111111] py-4 text-xs font-extrabold uppercase tracking-widest text-[#C5A46D] shadow-xl hover:bg-[#C5A46D] hover:text-black transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span>Registering Order...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>{t('place_order')} (৳{total.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-neutral-500 space-y-1">
                <p>🔒 256-Bit SSL Encrypted & Verified by Classy Nirab.</p>
                <p>By placing order, you agree to our 7-Day Exchange policy.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
