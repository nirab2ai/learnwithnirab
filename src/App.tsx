import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AuthPages } from './pages/AuthPages';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  Product,
  Category,
  Banner,
  StoreSettings,
  Order,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
} from './data/initialData';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeBanners,
  subscribeStoreSettings,
} from './firebase/services';

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Subscribe to real-time Firestore collections
  useEffect(() => {
    const unsubProd = subscribeProducts((data) => {
      if (data && data.length > 0) setProducts(data);
    });

    const unsubCat = subscribeCategories((data) => {
      if (data && data.length > 0) setCategories(data);
    });

    const unsubBanner = subscribeBanners((data) => {
      if (data && data.length > 0) setBanners(data);
    });

    const unsubSettings = subscribeStoreSettings((data) => {
      if (data) setSettings(data);
    });

    return () => {
      unsubProd();
      unsubCat();
      unsubBanner();
      unsubSettings();
    };
  }, []);

  // Handle URL navigation and popstate
  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    navigate(`/product/${productId}`);
  };

  // URL parsing helpers
  const [pathname, queryString] = currentPath.split('?');
  const queryParams = new URLSearchParams(queryString || '');

  const categoryParam = queryParams.get('category') || undefined;
  const tagParam = queryParams.get('tag') || undefined;
  const viewParam = queryParams.get('view') || undefined;
  const orderIdParam = queryParams.get('orderId') || undefined;

  // Selected product resolution
  const activeProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : pathname.startsWith('/product/')
    ? products.find((p) => p.id === pathname.replace('/product/', ''))
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F5] font-sans antialiased selection:bg-[#C5A46D] selection:text-white">
      {/* Global Header */}
      <Header
        categories={categories}
        settings={settings}
        currentPath={pathname}
        navigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {pathname === '/' && (
          <HomePage
            products={products}
            categories={categories}
            banners={banners}
            settings={settings}
            navigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {pathname === '/shop' && (
          <ShopPage
            products={products}
            categories={categories}
            initialCategory={categoryParam}
            initialTag={tagParam}
            initialView={viewParam}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {pathname.startsWith('/product/') && (
          activeProduct ? (
            <ProductDetailPage
              product={activeProduct}
              relatedProducts={products.filter((p) => p.id !== activeProduct.id && p.category === activeProduct.category)}
              settings={settings}
              navigate={navigate}
              onSelectProduct={handleSelectProduct}
            />
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
              <h2 className="font-serif text-2xl font-bold mb-2">Product Not Found</h2>
              <button
                onClick={() => navigate('/shop')}
                className="rounded-sm bg-[#111111] px-6 py-2.5 text-xs font-bold text-[#C5A46D]"
              >
                Return to Shop
              </button>
            </div>
          )
        )}

        {pathname === '/checkout' && (
          <CheckoutPage
            navigate={navigate}
            onOrderCompleted={(ord) => setCompletedOrder(ord)}
          />
        )}

        {pathname === '/order-success' && (
          <OrderConfirmationPage
            order={completedOrder}
            settings={settings}
            navigate={navigate}
          />
        )}

        {pathname === '/login' && (
          <AuthPages initialMode="login" navigate={navigate} />
        )}

        {pathname === '/register' && (
          <AuthPages initialMode="register" navigate={navigate} />
        )}

        {pathname === '/forgot-password' && (
          <AuthPages initialMode="forgot" navigate={navigate} />
        )}

        {pathname === '/dashboard' && (
          <CustomerDashboard navigate={navigate} />
        )}

        {pathname === '/my-orders' && (
          <MyOrdersPage
            settings={settings}
            navigate={navigate}
            onSelectOrder={(ord) => setCompletedOrder(ord)}
          />
        )}

        {pathname === '/about' && (
          <AboutUsPage navigate={navigate} />
        )}

        {pathname === '/contact' && (
          <ContactUsPage settings={settings} />
        )}

        {pathname === '/admin' && (
          <AdminDashboard
            products={products}
            categories={categories}
            banners={banners}
            settings={settings}
            navigate={navigate}
          />
        )}
      </main>

      {/* Global Footer (shown on all customer facing pages) */}
      <Footer
        categories={categories}
        settings={settings}
        navigate={navigate}
      />

      {/* Global Interactive Elements */}
      <FloatingContact settings={settings} />
      <CartDrawer navigate={navigate} />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        categories={categories}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={(catSlug) => navigate(`/shop?category=${catSlug}`)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
