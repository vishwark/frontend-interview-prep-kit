/**
 * Debounce Utility Function
 * 
 * Description:
 * The debounce function creates a new function that delays invoking the provided function
 * until after a specified wait time has elapsed since the last time the debounced function was invoked.
 * This is useful for implementing behavior that should only happen after a repeated action has completed.
 * 
 * Parameters:
 * - func: The function to debounce
 * - wait: The number of milliseconds to delay
 * - immediate (optional): If true, trigger the function on the leading edge instead of the trailing edge of the wait interval
 * 
 * Returns:
 * - A debounced version of the original function that, when invoked repeatedly,
 *   will only call the original function once per wait period
 * 
 * Use Cases:
 * - Handling expensive calculations on window resize or scroll events
 * - Preventing multiple form submissions
 * - Implementing search-as-you-type features with API calls
 * - Validating form input after the user has stopped typing
 */

function debounce(func, wait, immediate) {
  // Store the timeout ID to clear it later
  let timeout;
  
  // Return the debounced function
  return function() {
    // Store the context and arguments for the function call
    const context = this;
    const args = arguments;
    
    // Function to execute after the delay
    const later = function() {
      timeout = null;
      // If immediate is not true, call the function
      if (!immediate) func.apply(context, args);
    };
    
    // Determine if we should call the function immediately
    // This happens if immediate is true and we haven't recently invoked the function
    const callNow = immediate && !timeout;
    
    // Clear the previous timeout
    clearTimeout(timeout);
    
    // Set a new timeout
    timeout = setTimeout(later, wait);
    
    // If we should call the function immediately, do so
    if (callNow) func.apply(context, args);
  };
}

// Export the function if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = debounce;
}
