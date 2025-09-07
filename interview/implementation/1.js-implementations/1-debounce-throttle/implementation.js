/**
 * Debounce and Throttle Functions
 * 
 * Description:
 * This file implements two common utility functions used for performance optimization:
 * 1. Debounce: Delays invoking a function until after a specified wait time has elapsed since the last invocation
 * 2. Throttle: Limits the rate at which a function can be executed, allowing it to run at most once per specified time period
 */

/**
 * Debounce Function
 * 
 * Description:
 * Creates a function that delays invoking the provided function until after a specified wait time
 * has elapsed since the last time the debounced function was invoked.
 * 
 * Parameters:
 * - func: The function to debounce
 * - wait: The number of milliseconds to delay
 * - immediate (optional): If true, trigger the function on the leading edge instead of the trailing edge
 * 
 * Returns:
 * - A debounced version of the original function
 * 
 * Edge Cases:
 * - If wait is 0 or negative, the function behaves like a regular function call
 * - If func is not a function, throws a TypeError
 */
function debounce(func, wait, immediate = false) {
  // Validate input
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  let timeout;
  
  return function(...args) {
    const context = this;
    
    // Function to execute after the delay
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    // Determine if we should call the function immediately
    const callNow = immediate && !timeout;
    
    // Clear the previous timeout
    clearTimeout(timeout);
    
    // Set a new timeout
    timeout = setTimeout(later, wait);
    
    // If we should call the function immediately, do so
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle Function
 * 
 * Description:
 * Creates a function that, when invoked repeatedly, will only call the original function
 * at most once per every specified time period.
 * 
 * Parameters:
 * - func: The function to throttle
 * - wait: The number of milliseconds to throttle invocations to
 * - options (optional): An object with options:
 *   - leading: If false, suppress leading-edge call (default: true)
 *   - trailing: If false, suppress trailing-edge call (default: true)
 * 
 * Returns:
 * - A throttled version of the original function
 * 
 * Edge Cases:
 * - If wait is 0 or negative, the function behaves like a regular function call
 * - If func is not a function, throws a TypeError
 * - If both leading and trailing options are false, func will never be called
 */
function throttle(func, wait, options = {}) {
  // Validate input
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Set default options
  const leading = options.leading !== false;
  const trailing = options.trailing !== false;
  
  let timeout = null;
  let lastCallTime = 0;
  let lastArgs = null;
  let lastThis = null;
  let result;
  
  // Function to invoke the original function
  const invokeFunc = function() {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    result = func.apply(thisArg, args);
    return result;
  };
  
  // Function to execute after the delay
  const trailingEdge = function() {
    timeout = null;
    
    // Only execute if we have lastArgs, which means func hasn't been called yet
    if (trailing && lastArgs) {
      return invokeFunc();
    }
    
    lastArgs = lastThis = null;
    return result;
  };
  
  // The throttled function
  const throttled = function(...args) {
    const now = Date.now();
    const isFirstCall = !lastCallTime && leading;
    
    lastArgs = args;
    lastThis = this;
    
    // If this is the first call or enough time has elapsed since the last call
    if (!lastCallTime || now - lastCallTime >= wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      lastCallTime = now;
      
      // If leading execution is allowed, invoke the function
      if (leading) {
        return invokeFunc();
      }
    }
    
    // Set up the trailing edge call if it's not already set up
    if (!timeout && trailing) {
      const remainingWait = wait - (now - lastCallTime);
      timeout = setTimeout(trailingEdge, remainingWait);
    }
    
    return result;
  };
  
  // Function to cancel any pending executions
  throttled.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    lastCallTime = 0;
    timeout = lastArgs = lastThis = null;
  };
  
  return throttled;
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle
  };
}
