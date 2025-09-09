import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InfiniteScrollProps, InfiniteScrollState, FetchOptions, Item } from './types';
import useDebounce from './useDebounce';

/**
 * InfiniteScroll Component
 * 
 * A reusable component that implements infinite scrolling with:
 * - Automatic loading when user scrolls near the bottom
 * - Loading indicator while fetching more items
 * - Error handling
 * - Search and filtering support
 * - Scroll to top button
 * - Maintains scroll position when new items are added
 */
function InfiniteScroll<T extends Item>({
  fetchItems,
  renderItem,
  initialItems = [],
  pageSize = 10,
  showScrollToTop = true,
  loadingComponent,
  errorComponent,
  emptyComponent,
  searchProps,
  filterProps,
  className = '',
}: InfiniteScrollProps<T>) {
  // State for the infinite scroll
  const [state, setState] = useState<InfiniteScrollState<T>>({
    items: initialItems,
    isLoading: false,
    isError: false,
    errorMessage: '',
    hasMore: true,
    nextCursor: null,
    search: '',
    selectedTags: [],
  });

  // Refs for the scroll container and sentinel element
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useDebounce(state.search, searchProps?.debounceTime || 300);

  // Function to fetch more items
  const fetchMoreItems = useCallback(async () => {
    // Don't fetch if already loading, has error, or no more items
    if (state.isLoading || !state.hasMore) return;

    setState(prev => ({ ...prev, isLoading: true, isError: false }));

    try {
      // Prepare fetch options
      const options: FetchOptions = {
        limit: pageSize,
        cursor: state.nextCursor || undefined,
        search: debouncedSearch || undefined,
        tags: state.selectedTags.length > 0 ? state.selectedTags : undefined,
      };

      // Fetch items from API
      const response = await fetchItems(options);

      // Update state with new items
      setState(prev => ({
        ...prev,
        items: [...prev.items, ...response.items] as T[],
        isLoading: false,
        hasMore: !!response.nextCursor,
        nextCursor: response.nextCursor,
      }));
    } catch (error) {
      // Handle error
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [fetchItems, pageSize, state.nextCursor, state.selectedTags, debouncedSearch, state.isLoading, state.hasMore]);

  // Reset and reload items when search or filters change
  useEffect(() => {
    // Skip on initial render
    if (debouncedSearch === state.search && state.items.length === initialItems.length) return;

    // Reset state and fetch new items
    setState(prev => ({
      ...prev,
      items: [],
      isLoading: false,
      isError: false,
      errorMessage: '',
      hasMore: true,
      nextCursor: null,
    }));

    // Fetch items with new search/filters
    fetchMoreItems();
  }, [debouncedSearch, state.selectedTags, initialItems.length]);

  // Set up intersection observer to detect when user scrolls near the bottom
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // If sentinel is visible and we have more items to load
        if (entries[0].isIntersecting && state.hasMore && !state.isLoading) {
          fetchMoreItems();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: '0px 0px 200px 0px', // Load more items when sentinel is 200px from viewport bottom
        threshold: 0.1, // Trigger when 10% of sentinel is visible
      }
    );

    // Observe sentinel element
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchMoreItems, state.hasMore, state.isLoading]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setState(prev => {
      const isSelected = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: isSelected
          ? prev.selectedTags.filter(t => t !== tag)
          : [...prev.selectedTags, tag],
      };
    });
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Render loading component
  const renderLoading = () => {
    if (loadingComponent) {
      return loadingComponent;
    }
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  // Render error component
  const renderError = () => {
    if (errorComponent) {
      return errorComponent;
    }
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md my-4">
        <p className="font-medium">Error</p>
        <p>{state.errorMessage || 'Failed to load items'}</p>
        <button
          onClick={() => fetchMoreItems()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (emptyComponent) {
      return emptyComponent;
    }
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No items found</p>
        {(debouncedSearch || state.selectedTags.length > 0) && (
          <button
            onClick={() => {
              setState(prev => ({
                ...prev,
                search: '',
                selectedTags: [],
              }));
            }}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`infinite-scroll-container ${className}`}>
      {/* Search input */}
      {searchProps && (
        <div className="mb-4">
          <input
            type="text"
            value={state.search}
            onChange={handleSearchChange}
            placeholder={searchProps.placeholder || 'Search...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          />
        </div>
      )}

      {/* Filter tags */}
      {filterProps && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filterProps.tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                state.selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={state.selectedTags.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto"
        style={{ maxHeight: '70vh' }}
        role="list"
        aria-live="polite"
      >
        {/* Items */}
        {state.items.length > 0 ? (
          state.items.map((item, index) => (
            <div key={item.id} role="listitem">
              {renderItem(item, index)}
            </div>
          ))
        ) : !state.isLoading && !state.isError ? (
          renderEmpty()
        ) : null}

        {/* Loading indicator */}
        {state.isLoading && renderLoading()}

        {/* Error message */}
        {state.isError && renderError()}

        {/* Sentinel element for intersection observer */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>

      {/* Scroll to top button */}
      {showScrollToTop && state.items.length > 10 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default InfiniteScroll;
