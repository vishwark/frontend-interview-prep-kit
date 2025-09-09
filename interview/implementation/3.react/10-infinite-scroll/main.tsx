import React, { useState } from 'react';
import InfiniteScroll from './components/InfiniteScroll';
import ItemCard from './components/ItemCard';
import { fetchItems, availableTags } from './components/mockApi';
import { Item } from './components/types';

/**
 * InfiniteScrollDemo Component
 * 
 * Demonstrates the infinite scroll component with:
 * - Loading initial set of items
 * - Automatically loading more items when scrolling
 * - Search and filtering functionality
 * - Different content types (text, images, cards)
 * - Scroll to top button
 * - Error handling
 */
const InfiniteScrollDemo: React.FC = () => {
  // State for the demo
  const [demoMode, setDemoMode] = useState<'basic' | 'search' | 'filter' | 'error'>('basic');
  
  // Function to render an item
  const renderItem = (item: Item) => {
    return <ItemCard item={item} />;
  };

  // Function to simulate an error
  const fetchWithError = async () => {
    throw new Error('This is a simulated error for demonstration purposes');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Infinite Scroll Component</h1>
      
      {/* Demo mode selector */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Demo Modes</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDemoMode('basic')}
            className={`px-4 py-2 rounded-md ${
              demoMode === 'basic'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setDemoMode('search')}
            className={`px-4 py-2 rounded-md ${
              demoMode === 'search'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            With Search
          </button>
          <button
            onClick={() => setDemoMode('filter')}
            className={`px-4 py-2 rounded-md ${
              demoMode === 'filter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            With Filters
          </button>
          <button
            onClick={() => setDemoMode('error')}
            className={`px-4 py-2 rounded-md ${
              demoMode === 'error'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Error Handling
          </button>
        </div>
      </div>
      
      {/* Description of the current demo mode */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        {demoMode === 'basic' && (
          <p>
            <strong>Basic Mode:</strong> Simple infinite scroll with automatic loading of more items as you scroll down.
            Includes a scroll to top button that appears after scrolling down.
          </p>
        )}
        {demoMode === 'search' && (
          <p>
            <strong>Search Mode:</strong> Infinite scroll with search functionality. Type in the search box to filter items.
            The search is debounced to avoid excessive API calls.
          </p>
        )}
        {demoMode === 'filter' && (
          <p>
            <strong>Filter Mode:</strong> Infinite scroll with tag filtering. Click on tags to filter items by tag.
            You can select multiple tags to narrow down the results.
          </p>
        )}
        {demoMode === 'error' && (
          <p>
            <strong>Error Handling Mode:</strong> Demonstrates error handling in the infinite scroll component.
            The API call is set to fail, showing the error UI and retry functionality.
          </p>
        )}
      </div>
      
      {/* Infinite scroll component with different configurations based on demo mode */}
      {demoMode === 'basic' && (
        <InfiniteScroll<Item>
          fetchItems={fetchItems}
          renderItem={renderItem}
          pageSize={5}
          showScrollToTop={true}
        />
      )}
      
      {demoMode === 'search' && (
        <InfiniteScroll<Item>
          fetchItems={fetchItems}
          renderItem={renderItem}
          pageSize={5}
          showScrollToTop={true}
          searchProps={{
            placeholder: 'Search items...',
            debounceTime: 300,
          }}
        />
      )}
      
      {demoMode === 'filter' && (
        <InfiniteScroll<Item>
          fetchItems={fetchItems}
          renderItem={renderItem}
          pageSize={5}
          showScrollToTop={true}
          filterProps={{
            tags: availableTags,
            onTagSelect: () => {}, // This is handled internally by the InfiniteScroll component
          }}
        />
      )}
      
      {demoMode === 'error' && (
        <InfiniteScroll<Item>
          fetchItems={fetchWithError as any}
          renderItem={renderItem}
          pageSize={5}
          showScrollToTop={true}
        />
      )}
      
      {/* Technical implementation details */}
      <div className="mt-12 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold mb-3">Implementation Details</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Uses the <strong>Intersection Observer API</strong> to detect when the user scrolls near the bottom</li>
          <li>Implements <strong>debounced search</strong> to avoid excessive API calls</li>
          <li>Maintains <strong>scroll position</strong> when new items are added</li>
          <li>Provides <strong>error handling</strong> with retry functionality</li>
          <li>Supports <strong>different content types</strong> (text, images, cards)</li>
          <li>Includes <strong>accessibility features</strong> like ARIA attributes and keyboard navigation</li>
          <li>Implements <strong>proper memory management</strong> by cleaning up event listeners and observers</li>
          <li>Supports <strong>responsive design</strong> for different screen sizes</li>
        </ul>
      </div>
    </div>
  );
};

export default InfiniteScrollDemo;
