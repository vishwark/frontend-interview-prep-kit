/**
 * Fetch with Retries
 * 
 * Description:
 * This file implements functions to make HTTP requests with automatic retry functionality
 * for handling transient failures.
 */

/**
 * Basic Fetch with Retries
 * 
 * Description:
 * Makes an HTTP request and automatically retries on failure up to a specified number of times.
 * 
 * Parameters:
 * - url: The URL to fetch
 * - options (optional): Fetch options object
 * - maxRetries (optional): Maximum number of retry attempts (default: 3)
 * - retryDelay (optional): Delay between retries in milliseconds (default: 1000)
 * 
 * Returns:
 * - A Promise that resolves with the fetch response
 * - Rejects if all retry attempts fail
 * 
 * Edge Cases:
 * - Handles network errors
 * - Handles HTTP error status codes (4xx, 5xx)
 * - Implements exponential backoff for retry delays
 */
async function fetchWithRetries(url, options = {}, maxRetries = 3, retryDelay = 1000) {
  // Validate input
  if (typeof url !== 'string') {
    throw new TypeError('URL must be a string');
  }
  
  if (maxRetries < 0 || !Number.isInteger(maxRetries)) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }
  
  if (retryDelay < 0) {
    throw new TypeError('retryDelay must be a non-negative number');
  }
  
  // Initialize retry counter
  let retries = 0;
  
  // Helper function to delay execution
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  // Retry loop
  while (true) {
    try {
      // Attempt the fetch
      const response = await fetch(url, options);
      
      // Check if the response is successful (status code 2xx)
      if (response.ok) {
        return response;
      }
      
      // If we get an error status code, throw an error to trigger retry
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    } catch (error) {
      // If we've used all our retries, throw the error
      if (retries >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} retries: ${error.message}`);
      }
      
      // Increment retry counter
      retries++;
      
      // Calculate delay with exponential backoff
      const currentDelay = retryDelay * Math.pow(2, retries - 1);
      
      // Log retry attempt (in real-world code, you might use a proper logger)
      console.log(`Retry ${retries}/${maxRetries} after ${currentDelay}ms: ${error.message}`);
      
      // Wait before retrying
      await delay(currentDelay);
    }
  }
}

/**
 * Advanced Fetch with Retries
 * 
 * Description:
 * Makes an HTTP request with configurable retry behavior, including custom retry conditions,
 * backoff strategies, and retry callbacks.
 * 
 * Parameters:
 * - url: The URL to fetch
 * - options: An object with the following properties:
 *   - fetchOptions (optional): Standard fetch options object
 *   - maxRetries (optional): Maximum number of retry attempts (default: 3)
 *   - retryDelay (optional): Initial delay between retries in milliseconds (default: 1000)
 *   - retryCondition (optional): Function that determines if a retry should be attempted
 *   - backoffStrategy (optional): Function that calculates the delay for each retry
 *   - onRetry (optional): Callback function executed before each retry
 *   - timeout (optional): Request timeout in milliseconds
 * 
 * Returns:
 * - A Promise that resolves with the fetch response
 * - Rejects if all retry attempts fail or if the request times out
 * 
 * Edge Cases:
 * - Handles network errors
 * - Handles HTTP error status codes (4xx, 5xx)
 * - Implements configurable backoff strategies
 * - Handles request timeouts
 */
async function advancedFetchWithRetries(url, options = {}) {
  // Extract and validate options with defaults
  const {
    fetchOptions = {},
    maxRetries = 3,
    retryDelay = 1000,
    retryCondition = (error, response) => {
      // Default retry condition: retry on network errors or 5xx status codes
      return !response || (response.status >= 500 && response.status < 600);
    },
    backoffStrategy = (attempt, delay) => {
      // Default exponential backoff with jitter
      return delay * Math.pow(2, attempt - 1) * (0.8 + Math.random() * 0.4);
    },
    onRetry = (attempt, error, nextDelay) => {
      // Default retry callback
      console.log(`Retry ${attempt}/${maxRetries} after ${nextDelay}ms: ${error.message}`);
    },
    timeout = 0 // Default: no timeout
  } = options;
  
  // Validate input
  if (typeof url !== 'string') {
    throw new TypeError('URL must be a string');
  }
  
  if (maxRetries < 0 || !Number.isInteger(maxRetries)) {
    throw new TypeError('maxRetries must be a non-negative integer');
  }
  
  // Helper function to delay execution
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  // Helper function to add timeout to fetch
  const fetchWithTimeout = async (url, options, timeoutMs) => {
    if (!timeoutMs) {
      return fetch(url, options);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };
  
  // Initialize retry counter
  let retries = 0;
  let lastError = null;
  let lastResponse = null;
  
  // Retry loop
  while (retries <= maxRetries) {
    try {
      // Attempt the fetch with timeout
      const response = await fetchWithTimeout(url, fetchOptions, timeout);
      
      // Store the response for the retry condition
      lastResponse = response;
      
      // Check if the response is successful or if we should retry
      if (response.ok || !retryCondition(null, response)) {
        return response;
      }
      
      // If we should retry, throw an error
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    } catch (error) {
      // Store the error for the retry condition
      lastError = error;
      
      // If we've used all our retries or shouldn't retry, throw the error
      if (retries >= maxRetries || !retryCondition(error, lastResponse)) {
        throw new Error(`Failed after ${retries} retries: ${error.message}`);
      }
      
      // Increment retry counter
      retries++;
      
      // Calculate delay with the provided backoff strategy
      const currentDelay = backoffStrategy(retries, retryDelay);
      
      // Execute the retry callback
      if (typeof onRetry === 'function') {
        onRetry(retries, error, currentDelay);
      }
      
      // Wait before retrying
      await delay(currentDelay);
    }
  }
  
  // This should never be reached due to the throw in the catch block,
  // but just in case, throw a final error
  throw new Error(`Failed after ${maxRetries} retries`);
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchWithRetries,
    advancedFetchWithRetries
  };
}
