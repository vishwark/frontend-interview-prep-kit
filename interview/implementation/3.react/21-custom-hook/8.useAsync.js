// useAsync hook
// Handling asynchronous operations
//
// Use cases:
// 1. Data fetching with better state management than useState
// 2. Form submission with loading and error states
// 3. File uploads with progress tracking and retry capability
// 4. Background processing with cancellation support
// 5. API operations with automatic caching
// 6. Multi-step asynchronous workflows with state tracking

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling asynchronous operations
 * 
 * @template T, E
 * @param {function(): Promise<T>} asyncFunction - The async function to execute
 * @param {Object} options - Configuration options
 * @param {boolean} [options.immediate=true] - Whether to execute the function immediately
 * @param {number} [options.retries=0] - Number of retries for failed operations
 * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds
 * @param {boolean} [options.cache=false] - Whether to cache the result
 * @param {string} [options.cacheKey] - Key to use for caching
 * @param {number} [options.cacheTTL=5 * 60 * 1000] - Cache TTL in milliseconds (default: 5 minutes)
 * @returns {Object} - Async operation state and control functions
 */
function useAsync(asyncFunction, options = {}) {
  const {
    immediate = true,
    retries = 0,
    retryDelay = 1000,
    cache = false,
    cacheKey = '',
    cacheTTL = 5 * 60 * 1000 // 5 minutes
  } = options;

  // State for async operation
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [retryCount, setRetryCount] = useState(0);

  // Refs for tracking component mount state and cancellation
  const mountedRef = useRef(true);
  const cancelRef = useRef(false);
  const asyncFunctionRef = useRef(asyncFunction);
  const retryTimeoutRef = useRef(null);

  // Cache implementation
  const cacheRef = useRef(new Map());

  // Update function ref when it changes
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  // Clear cache entry when TTL expires
  const clearCacheEntry = useCallback((key) => {
    cacheRef.current.delete(key);
  }, []);

  // Execute the async function
  const execute = useCallback(async (...args) => {
    // Reset state
    cancelRef.current = false;
    setRetryCount(0);
    
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Check cache if enabled
    const effectiveCacheKey = cacheKey || `${asyncFunctionRef.current.toString()}_${JSON.stringify(args)}`;
    if (cache && cacheRef.current.has(effectiveCacheKey)) {
      const cachedData = cacheRef.current.get(effectiveCacheKey);
      if (cachedData.expiry > Date.now()) {
        setData(cachedData.data);
        setError(null);
        setStatus('success');
        return cachedData.data;
      } else {
        // Clear expired cache entry
        cacheRef.current.delete(effectiveCacheKey);
      }
    }
    
    // Set loading state
    setStatus('loading');
    setError(null);
    
    try {
      // Execute the async function
      const result = await asyncFunctionRef.current(...args);
      
      // Check if operation was cancelled or component unmounted
      if (cancelRef.current || !mountedRef.current) {
        return;
      }
      
      // Update state with result
      setData(result);
      setStatus('success');
      
      // Cache result if enabled
      if (cache) {
        cacheRef.current.set(effectiveCacheKey, {
          data: result,
          expiry: Date.now() + cacheTTL
        });
        
        // Set timeout to clear cache entry when TTL expires
        setTimeout(() => {
          clearCacheEntry(effectiveCacheKey);
        }, cacheTTL);
      }
      
      return result;
    } catch (err) {
      // Check if operation was cancelled or component unmounted
      if (cancelRef.current || !mountedRef.current) {
        return;
      }
      
      // Update state with error
      setError(err);
      setStatus('error');
      
      // Retry if retries are configured and we haven't exceeded the limit
      if (retryCount < retries) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && !cancelRef.current) {
            execute(...args);
          }
        }, retryDelay);
      }
      
      throw err;
    }
  }, [cache, cacheKey, cacheTTL, retries, retryDelay, retryCount, clearCacheEntry]);

  // Cancel the async operation
  const cancel = useCallback(() => {
    cancelRef.current = true;
    setStatus('cancelled');
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Reset the state
  const reset = useCallback(() => {
    cancelRef.current = false;
    setData(null);
    setError(null);
    setStatus('idle');
    setRetryCount(0);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Execute the async function immediately if configured
  useEffect(() => {
    if (immediate) {
      execute();
    }
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [immediate, execute]);

  // Derived state
  const isIdle = status === 'idle';
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isCancelled = status === 'cancelled';

  return {
    data,
    error,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    isCancelled,
    retryCount,
    execute,
    cancel,
    reset
  };
}

export default useAsync;
