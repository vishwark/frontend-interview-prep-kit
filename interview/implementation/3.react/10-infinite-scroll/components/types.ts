/**
 * Types for the Infinite Scroll Component
 */

// Item type for the infinite scroll list
export interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: 'text' | 'image' | 'card';
  tags?: string[];
  createdAt: string; // ISO date string
}

// Response type for the API
export interface ApiResponse {
  items: Item[];
  nextCursor: string | null;
  totalCount: number;
}

// Fetch options type
export interface FetchOptions {
  limit: number;
  cursor?: string;
  search?: string;
  tags?: string[];
}

// Infinite scroll props type
export interface InfiniteScrollProps<T> {
  // Function to fetch data
  fetchItems: (options: FetchOptions) => Promise<ApiResponse>;
  
  // Function to render each item
  renderItem: (item: T, index: number) => React.ReactNode;
  
  // Initial data (optional)
  initialItems?: T[];
  
  // Number of items to fetch per page
  pageSize?: number;
  
  // Whether to show the scroll to top button
  showScrollToTop?: boolean;
  
  // Loading component (optional)
  loadingComponent?: React.ReactNode;
  
  // Error component (optional)
  errorComponent?: React.ReactNode;
  
  // Empty state component (optional)
  emptyComponent?: React.ReactNode;
  
  // Search props (optional)
  searchProps?: {
    placeholder?: string;
    debounceTime?: number;
  };
  
  // Filter props (optional)
  filterProps?: {
    tags: string[];
    onTagSelect: (tag: string) => void;
  };
  
  // Class name for styling (optional)
  className?: string;
}

// Infinite scroll state type
export interface InfiniteScrollState<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  hasMore: boolean;
  nextCursor: string | null;
  search: string;
  selectedTags: string[];
}
