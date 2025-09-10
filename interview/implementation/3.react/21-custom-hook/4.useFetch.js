// useFetch hook
// Wrapper around fetch API with better state management
//
// Use cases:
// 1. Data fetching in components with loading/error states
// 2. API integration with automatic retries for network failures
// 3. Cancellable requests when component unmounts
// 4. Polling for real-time data updates
// 5. Handling authentication token refreshes
// 6. Implementing search functionality with proper state handling

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for making fetch requests with better state management
 * 
 * @template T
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options and additional configuration
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers] - HTTP headers
 * @param {any} [options.body] - Request body
 * @param {boolean} [options.immediate=true] - Whether to fetch immediately
 * @param {number} [options.retries=0] - Number of retries for failed requests
 * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds
 * @param {function} [options.onSuccess] - Callback function on successful fetch
 * @param {function} [options.onError] - Callback function on fetch error
 * @param {function} [options.responseParser] - Function to parse the response
 * @returns {Object} - Fetch state and control functions
 */
function useFetch(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    immediate = true,
    retries = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
    responseParser = (data) => data,
    ...fetchOptions
  } = options;

  // State for fetch status
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Refs for tracking component mount state and abort controller
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Parse the request body based on content type
  const parseBody = useCallback((body) => {
    if (!body) return null;
    
    if (typeof body === 'string') return body;
    if (body instanceof FormData) return body;
    if (body instanceof URLSearchParams) return body;
    if (body instanceof Blob) return body;
    if (body instanceof ArrayBuffer) return body;
    
    // Default to JSON for objects
    return JSON.stringify(body);
  }, []);

  // Function to perform the fetch
  const executeFetch = useCallback(async (retryAttempt = 0) => {
    // Don't proceed if the component is unmounted
    if (!mountedRef.current) return;
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Set loading state
    setLoading(true);
    setError(null);
    
    try {
      // Prepare headers with content type if body is JSON
      const requestHeaders = { ...headers };
      if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
        requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json';
      }
      
      // Make the fetch request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: parseBody(body),
        signal,
        ...fetchOptions
      });
      
      // Handle non-2xx responses
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the response based on content type
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType && contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        responseData = await response.blob();
      }
      
      // Apply custom response parser if provided
      const parsedData = responseParser(responseData);
      
      // Update state if component is still mounted
      if (mountedRef.current) {
        setData(parsedData);
        setLoading(false);
        setRetryCount(0);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(parsedData);
        }
      }
      
      return parsedData;
    } catch (err) {
      // Don't update state if the request was aborted
      if (err.name === 'AbortError') {
        return;
      }
      
      // Update error state if component is still mounted
      if (mountedRef.current) {
        setError(err);
        setLoading(false);
        
        // Call onError callback if provided
        if (onError) {
          onError(err);
        }
        
        // Retry the request if retries are configured and we haven't exceeded the limit
        if (retryAttempt < retries) {
          setRetryCount(retryAttempt + 1);
          
          retryTimeoutRef.current = setTimeout(() => {
            executeFetch(retryAttempt + 1);
          }, retryDelay);
        }
      }
      
      throw err;
    }
  }, [url, method, headers, body, retries, retryDelay, onSuccess, onError, responseParser, fetchOptions, parseBody]);

  // Function to manually trigger the fetch
  const refetch = useCallback(() => {
    return executeFetch(0);
  }, [executeFetch]);

  // Function to cancel the current request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Fetch on mount or when dependencies change
  useEffect(() => {
    // Set mounted ref to true on mount
    mountedRef.current = true;
    
    // Execute fetch if immediate is true
    if (immediate) {
      executeFetch(0);
    }
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear any retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [immediate, executeFetch]);

  return {
    data,
    error,
    loading,
    refetch,
    cancel,
    retryCount
  };
}

export default useFetch;
