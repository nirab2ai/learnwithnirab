import React, { useEffect, useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../firebase/services';
import { Order, OrderStatus, StoreSettings } from '../types';

interface MyOrdersPageProps {
  settings: StoreSettings;
  navigate: (path: string) => void;
  onSelectOrder: (order: Order) => void;
}

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
];

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  settings,
  navigate,
  onSelectOrder,
}) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (currentUser) {
      getCustomerOrders(currentUser.uid)
        .then((res) => setOrders(res || []))
        .catch((err) => console.error('Orders loading error:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Package className="h-12 w-12 text-[#C5A46D] mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
          Track Your Orders
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please sign in to view your real-time order history and fulfillment status.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 border-b border-[#E0E0DB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
              ORDER TRACKING
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
              My Orders & History
            </h1>
            <p className="text-xs text-neutral-500">
              Live status tracking for deliveries throughout Bangladesh.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="rounded-sm bg-[#111111] px-5 py-2.5 text-xs font-bold text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-colors"
          >
            Shop New Arrivals
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 text-xs font-semibold">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
            (s) => (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`rounded-full px-4 py-1.5 transition-all capitalize whitespace-nowrap ${
                  activeFilter === s
                    ? 'bg-[#111111] text-[#C5A46D] font-bold'
                    : 'bg-white border border-[#D5D5D0] text-neutral-600 hover:text-black'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-500">
            Loading your order records from secure Firestore...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D0D0CA] bg-white p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#111111]">
              No Orders Found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
              You don't have any orders under "{activeFilter}". Browse our curated collection to place an order.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="rounded-sm bg-[#C5A46D] px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-[#dfca9b]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === 'Cancelled';

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-[#E0E0DB] bg-white p-6 shadow-xs space-y-5"
                >
                  {/* Top order bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAEAE5] pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-neutral-900">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base font-bold text-[#C5A46D]">
                        ৳{order.total.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          onSelectOrder(order);
                          navigate(`/order-success?orderId=${order.id}`);
                        }}
                        className="flex items-center gap-1 rounded border border-[#D5D5D0] px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:border-black transition-all"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Status Tracker (If not cancelled) */}
                  {!isCancelled && (
                    <div className="py-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-[#EAEAE5] -z-0">
                          <div
                            className="h-full bg-[#C5A46D] transition-all duration-500"
                            style={{
                              width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-[#C5A46D] text-black shadow-md'
                                    : 'bg-white border-2 border-neutral-300 text-neutral-400'
                                } ${isCurrent ? 'ring-4 ring-[#C5A46D]/20' : ''}`}
                              >
                                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                              </div>
                              <span
                                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  isDone ? 'text-black' : 'text-neutral-400'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="divide-y divide-neutral-100 rounded-lg border border-[#EAEAE5] overflow-hidden">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 text-xs bg-[#FAFAF8]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-10 rounded object-cover border border-[#E0E0DB]"
                          />
                          <div>
                            <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                            <p className="text-[10px] text-neutral-500">
                              Size: <strong>{item.size}</strong> {item.color && `• Color: ${item.color}`} • Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-neutral-900">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details: Address & WhatsApp quick link */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-600 gap-3 border-t border-[#EAEAE5] pt-3">
                    <div>
                      <span className="font-bold text-neutral-900">Destination: </span>
                      <span>
                        {order.deliveryAddress}, {order.district} ({order.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/88${settings.whatsapp || '01733044222'}?text=${encodeURIComponent(
                        `Hello Classy Nirab, I am inquiring about Order #${order.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Support for this Order</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
