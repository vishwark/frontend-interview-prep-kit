/**
 * Memoize Function
 * 
 * Description:
 * This file implements a memoization utility that caches the results of expensive function calls
 * and returns the cached result when the same inputs occur again.
 */

/**
 * Basic Memoize Function
 * 
 * Description:
 * Creates a function that memoizes the result of a given function.
 * The cache key is determined by the first argument provided to the memoized function.
 * 
 * Parameters:
 * - func: The function to memoize
 * 
 * Returns:
 * - A memoized version of the original function
 * 
 * Edge Cases:
 * - If func is not a function, throws a TypeError
 * - Only works with primitive values as the first argument (for cache key)
 * - Does not handle functions with multiple arguments well
 */
function memoizeSimple(func) {
  // Validate input
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Create cache
  const cache = new Map();
  
  // Return memoized function
  return function(arg) {
    // Check if result is cached
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    
    // Calculate result and store in cache
    const result = func.call(this, arg);
    cache.set(arg, result);
    return result;
  };
}

/**
 * Advanced Memoize Function
 * 
 * Description:
 * Creates a function that memoizes the result of a given function.
 * The cache key is determined by serializing all arguments provided to the memoized function.
 * 
 * Parameters:
 * - func: The function to memoize
 * - resolver (optional): A function that determines the cache key for storing the result
 * 
 * Returns:
 * - A memoized version of the original function
 * 
 * Edge Cases:
 * - If func is not a function, throws a TypeError
 * - Handles functions with multiple arguments
 * - May have issues with non-serializable arguments (functions, circular references)
 */
function memoize(func, resolver) {
  // Validate input
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Create cache
  const cache = new Map();
  
  // Return memoized function
  return function(...args) {
    // Determine cache key
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    
    // Check if result is cached
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Calculate result and store in cache
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Memoize with LRU Cache
 * 
 * Description:
 * Creates a function that memoizes the result of a given function with a limited cache size.
 * Uses a Least Recently Used (LRU) strategy to evict items when the cache is full.
 * 
 * Parameters:
 * - func: The function to memoize
 * - maxSize (optional): The maximum size of the cache (default: 100)
 * - resolver (optional): A function that determines the cache key for storing the result
 * 
 * Returns:
 * - A memoized version of the original function with LRU cache
 * 
 * Edge Cases:
 * - If func is not a function, throws a TypeError
 * - If maxSize is not a positive number, throws a TypeError
 * - Handles functions with multiple arguments
 * - May have issues with non-serializable arguments (functions, circular references)
 */
function memoizeWithLRU(func, maxSize = 100, resolver) {
  // Validate input
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof maxSize !== 'number' || maxSize <= 0) {
    throw new TypeError('Expected maxSize to be a positive number');
  }
  
  // Create cache and tracking for LRU
  const cache = new Map();
  const keys = [];
  
  // Return memoized function
  return function(...args) {
    // Determine cache key
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    
    // Check if result is cached
    if (cache.has(key)) {
      // Update LRU tracking (move key to the end of the array)
      const keyIndex = keys.indexOf(key);
      keys.splice(keyIndex, 1);
      keys.push(key);
      
      return cache.get(key);
    }
    
    // Calculate result
    const result = func.apply(this, args);
    
    // If cache is full, remove least recently used item
    if (keys.length >= maxSize) {
      const oldestKey = keys.shift();
      cache.delete(oldestKey);
    }
    
    // Store result in cache and update LRU tracking
    cache.set(key, result);
    keys.push(key);
    
    return result;
  };
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    memoizeSimple,
    memoize,
    memoizeWithLRU
  };
}
