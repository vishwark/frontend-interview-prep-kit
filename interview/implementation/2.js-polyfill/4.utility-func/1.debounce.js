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
  return function(...args) {
    
    // Function to execute after the delay
    const later = function() {
      timeout = null; // if immeadiate true it will just reset the timer.
      // If immediate is not true, call the function
      if (!immediate) func.apply(this, args);
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

function simpleDebounce(func, wait) {
  let timer;
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(()=>{
      func.apply(this,args)
    },wait)
  }
}

// Export the function if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = debounce;
}


/*
🔹 Difference with an example (wait = 1000ms)
Case: Calls at 0ms, 500ms, 1000ms, 1500ms, 2000ms

##Leading Debounce

0ms → ✅ runs

500ms → ❌ ignored (timer resets)

1000ms → ❌ ignored (because timeout resets until 1000ms after last call)

1500ms → ❌ ignored (timeout resets again)

2000ms → ❌ ignored (timeout keeps resetting as long as calls keep happening!)

3000ms -> works 

👉 With continuous calls, leading debounce → only first call runs, rest ignored until you stop calling for wait ms.

##Throttle

0ms → ✅ runs

500ms → ❌ ignored

1000ms → ✅ runs

1500ms → ❌ ignored

2000ms → ✅ runs

👉 With continuous calls, throttle → runs periodically every wait ms.

*/