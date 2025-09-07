/**
 * Memoize Async Function
 * 
 * Description:
 * This file implements functions to memoize asynchronous functions (Promises),
 * caching their results to avoid redundant API calls or expensive computations.
 */

/**
 * Basic Async Memoize
 * 
 * Description:
 * Memoizes an async function, caching its results based on the arguments provided.
 * 
 * Parameters:
 * - fn: The async function to memoize
 * 
 * Returns:
 * - A memoized version of the original async function
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles Promise rejections by not caching failed results
 * - Uses JSON.stringify for cache keys, which may not work for complex objects
 */
function memoizeAsync(fn) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Create cache
  const cache = new Map();
  
  // Return memoized function
  return async function(...args) {
    // Create cache key from arguments
    const key = JSON.stringify(args);
    
    // Check if result is in cache
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    try {
      // Execute function and store result in cache
      const result = await fn.apply(this, args);
      cache.set(key, result);
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  };
}

/**
 * Advanced Async Memoize with Options
 * 
 * Description:
 * Memoizes an async function with configurable options like TTL (time-to-live),
 * custom cache key generation, and max cache size.
 * 
 * Parameters:
 * - fn: The async function to memoize
 * - options: Configuration options
 *   - ttl: Time-to-live in milliseconds (default: Infinity)
 *   - maxSize: Maximum cache size (default: Infinity)
 *   - keyResolver: Function to generate cache keys (default: JSON.stringify)
 * 
 * Returns:
 * - A memoized version of the original async function
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles Promise rejections by not caching failed results
 * - Implements LRU (Least Recently Used) eviction policy when cache is full
 * - Handles TTL expiration
 */
function memoizeAsyncAdvanced(fn, options = {}) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Default options
  const {
    ttl = Infinity,
    maxSize = Infinity,
    keyResolver = args => JSON.stringify(args)
  } = options;
  
  // Create cache and metadata
  const cache = new Map();
  const timestamps = new Map();
  const accessOrder = [];
  
  // Helper function to evict expired entries
  function evictExpired() {
    const now = Date.now();
    for (const [key, timestamp] of timestamps.entries()) {
      if (now - timestamp > ttl) {
        cache.delete(key);
        timestamps.delete(key);
        const index = accessOrder.indexOf(key);
        if (index !== -1) {
          accessOrder.splice(index, 1);
        }
      }
    }
  }
  
  // Helper function to evict least recently used entry
  function evictLRU() {
    if (accessOrder.length > 0) {
      const oldestKey = accessOrder.shift();
      cache.delete(oldestKey);
      timestamps.delete(oldestKey);
    }
  }
  
  // Return memoized function
  return async function(...args) {
    // Create cache key
    const key = keyResolver(args);
    
    // Update access order (for LRU)
    const keyIndex = accessOrder.indexOf(key);
    if (keyIndex !== -1) {
      accessOrder.splice(keyIndex, 1);
    }
    accessOrder.push(key);
    
    // Check if TTL has expired
    if (ttl !== Infinity && timestamps.has(key)) {
      const timestamp = timestamps.get(key);
      if (Date.now() - timestamp > ttl) {
        cache.delete(key);
        timestamps.delete(key);
      }
    }
    
    // Check if result is in cache
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Evict expired entries
    if (ttl !== Infinity) {
      evictExpired();
    }
    
    // Evict LRU if cache is full
    if (maxSize !== Infinity && cache.size >= maxSize) {
      evictLRU();
    }
    
    try {
      // Execute function and store result in cache
      const result = await fn.apply(this, args);
      cache.set(key, result);
      timestamps.set(key, Date.now());
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  };
}

/**
 * Memoize with Promise Deduplication
 * 
 * Description:
 * Memoizes an async function with promise deduplication to prevent redundant
 * in-flight requests for the same arguments.
 * 
 * Parameters:
 * - fn: The async function to memoize
 * 
 * Returns:
 * - A memoized version of the original async function with deduplication
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles Promise rejections by not caching failed results
 * - Deduplicates in-flight requests with the same arguments
 */
function memoizeAsyncWithDeduplication(fn) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Create caches for results and in-flight promises
  const resultCache = new Map();
  const inFlightCache = new Map();
  
  // Return memoized function
  return async function(...args) {
    // Create cache key
    const key = JSON.stringify(args);
    
    // Check if result is already cached
    if (resultCache.has(key)) {
      return resultCache.get(key);
    }
    
    // Check if there's an in-flight request
    if (inFlightCache.has(key)) {
      return inFlightCache.get(key);
    }
    
    try {
      // Create and cache the promise
      const promise = fn.apply(this, args);
      inFlightCache.set(key, promise);
      
      // Wait for the result
      const result = await promise;
      
      // Cache the result and remove in-flight promise
      resultCache.set(key, result);
      inFlightCache.delete(key);
      
      return result;
    } catch (error) {
      // Remove in-flight promise on error
      inFlightCache.delete(key);
      throw error;
    }
  };
}

/**
 * Memoize with Refresh
 * 
 * Description:
 * Memoizes an async function with automatic background refresh capability.
 * 
 * Parameters:
 * - fn: The async function to memoize
 * - options: Configuration options
 *   - ttl: Time-to-live in milliseconds (default: 60000 - 1 minute)
 *   - refreshThreshold: Threshold to trigger background refresh (default: 0.75 * ttl)
 * 
 * Returns:
 * - A memoized version of the original async function with refresh capability
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles Promise rejections by keeping the old cached value
 * - Implements stale-while-revalidate pattern
 */
function memoizeAsyncWithRefresh(fn, options = {}) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Default options
  const {
    ttl = 60000, // 1 minute
    refreshThreshold = ttl * 0.75
  } = options;
  
  // Create cache and metadata
  const cache = new Map();
  const timestamps = new Map();
  const refreshing = new Set();
  
  // Helper function to refresh a cached value
  async function refreshValue(key, args) {
    if (refreshing.has(key)) return;
    
    refreshing.add(key);
    try {
      const newResult = await fn.apply(this, args);
      cache.set(key, newResult);
      timestamps.set(key, Date.now());
    } catch (error) {
      // If refresh fails, keep the old value
      console.error('Background refresh failed:', error);
    } finally {
      refreshing.delete(key);
    }
  }
  
  // Return memoized function
  return async function(...args) {
    // Create cache key
    const key = JSON.stringify(args);
    const now = Date.now();
    
    // Check if result is in cache
    if (cache.has(key)) {
      const timestamp = timestamps.get(key);
      const age = now - timestamp;
      
      // If cache is still fresh, return it
      if (age < ttl) {
        // If approaching expiration, trigger background refresh
        if (age > refreshThreshold) {
          // Use setTimeout to avoid blocking the current request
          setTimeout(() => refreshValue(key, args), 0);
        }
        return cache.get(key);
      }
    }
    
    try {
      // Execute function and store result in cache
      const result = await fn.apply(this, args);
      cache.set(key, result);
      timestamps.set(key, now);
      return result;
    } catch (error) {
      // If we have a cached value, return it even if expired
      if (cache.has(key)) {
        console.warn('Using stale cache due to error:', error);
        return cache.get(key);
      }
      throw error;
    }
  };
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    memoizeAsync,
    memoizeAsyncAdvanced,
    memoizeAsyncWithDeduplication,
    memoizeAsyncWithRefresh
  };
}
