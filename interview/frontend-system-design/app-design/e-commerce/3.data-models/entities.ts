/**
 * E-commerce Application Data Models
 * 
 * This file defines TypeScript interfaces for all entities in the e-commerce application.
 * These interfaces serve as the contract for data structures throughout the application,
 * ensuring type safety and consistency.
 */

/**
 * Base entity interface with common fields for all entities
 */
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * User entity representing a registered user of the application
 */
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passwordHash?: string; // Only stored on the backend
  isActive: boolean;
  isEmailVerified: boolean;
  roles: UserRole[];
  preferences: UserPreferences;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  lastLoginAt?: string; // ISO 8601 date string
}

export type UserRole = 'customer' | 'admin' | 'support' | 'partner';

export interface UserPreferences {
  language: string; // e.g., 'en-US'
  currency: string; // e.g., 'USD'
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketing: {
    email: boolean;
    sms: boolean;
  };
}

/**
 * Address entity for shipping and billing addresses
 */
export interface Address extends BaseEntity {
  userId: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Payment method entity for stored payment methods
 */
export interface PaymentMethod extends BaseEntity {
  userId: string;
  type: 'card' | 'paypal' | 'bank_account';
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  paypal?: {
    email: string;
  };
  bankAccount?: {
    bankName: string;
    accountLast4: string;
    accountType: string;
  };
}

/**
 * Product entity representing items available for purchase
 */
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  sku: string;
  inventory: ProductInventory;
  images: Image[];
  thumbnail: Image;
  categories: Category[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  relatedProducts?: RelatedProduct[];
  rating?: ProductRating;
  seo: SEOMetadata;
  specifications?: ProductSpecificationGroup[];
  isActive: boolean;
  isVisible: boolean;
}

export interface ProductInventory {
  available: number;
  inStock: boolean;
  managementType: 'tracked' | 'untracked';
  lowStockThreshold?: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  attributes: ProductAttribute[];
  price: number;
  compareAtPrice?: number;
  inventory: ProductInventory;
  image?: Image;
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: Image;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution?: {
    [key: string]: number; // e.g., { "5": 10, "4": 5, ... }
  };
}

export interface ProductSpecificationGroup {
  group: string;
  items: {
    name: string;
    value: string;
  }[];
}

/**
 * Category entity for organizing products
 */
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  detailedDescription?: string;
  image?: Image;
  banner?: Image;
  parentId?: string;
  level: number;
  productCount?: number;
  subcategories?: Category[];
  seo: SEOMetadata;
  isActive: boolean;
  displayOrder: number;
}

/**
 * Image entity for product and category images
 */
export interface Image {
  id?: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
  displayOrder?: number;
}

/**
 * SEO metadata for products and categories
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

/**
 * Cart entity representing a user's shopping cart
 */
export interface Cart extends BaseEntity {
  userId?: string; // Optional for guest carts
  guestId?: string; // For non-authenticated users
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discounts?: Discount[];
  shipping?: ShippingInfo;
  tax?: TaxInfo;
  total: number;
  currency: string;
  expiresAt?: string; // ISO 8601 date string
}

export interface CartItem extends BaseEntity {
  cartId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  attributes?: ProductAttribute[];
  image?: Image;
  subtotal: number;
}

/**
 * Order entity representing a completed purchase
 */
export interface Order extends BaseEntity {
  userId?: string; // Optional for guest orders
  number: string;
  status: OrderStatus;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discounts?: Discount[];
  shipping: ShippingInfo;
  tax: TaxInfo;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
  timeline: OrderTimelineEvent[];
  email: string;
  phone?: string;
  notes?: string;
  refunds?: Refund[];
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded' 
  | 'on_hold';

export type PaymentStatus = 
  | 'pending' 
  | 'authorized' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  attributes?: ProductAttribute[];
  image?: Image;
  subtotal: number;
}

export interface ShippingInfo {
  method: string;
  cost: number;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string; // ISO 8601 date string
}

export interface TaxInfo {
  rate: number;
  amount: number;
  breakdown?: {
    [key: string]: {
      rate: number;
      amount: number;
    };
  };
}

export interface PaymentDetails {
  transactionId?: string;
  clientSecret?: string;
  card?: {
    brand: string;
    last4: string;
  };
}

export interface OrderTimelineEvent {
  status: OrderStatus | PaymentStatus | string;
  timestamp: string; // ISO 8601 date string
  description: string;
  metadata?: Record<string, any>;
}

export interface Refund extends BaseEntity {
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  transactionId?: string;
  items?: {
    orderItemId: string;
    quantity: number;
    amount: number;
  }[];
}

/**
 * Discount entity for promotional offers
 */
export interface Discount extends BaseEntity {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  amount: number;
  minPurchase?: number;
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[]; // Product IDs
  applicableCategories?: string[]; // Category IDs
  isActive: boolean;
}

/**
 * Review entity for product reviews
 */
export interface Review extends BaseEntity {
  productId: string;
  userId?: string;
  userName: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  verified: boolean;
  helpful: number;
  reported: number;
  status: 'pending' | 'approved' | 'rejected';
  response?: {
    content: string;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
  };
}

/**
 * Wishlist entity for saved products
 */
export interface Wishlist extends BaseEntity {
  userId: string;
  name: string;
  isPublic: boolean;
  items: WishlistItem[];
}

export interface WishlistItem extends BaseEntity {
  wishlistId: string;
  productId: string;
  variantId?: string;
  addedAt: string; // ISO 8601 date string
  notes?: string;
}

/**
 * Search entity for search functionality
 */
export interface SearchQuery extends BaseEntity {
  userId?: string;
  query: string;
  filters?: Record<string, any>;
  resultsCount: number;
  clickedResults?: string[]; // Product IDs
}

/**
 * Notification entity for user notifications
 */
export interface Notification extends BaseEntity {
  userId: string;
  type: 'order_status' | 'price_drop' | 'back_in_stock' | 'promotion' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}
