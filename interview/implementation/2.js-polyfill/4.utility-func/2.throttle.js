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

// Throttle implementation (leading version)
const throttleLeading = function(func, wait) {
  // Keep track of the last time the function was executed
  let lastCalled = 0;

  return function(...args) {
    const now = Date.now();

    // Check if enough time has passed since the last call
    if (now - lastCalled >= wait) {
      // Update the timestamp of the last call
      lastCalled = now;

      // Call the original function with the current context and arguments
      func.apply(this, args);
    }
  };
};

// Throttle implementation (trailing version only)
const throttleTailing = function(func, wait) {
  // Stores the active timer reference
  let timeout = null;
  // Stores the latest arguments passed to the throttled function
  let lastArgs;

  // Return the throttled function
  return function(...args) {
    // Save the latest arguments on every call
    // This ensures that when the timeout fires, we use the most recent data
    lastArgs = args;

    // If no timer is running, start one
    if (!timeout) {
      timeout = setTimeout(() => {
        // Call the function with the *latest* arguments
        // (not the arguments from when the timer was first set)
        func.apply(this, lastArgs);

        // Reset the timer so the next call can schedule another one
        timeout = null;
      }, wait);
    }
  }
}


// Export the function if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = throttle;
}
