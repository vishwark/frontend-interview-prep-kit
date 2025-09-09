/**
 * Types for the E-commerce Filter System
 */

// Product category type
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

// Product brand type
export interface Brand {
  id: string;
  name: string;
  count: number; // Number of products with this brand
}

// Product color type
export interface Color {
  id: string;
  name: string;
  hex: string;
  count: number; // Number of products with this color
}

// Product size type
export interface Size {
  id: string;
  name: string;
  count: number; // Number of products with this size
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  categoryId: string;
  brandId: string;
  colors: string[]; // Color IDs
  sizes: string[]; // Size IDs
  imageUrl: string;
  inStock: boolean;
  dateAdded: string; // ISO date string
}

// Filter state type
export interface FilterState {
  categories: string[]; // Selected category IDs
  priceRange: [number, number]; // Min and max price
  brands: string[]; // Selected brand IDs
  rating: number | null; // Minimum rating
  colors: string[]; // Selected color IDs
  sizes: string[]; // Selected size IDs
  inStock: boolean | null; // true = only in stock, false = include out of stock, null = don't filter
  sort: SortOption;
  page: number;
  perPage: number;
}

// Sort options
export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'popularity';

// Default filter state type (for use with the mock data)
export interface DefaultFilterState {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  rating: number | null;
  colors: string[];
  sizes: string[];
  inStock: boolean | null;
  sort: SortOption;
  page: number;
  perPage: number;
}

// Filter change handler type
export type FilterChangeHandler<T> = (value: T) => void;
