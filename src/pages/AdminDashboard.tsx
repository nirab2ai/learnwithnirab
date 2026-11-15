import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Settings,
  Image as ImageIcon,
  Layers,
  Phone,
  MessageCircle,
  RefreshCw,
  Search,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Product,
  Category,
  Order,
  Banner,
  StoreSettings,
  OrderStatus,
  ClothingSize,
} from '../types';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  subscribeAllOrders,
  updateOrderStatus,
  saveCategory,
  saveBanner,
  deleteBanner,
  updateStoreSettings,
  seedInitialDatabase,
} from '../firebase/services';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: StoreSettings;
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  banners,
  settings,
  navigate,
}) => {
  const { currentUser, isAdmin, isOwner } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'banners' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string>('');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [pName, setPName] = useState('');
  const [pNameBn, setPNameBn] = useState('');
  const [pCategory, setPCategory] = useState('premium-polo');
  const [pPrice, setPPrice] = useState(1500);
  const [pDiscountPrice, setPDiscountPrice] = useState<number | undefined>(undefined);
  const [pStock, setPStock] = useState(30);
  const [pSizes, setPSizes] = useState<ClothingSize[]>(['M', 'L', 'XL']);
  const [pColors, setPColors] = useState('Black, Navy, Beige');
  const [pImages, setPImages] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pDescBn, setPDescBn] = useState('');
  const [pFabric, setPFabric] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsBestSeller, setPIsBestSeller] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(true);

  // Settings Form State
  const [sStoreName, setSStoreName] = useState(settings.storeName || 'SHOP WITH CLASSY NIRAB');
  const [sTagline, setSTagline] = useState(settings.tagline || 'STYLE • QUALITY • ELEGANCE');
  const [sPhone1, setSPhone1] = useState(settings.phone1 || '01733044222');
  const [sPhone2, setSPhone2] = useState(settings.phone2 || '01726590653');
  const [sWhatsapp, setSWhatsapp] = useState(settings.whatsapp || '01733044222');
  const [sEmail, setSEmail] = useState(settings.email || 'nirab2ai@gmail.com');
  const [sFacebook, setSFacebook] = useState(settings.facebookUrl || 'https://www.facebook.com/profile.php?id=61594699696202');
  const [sFeeDhaka, setSFeeDhaka] = useState(settings.deliveryFeeInsideDhaka || 70);
  const [sFeeOutside, setSFeeOutside] = useState(settings.deliveryFeeOutsideDhaka || 130);
  const [sAnnouncement, setSAnnouncement] = useState(settings.announcement || '');
  const [sLogoUrl, setSLogoUrl] = useState(settings.logoUrl || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Listen to live orders
  useEffect(() => {
    if (isAdmin || isOwner) {
      const unsub = subscribeAllOrders((data) => {
        setOrders(data);
      });
      return () => unsub();
    }
  }, [isAdmin, isOwner]);

  // Sync settings state when prop changes
  useEffect(() => {
    setSStoreName(settings.storeName);
    setSTagline(settings.tagline);
    setSPhone1(settings.phone1);
    setSPhone2(settings.phone2);
    setSWhatsapp(settings.whatsapp);
    setSEmail(settings.email);
    setSFacebook(settings.facebookUrl);
    setSFeeDhaka(settings.deliveryFeeInsideDhaka);
    setSFeeOutside(settings.deliveryFeeOutsideDhaka);
    setSAnnouncement(settings.announcement);
    setSLogoUrl(settings.logoUrl || '');
  }, [settings]);

  // Security check: Only owner or admin allowed
  if (!currentUser || (!isAdmin && !isOwner)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#F7F7F5]">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
            PROTECTED RESTRICTED AREA
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111111] mt-1 mb-2">
            Administrator Access Only
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6">
            This dashboard contains privileged store operations, order fulfillment controls, inventory management and store security settings. Only the verified store owner (<strong>nirab2ai@gmail.com</strong>) may authenticate.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-sm bg-[#111111] py-3 text-xs font-bold uppercase tracking-widest text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black transition-all"
          >
            Sign in as Store Owner
          </button>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone)).size;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPNameBn('');
    setPCategory('premium-polo');
    setPPrice(1500);
    setPDiscountPrice(undefined);
    setPStock(30);
    setPSizes(['M', 'L', 'XL']);
    setPColors('Black, Navy, Beige');
    setPImages('https://images.unsplash.com/photo-1625910513413-5353d2bf2eb8?q=80&w=800');
    setPDesc('Crafted from luxury double-mercerized Egyptian cotton with tailored fit.');
    setPDescBn('');
    setPFabric('100% Egyptian Cotton');
    setPIsFeatured(true);
    setPIsBestSeller(false);
    setPIsNewArrival(true);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPNameBn(prod.nameBn || '');
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPDiscountPrice(prod.discountPrice);
    setPStock(prod.stock);
    setPSizes(prod.sizes || ['M', 'L', 'XL']);
    setPColors(prod.colors?.join(', ') || '');
    setPImages(prod.images?.join('\n') || '');
    setPDesc(prod.description);
    setPDescBn(prod.descriptionBn || '');
    setPFabric(prod.fabric || '');
    setPIsFeatured(!!prod.isFeatured);
    setPIsBestSeller(!!prod.isBestSeller);
    setPIsNewArrival(!!prod.isNewArrival);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = (pName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)).slice(0, 180);
    const imagesList = pImages
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const colorsList = pColors
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const categoryObj = categories.find((c) => c.slug === pCategory);

    const productPayload = {
      name: pName.trim(),
      nameBn: pNameBn.trim() || undefined,
      slug,
      description: pDesc.trim(),
      descriptionBn: pDescBn.trim() || undefined,
      price: Number(pPrice),
      discountPrice: pDiscountPrice ? Number(pDiscountPrice) : undefined,
      stock: Number(pStock),
      category: pCategory,
      categoryName: categoryObj?.name || pCategory,
      sizes: pSizes,
      colors: colorsList,
      images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
      isFeatured: pIsFeatured,
      isBestSeller: pIsBestSeller,
      isNewArrival: pIsNewArrival,
      fabric: pFabric.trim() || undefined,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      setProductModalOpen(false);
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStoreSettings({
        storeName: sStoreName.trim(),
        tagline: sTagline.trim(),
        phone1: sPhone1.trim(),
        phone2: sPhone2.trim(),
        whatsapp: sWhatsapp.trim(),
        email: sEmail.trim(),
        facebookUrl: sFacebook.trim(),
        deliveryFeeInsideDhaka: Number(sFeeDhaka),
        deliveryFeeOutsideDhaka: Number(sFeeOutside),
        announcement: sAnnouncement.trim(),
        logoUrl: sLogoUrl.trim() || undefined,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
    }
  };

  const handleSeedDatabase = async () => {
    setSeedingLoading(true);
    setSeedNotice('');
    const res = await seedInitialDatabase();
    setSeedingLoading(false);
    setSeedNotice(res.message);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const term = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Top Admin Bar */}
      <div className="border-b border-[#222222] bg-[#161616] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#C5A46D] text-black font-extrabold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold tracking-wider text-white">
                  CLASSY NIRAB ADMIN
                </span>
                <span className="rounded bg-[#C5A46D]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#C5A46D] border border-[#C5A46D]/30">
                  Store Owner
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Logged in as <strong>{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 rounded border border-[#333333] bg-[#222222] px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Live Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#262626] pb-4 mb-8 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'banners', label: `Banners (${banners.length})`, icon: ImageIcon },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-sm px-4 py-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#C5A46D] text-black font-bold shadow-lg shadow-[#c5a46d]/15'
                    : 'bg-[#1C1C1C] text-neutral-300 hover:bg-[#282828] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Total Gross Revenue
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C5A46D] mt-1">
                  ৳{totalRevenue.toLocaleString()}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  From {nonCancelledOrders.length} confirmed purchases
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Pending Orders
                  </span>
                  {pendingOrders > 0 && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                  {pendingOrders}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Awaiting confirmation / dispatch
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Total Catalog Items
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {products.length}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Across {categories.length} luxury categories
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Unique Customers
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {uniqueCustomers}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Registered by phone number
                </p>
              </div>
            </div>

            {/* Quick Actions & Seeding Utility */}
            <div className="rounded-xl border border-[#2B2B2B] bg-[#161616] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <Database className="h-4 w-4 text-[#C5A46D]" />
                    <span>Firestore Database Bootstrap & Synchronization</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Seed or restore all 10 standard luxury categories, products, banners and settings into your Cloud Firestore database.
                  </p>
                </div>

                <button
                  onClick={handleSeedDatabase}
                  disabled={seedingLoading}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#C5A46D] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#dfca9b] disabled:opacity-50 transition-all shrink-0"
                >
                  <RefreshCw className={`h-4 w-4 ${seedingLoading ? 'animate-spin' : ''}`} />
                  <span>{seedingLoading ? 'Seeding Firestore...' : 'Seed Catalog to Firestore'}</span>
                </button>
              </div>

              {seedNotice && (
                <div className="rounded bg-emerald-950/50 p-3 text-xs text-emerald-300 border border-emerald-800">
                  {seedNotice}
                </div>
              )}
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-xl border border-[#262626] bg-[#161616] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-white">
                  Recent Inbound Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#C5A46D] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No orders placed yet. Orders will appear here live when customers checkout.
                </div>
              ) : (
                <div className="divide-y divide-[#222222]">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            #{ord.orderNumber}
                          </span>
                          <span className="rounded bg-[#252525] px-2 py-0.5 text-[10px] text-neutral-300">
                            {ord.customerName}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {ord.customerPhone}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {ord.items?.length || 0} items • {ord.deliveryAddress}, {ord.district}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sm font-bold text-[#C5A46D]">
                          ৳{ord.total.toLocaleString()}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="rounded border border-[#333333] bg-[#222222] px-2 py-1 text-xs font-semibold text-white focus:outline-hidden"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Order Management
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage fulfillment status and contact customers for delivery confirmation.
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex gap-1.5 overflow-x-auto text-xs">
                {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setOrderStatusFilter(s)}
                      className={`rounded px-3 py-1.5 font-semibold capitalize whitespace-nowrap ${
                        orderStatusFilter === s
                          ? 'bg-[#C5A46D] text-black font-bold'
                          : 'bg-[#222222] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-12 text-center text-xs text-neutral-400">
                No orders matching filter "{orderStatusFilter}".
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="rounded-xl border border-[#2B2B2B] bg-[#161616] p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#C5A46D]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className={`rounded border px-2.5 py-1 text-xs font-bold uppercase ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                              : ord.status === 'Cancelled'
                              ? 'bg-red-950 text-red-400 border-red-700'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-950 text-blue-400 border-blue-700'
                              : 'bg-[#222222] text-[#C5A46D] border-[#444444]'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Delivery row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <strong className="text-neutral-400 block mb-1">Customer:</strong>
                        <span className="font-bold text-white text-sm block">
                          {ord.customerName}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="flex items-center gap-1 text-[#C5A46D] hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{ord.customerPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/88${ord.customerPhone}?text=Hello%20${encodeURIComponent(
                              ord.customerName
                            )},%20this%20is%20Classy%20Nirab%20regarding%20your%20Order%20#${ord.orderNumber}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#25D366] hover:underline font-bold"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <strong className="text-neutral-400 block mb-1">
                          Delivery Destination:
                        </strong>
                        <p className="text-neutral-200 leading-relaxed">
                          {ord.deliveryAddress}, {ord.district} (
                          {ord.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                        </p>
                        {ord.orderNotes && (
                          <p className="text-amber-400/90 text-[11px] mt-1">
                            Note: "{ord.orderNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="rounded border border-[#262626] bg-[#121212] p-3 divide-y divide-[#1F1F1F]">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="h-10 w-9 rounded object-cover"
                            />
                            <div>
                              <span className="font-semibold text-white">{item.name}</span>
                              <span className="text-[11px] text-neutral-400 ml-2">
                                (Size: {item.size} {item.color && `• ${item.color}`} • Qty:{' '}
                                {item.quantity})
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-white">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="flex justify-between items-center text-xs border-t border-[#262626] pt-3">
                      <span className="text-neutral-400">
                        Payment: <strong>{ord.paymentMethod}</strong> • Delivery Fee: ৳{ord.deliveryFee}
                      </span>
                      <span className="font-serif text-base font-bold text-[#C5A46D]">
                        Total: ৳{ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Catalog Products ({products.length})
                </h3>
                <p className="text-xs text-neutral-400">
                  Add, edit, adjust prices, stock levels, and toggle featured items.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="rounded border border-[#333333] bg-[#1A1A1A] pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 rounded-sm bg-[#C5A46D] px-4 py-2 text-xs font-bold text-black hover:bg-[#dfca9b] transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl border border-[#2B2B2B] bg-[#161616]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#1A1A1A] text-neutral-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (BDT)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Badges</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] text-neutral-200">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1C1C1C]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200'}
                            alt=""
                            className="h-12 w-10 rounded object-cover border border-[#333333]"
                          />
                          <div>
                            <span className="font-semibold text-white block">{p.name}</span>
                            <span className="text-[10px] text-neutral-500">
                              Sizes: {p.sizes?.join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-300">
                        {p.categoryName || p.category}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">৳{p.price.toLocaleString()}</div>
                        {p.discountPrice && (
                          <span className="text-[10px] text-[#C5A46D]">
                            Sale: ৳{p.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            p.stock > 10
                              ? 'bg-emerald-950 text-emerald-400'
                              : p.stock > 0
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {p.stock} Units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isBestSeller && (
                            <span className="rounded bg-[#C5A46D]/20 text-[#C5A46D] px-1.5 py-0.5 text-[9px] font-bold">
                              Best Seller
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="rounded bg-neutral-800 text-white px-1.5 py-0.5 text-[9px] font-bold">
                              New
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="rounded bg-blue-950 text-blue-400 px-1.5 py-0.5 text-[9px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1 text-neutral-400 hover:text-[#C5A46D]"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-neutral-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Category Collections ({categories.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Official store collections as specified in product catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex gap-3"
                >
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="h-16 w-16 rounded object-cover border border-[#333333] shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-xs">{c.name}</h4>
                    {c.nameBn && <p className="text-[11px] text-neutral-400">{c.nameBn}</p>}
                    <span className="font-mono text-[10px] text-[#C5A46D] block mt-1">
                      slug: {c.slug}
                    </span>
                    <p className="text-[10px] text-neutral-500 line-clamp-1 mt-1">
                      {c.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Homepage Promotional Banners
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage the top carousel slides and hero imagery.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="h-24 w-full sm:w-44 rounded object-cover border border-[#333333]"
                  />
                  <div className="flex-1 text-xs space-y-1">
                    <h4 className="font-serif text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-neutral-400">{b.subtitle}</p>
                    <p className="text-[#C5A46D]">Target Link: {b.linkUrl}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-emerald-950 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl rounded-xl border border-[#262626] bg-[#161616] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#262626] pb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                Global Store Settings & Contact Info
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Update store branding, WhatsApp hotlines, delivery fees, and marquee announcements.
              </p>
            </div>

            {settingsSaved && (
              <div className="rounded bg-emerald-950 p-3 text-xs text-emerald-300 border border-emerald-800">
                Store settings updated in Firestore successfully!
              </div>
            )}

            <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={sStoreName}
                    onChange={(e) => setSStoreName(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={sTagline}
                    onChange={(e) => setSTagline(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={sWhatsapp}
                    onChange={(e) => setSWhatsapp(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Mobile Phone 1
                  </label>
                  <input
                    type="text"
                    required
                    value={sPhone1}
                    onChange={(e) => setSPhone1(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Mobile Phone 2
                  </label>
                  <input
                    type="text"
                    value={sPhone2}
                    onChange={(e) => setSPhone2(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    required
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Facebook Profile / Page URL
                  </label>
                  <input
                    type="url"
                    value={sFacebook}
                    onChange={(e) => setSFacebook(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Delivery Fee: Inside Dhaka (BDT)
                  </label>
                  <input
                    type="number"
                    value={sFeeDhaka}
                    onChange={(e) => setSFeeDhaka(Number(e.target.value))}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Delivery Fee: Outside Dhaka (BDT)
                  </label>
                  <input
                    type="number"
                    value={sFeeOutside}
                    onChange={(e) => setSFeeOutside(Number(e.target.value))}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Top Announcement Bar Text
                </label>
                <input
                  type="text"
                  value={sAnnouncement}
                  onChange={(e) => setSAnnouncement(e.target.value)}
                  className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Store Custom Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={sLogoUrl}
                  onChange={(e) => setSLogoUrl(e.target.value)}
                  placeholder="https://... (Leave blank to use gold text logo)"
                  className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="rounded-sm bg-[#C5A46D] px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-[#dfca9b] transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setProductModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#333333] bg-[#161616] p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-bold border-b border-[#262626] pb-3 mb-4">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Fashion Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Royal Champagne Classic Polo"
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Title in Bengali (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={pNameBn}
                    onChange={(e) => setPNameBn(e.target.value)}
                    placeholder="e.g. রয়্যাল শ্যাম্পেন ক্লাসিক পোলো"
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Regular Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={pDiscountPrice || ''}
                    onChange={(e) =>
                      setPDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="e.g. 1350"
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">
                    Color Variants (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={pColors}
                    onChange={(e) => setPColors(e.target.value)}
                    placeholder="Black, Navy, Beige"
                    className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Sizes check */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1.5">
                  Available Sizes
                </label>
                <div className="flex gap-2">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as ClothingSize[]).map((s) => {
                    const hasSize = pSizes.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          if (hasSize) {
                            setPSizes(pSizes.filter((x) => x !== s));
                          } else {
                            setPSizes([...pSizes, s]);
                          }
                        }}
                        className={`rounded px-3 py-1 font-bold ${
                          hasSize
                            ? 'bg-[#C5A46D] text-black'
                            : 'border border-[#444444] bg-[#222222] text-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Image URLs */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Product Image URLs (One URL per line) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={pImages}
                  onChange={(e) => setPImages(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">
                  Fabric & Care Specification
                </label>
                <input
                  type="text"
                  value={pFabric}
                  onChange={(e) => setPFabric(e.target.value)}
                  placeholder="100% Egyptian Giza Cotton (240 GSM)"
                  className="w-full rounded border border-[#333333] bg-[#222222] px-3 py-2 text-white focus:border-[#C5A46D] focus:outline-hidden"
                />
              </div>

              {/* Checkbox Flags */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsFeatured}
                    onChange={(e) => setPIsFeatured(e.target.checked)}
                    className="accent-[#C5A46D]"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsBestSeller}
                    onChange={(e) => setPIsBestSeller(e.target.checked)}
                    className="accent-[#C5A46D]"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsNewArrival}
                    onChange={(e) => setPIsNewArrival(e.target.checked)}
                    className="accent-[#C5A46D]"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-sm bg-[#C5A46D] px-6 py-2 font-bold text-black hover:bg-[#dfca9b]"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
