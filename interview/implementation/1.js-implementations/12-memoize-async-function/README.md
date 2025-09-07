# Memoize Async Function

## Problem Understanding

### Definition

**Memoization for asynchronous functions** is an optimization technique that stores the results of expensive async operations (like API calls or complex computations) and returns the cached result when the same inputs occur again. Unlike regular memoization, async memoization deals with Promises and requires special handling for in-flight requests, error states, and cache invalidation.

### Parameters

#### Basic Async Memoize Function
- `fn`: The async function to memoize

#### Advanced Async Memoize Function
- `fn`: The async function to memoize
- `options`: Configuration options
  - `ttl`: Time-to-live in milliseconds (default: Infinity)
  - `maxSize`: Maximum cache size (default: Infinity)
  - `keyResolver`: Function to generate cache keys (default: JSON.stringify)

#### Memoize with Promise Deduplication
- `fn`: The async function to memoize

#### Memoize with Refresh
- `fn`: The async function to memoize
- `options`: Configuration options
  - `ttl`: Time-to-live in milliseconds (default: 60000 - 1 minute)
  - `refreshThreshold`: Threshold to trigger background refresh (default: 0.75 * ttl)

### Return Value

All memoize async functions return a new async function that:
- Checks if the result for the given arguments is already in the cache
- If found, returns the cached result as a resolved Promise
- If not found, calls the original async function, stores the result in the cache, and returns it

### Edge Cases to Handle

1. **Promise States**:
   - Handling pending Promises (in-flight requests)
   - Handling rejected Promises (errors)
   - Avoiding duplicate requests for the same arguments

2. **Cache Management**:
   - Time-based expiration (TTL)
   - Size-based eviction (LRU)
   - Manual cache invalidation

3. **Error Handling**:
   - Whether to cache errors or not
   - How to handle errors during background refresh
   - Fallback strategies when requests fail

4. **Race Conditions**:
   - Multiple simultaneous requests for the same uncached data
   - Cache updates during concurrent operations

5. **Memory Management**:
   - Preventing memory leaks from large cached results
   - Efficient storage of Promise results

### Use Cases

1. **API Request Caching**:
   - Reducing redundant network requests
   - Implementing client-side data stores
   - Rate limit management

2. **Expensive Computations**:
   - Complex database queries
   - Heavy data processing operations
   - Machine learning predictions

3. **User Experience Optimization**:
   - Instant responses for repeated requests
   - Fallback to cached data when offline
   - Reducing loading indicators

4. **Performance Optimization**:
   - Reducing server load
   - Minimizing bandwidth usage
   - Improving application responsiveness

### Implementation Approaches

#### Basic Caching

1. **Simple Map-based Cache**:
   - Store results in a Map with serialized arguments as keys
   - Simple but effective for basic use cases
   - No expiration or size limits

2. **Promise Deduplication**:
   - Track in-flight requests to avoid duplicate API calls
   - Return the same Promise for identical concurrent requests
   - Essential for high-frequency operations

#### Advanced Caching Strategies

1. **Time-based Expiration (TTL)**:
   - Automatically invalidate cache entries after a specified time
   - Ensures data freshness while maintaining performance benefits
   - Configurable per use case

2. **Size-based Eviction (LRU)**:
   - Limit cache size to prevent memory issues
   - Evict least recently used items when cache is full
   - Balance between performance and memory usage

3. **Background Refresh**:
   - Proactively refresh cache in the background before expiration
   - Implement stale-while-revalidate pattern
   - Ensures fresh data without affecting user experience

### Time and Space Complexity

- **Time Complexity**:
  - Cache hit: O(1) for simple keys, O(log n) for complex keys with Map
  - Cache miss: O(1) + original function complexity
  - LRU update: O(n) where n is the cache size

- **Space Complexity**:
  - O(n) where n is the number of unique inputs (or maxSize for LRU)
  - Additional overhead for metadata (timestamps, access order)

### Common Interview Questions

1. How would you handle memoization for functions that make API calls?
2. How would you implement a cache invalidation strategy for memoized async functions?
3. How would you prevent duplicate API calls for the same data requested simultaneously?
4. What's the difference between regular memoization and async memoization?
5. How would you implement a background refresh strategy for cached data?

### Code Example: Using Memoized Async Functions

```javascript
// Example async function that simulates an API call
async function fetchUserData(userId) {
  console.log(`Fetching data for user ${userId}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: userId, name: `User ${userId}`, lastActive: Date.now() };
}

// Basic memoization
const memoizedFetch = memoizeAsync(fetchUserData);

// First call - will fetch data
memoizedFetch(123).then(user => console.log('First call:', user));

// Second call with same ID - will use cache
setTimeout(() => {
  memoizedFetch(123).then(user => console.log('Second call:', user));
}, 2000);

// Advanced usage with TTL and size limits
const advancedMemoizedFetch = memoizeAsyncAdvanced(fetchUserData, {
  ttl: 5000, // 5 seconds TTL
  maxSize: 100 // Store max 100 results
});

// With background refresh
const refreshingFetch = memoizeAsyncWithRefresh(fetchUserData, {
  ttl: 10000, // 10 seconds TTL
  refreshThreshold: 8000 // Refresh after 8 seconds
});
```

### Comparison with Other Caching Techniques

| Technique | Pros | Cons | Best For |
|-----------|------|------|----------|
| Basic Memoization | Simple implementation | No expiration, potential memory issues | Quick prototyping, simple use cases |
| TTL Caching | Ensures data freshness | Requires more complex implementation | API calls with freshness requirements |
| LRU Caching | Controls memory usage | More overhead for tracking usage | Memory-constrained environments |
| Background Refresh | Best user experience | Most complex implementation | Critical data that needs to stay fresh |
| HTTP Caching | Built into browsers | Less control, HTTP-specific | Public API responses |
