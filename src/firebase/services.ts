import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import {
  Product,
  Category,
  Order,
  Banner,
  StoreSettings,
  OrderStatus,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { handleFirestoreError, OperationType } from './errors';

// ---------------------------------------------------------------------------
// PRODUCTS SERVICE
// ---------------------------------------------------------------------------

export const subscribeProducts = (callback: (products: Product[]) => void) => {
  const productsCol = collection(db, 'products');
  return onSnapshot(
    productsCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_PRODUCTS);
      } else {
        const list: Product[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
        });
        callback(list);
      }
    },
    (err) => {
      console.warn('Products live subscription fallback to default products:', err);
      callback(INITIAL_PRODUCTS);
    }
  );
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    const id = 'prod_' + Date.now();
    const now = new Date().toISOString();
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, {
      ...productData,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'products');
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
  }
};

// ---------------------------------------------------------------------------
// CATEGORIES SERVICE
// ---------------------------------------------------------------------------

export const subscribeCategories = (callback: (cats: Category[]) => void) => {
  const catCol = collection(db, 'categories');
  return onSnapshot(
    catCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_CATEGORIES);
      } else {
        const list: Category[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<Category, 'id'>) });
        });
        list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
        callback(list);
      }
    },
    (err) => {
      console.warn('Categories subscription fallback to default:', err);
      callback(INITIAL_CATEGORIES);
    }
  );
};

export const saveCategory = async (category: Category): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, category, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `categories/${category.id}`);
  }
};

// ---------------------------------------------------------------------------
// BANNERS SERVICE
// ---------------------------------------------------------------------------

export const subscribeBanners = (callback: (banners: Banner[]) => void) => {
  const bannerCol = collection(db, 'banners');
  return onSnapshot(
    bannerCol,
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_BANNERS);
      } else {
        const list: Banner[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<Banner, 'id'>) });
        });
        list.sort((a, b) => a.order - b.order);
        callback(list.filter((b) => b.isActive));
      }
    },
    (err) => {
      console.warn('Banners subscription fallback:', err);
      callback(INITIAL_BANNERS);
    }
  );
};

export const saveBanner = async (banner: Banner): Promise<void> => {
  try {
    const docRef = doc(db, 'banners', banner.id);
    await setDoc(docRef, banner, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `banners/${banner.id}`);
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'banners', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `banners/${id}`);
  }
};

// ---------------------------------------------------------------------------
// STORE SETTINGS SERVICE
// ---------------------------------------------------------------------------

export const subscribeStoreSettings = (callback: (settings: StoreSettings) => void) => {
  const docRef = doc(db, 'settings', 'store');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as StoreSettings);
      } else {
        callback(INITIAL_SETTINGS);
      }
    },
    (err) => {
      console.warn('Settings subscription fallback:', err);
      callback(INITIAL_SETTINGS);
    }
  );
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'store');
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/store');
  }
};

// ---------------------------------------------------------------------------
// ORDERS SERVICE
// ---------------------------------------------------------------------------

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  try {
    const orderId = 'ord_' + Date.now();
    const now = new Date().toISOString();
    const fullOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, fullOrder);
    return fullOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'orders');
  }
};

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId)
    );
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => list.push(d.data() as Order));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders');
  }
};

export const subscribeAllOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((d) => list.push(d.data() as Order));
      callback(list);
    },
    (error) => {
      console.warn('Live orders subscription denied (non-admin or empty):', error);
      callback([]);
    }
  );
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
  }
};

// ---------------------------------------------------------------------------
// DATA SEEDING UTILITY FOR ADMIN
// ---------------------------------------------------------------------------

export const seedInitialDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. Settings
    await setDoc(doc(db, 'settings', 'store'), INITIAL_SETTINGS, { merge: true });

    // 2. Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
    }

    // 3. Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
    }

    // 4. Banners
    for (const banner of INITIAL_BANNERS) {
      await setDoc(doc(db, 'banners', banner.id), banner, { merge: true });
    }

    return { success: true, message: 'All luxury collections, products, banners and settings seeded to Firestore!' };
  } catch (error) {
    console.error('Seeding error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to seed database. Verify admin permissions.',
    };
  }
};
