export interface ProductVariation {
  id: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  price?: number; // Optional variation specific price
  salePrice?: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  categoryName: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  active: boolean;
  rating: number;
  reviewsCount: number;
  material: string;
  dimensions: string;
  careInstructions?: string;
  features?: string[];
  variations: ProductVariation[];
  defaultColorIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  variationId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  sku: string;
  image: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
}

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  variationId: string;
  name: string;
  colorName: string;
  colorHex: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cod_pending';
export type PaymentMethod = 'cod' | 'razorpay_online' | 'card_demo';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  announcementBarText: string;
  announcementBarActive: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageUrl: string;
  testPaymentMode: boolean;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
