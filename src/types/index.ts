export type ClothingSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad';

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  descriptionBn?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  categoryName?: string;
  sizes: ClothingSize[];
  colors: string[];
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  fabric?: string;
  careInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
  imageUrl: string;
  displayOrder?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: ClothingSize;
  color?: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  district: string;
  deliveryArea: DeliveryZone;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  district?: string;
  deliveryArea?: DeliveryZone;
  role: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  facebookUrl: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  announcement: string;
  logoUrl?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
}
