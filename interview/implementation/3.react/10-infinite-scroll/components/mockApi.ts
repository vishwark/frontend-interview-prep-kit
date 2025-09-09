import { ApiResponse, FetchOptions, Item } from './types';

/**
 * Mock API for the Infinite Scroll Component
 * 
 * This simulates fetching data from an API with pagination, search, and filtering
 */

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate a random date within the last 30 days
const generateDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
};

// Available tags for filtering
export const availableTags = [
  'technology', 'nature', 'travel', 'food', 'art', 
  'science', 'health', 'sports', 'music', 'business'
];

// Generate a mock item
const generateItem = (index: number): Item => {
  const type = Math.random() > 0.3 ? 'card' : (Math.random() > 0.5 ? 'image' : 'text');
  const randomTags = availableTags
    .filter(() => Math.random() > 0.7)
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  return {
    id: generateId(),
    title: `Item ${index + 1}`,
    description: `This is a description for item ${index + 1}. It contains some random text to simulate real content.`,
    imageUrl: type !== 'text' ? `https://picsum.photos/seed/${generateId()}/400/300` : undefined,
    type,
    tags: randomTags,
    createdAt: generateDate()
  };
};

// Generate a large dataset of items
const generateItems = (count: number): Item[] => {
  return Array.from({ length: count }, (_, i) => generateItem(i));
};

// Total number of items in the mock database
const TOTAL_ITEMS = 1000;

// Generate the mock database
const mockDatabase = generateItems(TOTAL_ITEMS);

/**
 * Fetch items from the mock API
 * @param options Fetch options (limit, cursor, search, tags)
 * @returns Promise that resolves to an API response
 */
export const fetchItems = async (options: FetchOptions): Promise<ApiResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
  
  // Simulate network error (1% chance)
  if (Math.random() < 0.01) {
    throw new Error('Network error');
  }
  
  const { limit = 10, cursor, search, tags } = options;
  
  // Parse the cursor to get the starting index
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  
  // Filter items based on search and tags
  let filteredItems = [...mockDatabase];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(
      item => item.title.toLowerCase().includes(searchLower) || 
              item.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply tags filter
  if (tags && tags.length > 0) {
    filteredItems = filteredItems.filter(
      item => item.tags && tags.some(tag => item.tags?.includes(tag))
    );
  }
  
  // Get the total count of filtered items
  const totalCount = filteredItems.length;
  
  // Get the items for the current page
  const items = filteredItems.slice(startIndex, startIndex + limit);
  
  // Calculate the next cursor
  const nextCursor = startIndex + limit < totalCount ? `${startIndex + limit}` : null;
  
  return {
    items,
    nextCursor,
    totalCount
  };
};
