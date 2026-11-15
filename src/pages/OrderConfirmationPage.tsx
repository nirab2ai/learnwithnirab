import React from 'react';
import {
  CheckCircle2,
  Package,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Printer,
} from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrderConfirmationPageProps {
  order: Order | null;
  settings: StoreSettings;
  navigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  navigate,
}) => {
  const { t } = useLanguage();

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Package className="h-12 w-12 text-[#C5A46D] mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          Order Not Found
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Could not locate the requested order receipt.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const whatsappConfirmLink = `https://wa.me/88${settings.whatsapp || '01733044222'}?text=${encodeURIComponent(
    `Hello Classy Nirab, I just placed Order #${order.orderNumber} for ৳${order.total.toLocaleString()} (${order.customerName}, Phone: ${order.customerPhone}). Please confirm delivery.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Success Header Box */}
        <div className="rounded-xl border border-[#E0E0DB] bg-white p-8 text-center shadow-sm mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
            Thank You For Shopping With Us!
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2">
            Your order has been registered in our system. Our team will verify and dispatch your package shortly.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D5D5D0] bg-[#FAFAF8] px-4 py-2 text-xs font-bold text-[#111111]">
            <span>Order Reference:</span>
            <span className="font-mono text-[#C5A46D]">{order.orderNumber}</span>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappConfirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#1ebd59] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Confirm on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-sm border border-[#D5D5D0] bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:border-black transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className="rounded-xl border border-[#E0E0DB] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Invoice Details
              </h3>
              <p className="text-[11px] text-neutral-400">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 uppercase">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-[#EAEAE5] pb-6">
            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Recipient Details
              </h4>
              <p className="font-semibold text-neutral-800">{order.customerName}</p>
              <p className="text-neutral-600">Phone: {order.customerPhone}</p>
              {order.customerEmail && (
                <p className="text-neutral-600">Email: {order.customerEmail}</p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Delivery Address
              </h4>
              <p className="text-neutral-700 leading-relaxed">{order.deliveryAddress}</p>
              <p className="text-neutral-600 font-semibold mt-1">
                District: {order.district} ({order.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
              </p>
              {order.orderNotes && (
                <p className="text-neutral-500 italic mt-1">Note: "{order.orderNotes}"</p>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-xs mb-3">
              Items Purchased
            </h4>
            <div className="divide-y divide-neutral-100 border rounded-lg border-[#EAEAE5] overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 text-xs bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-10 rounded object-cover border border-[#E0E0DB]"
                    />
                    <div>
                      <h5 className="font-semibold text-neutral-900">{item.name}</h5>
                      <p className="text-[10px] text-neutral-500">
                        Size: {item.size} {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 border-t border-[#EAEAE5] pt-4 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-neutral-900">
                {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Payment Method</span>
              <span className="font-semibold text-neutral-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-[#EAEAE5] pt-3 text-base font-bold text-neutral-900">
              <span>Total Payable Amount</span>
              <span className="font-serif text-xl text-[#C5A46D]">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full sm:w-auto rounded-sm border border-[#D5D5D0] bg-white px-6 py-3 text-xs font-bold text-neutral-800 hover:border-black transition-all"
          >
            View in My Orders
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-[#111111] px-8 py-3 text-xs font-extrabold uppercase tracking-widest text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-all shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
