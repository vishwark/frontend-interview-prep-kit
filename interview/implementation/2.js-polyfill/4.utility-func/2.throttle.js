/**
 * Throttle Utility Function
 * 
 * Description:
 * The throttle function creates a new function that, when invoked repeatedly,
 * will only call the original function at most once per every specified wait period.
 * This ensures that the function executes at a regular rate, unlike debounce which
 * only executes after the inputs have stopped.
 * 
 * Parameters:
 * - func: The function to throttle
 * - wait: The number of milliseconds to throttle invocations to
 * - options (optional): An object with the following optional properties:
 *   - leading: Boolean indicating whether to invoke on the leading edge of the timeout (default: true)
 *   - trailing: Boolean indicating whether to invoke on the trailing edge of the timeout (default: true)
 * 
 * Returns:
 * - A throttled version of the original function that, when invoked repeatedly,
 *   will only call the original function at most once per wait period
 * 
 * Use Cases:
 * - Handling scroll, resize, or mousemove events
 * - Limiting the rate of AJAX requests
 * - Controlling the rate of user interactions (e.g., button clicks)
 * - Implementing infinite scrolling
 */

function throttle(func, wait, options) {
  // Set default options
  options = options || {};
  let leading = 'leading' in options ? options.leading : true;
  let trailing = 'trailing' in options ? options.trailing : true;
  
  // Variables to track state
  let context, args, result;
  let timeout = null;
  let previous = 0;
  
  // Function to reset the timeout
  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  
  // Return the throttled function
  return function() {
    const now = Date.now();
    
    // If it's the first call and leading is false, set previous to now
    if (!previous && leading === false) previous = now;
    
    // Calculate remaining time
    const remaining = wait - (now - previous);
    
    // Store the context and arguments for later use
    context = this;
    args = arguments;
    
    // If the wait time has elapsed, or this is the first call with leading=true
    if (remaining <= 0 || remaining > wait) {
      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      // Update previous time and call the function
      previous = now;
      result = func.apply(context, args);
      
      // Clean up references if there's no timeout
      if (!timeout) context = args = null;
    } 
    // If there's no timeout and trailing is true, set a new timeout
    else if (!timeout && trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    
    return result;
  };
}

// Export the function if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = throttle;
}
