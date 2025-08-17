/**
 * setTimeout() Polyfill
 * 
 * Description:
 * This is a polyfill for the native setTimeout() function.
 * The setTimeout() function sets a timer which executes a function or specified piece of code
 * once the timer expires.
 * 
 * In environments where setTimeout is not available (which is rare in modern browsers),
 * this polyfill provides a basic implementation using recursive setTimeout calls.
 * 
 * Parameters:
 * - callback: A function to be executed after the timer expires
 * - delay: The time, in milliseconds, the timer should wait before the callback is executed
 * - arg1, arg2, ... (optional): Arguments to pass to the callback function
 * 
 * Returns:
 * - A positive integer value which identifies the timer created, and can be used with clearTimeout()
 * 
 * Edge Cases:
 * - If delay is omitted, a default of 0 is used
 * - Nested setTimeout calls with a delay of 0 ms still execute after a minimum delay (typically 4ms)
 * - In some browsers, setTimeout is throttled in inactive tabs to a minimum of 1000ms
 */

// Store the original setTimeout if it exists
const originalSetTimeout = typeof setTimeout !== 'undefined' ? setTimeout : null;

// Create a global timeoutIDs object to store all timeout IDs
if (typeof window !== 'undefined' && !window._timeoutIDs) {
  window._timeoutIDs = {};
}
else if (typeof global !== 'undefined' && !global._timeoutIDs) {
  global._timeoutIDs = {};
}

// Get the appropriate global object
const globalObj = typeof window !== 'undefined' ? window : 
                 typeof global !== 'undefined' ? global : this;

// Create a _timeoutIDs object if it doesn't exist
if (!globalObj._timeoutIDs) {
  globalObj._timeoutIDs = {};
}

// Keep track of the next timeout ID
let nextTimeoutId = 1;

// Implement the setTimeout polyfill
if (!originalSetTimeout) {
  globalObj.setTimeout = function(callback, delay) {
    // Default delay to 0 if not provided
    delay = delay || 0;
    
    // Check if callback is a function
    if (typeof callback !== 'function') {
      // Try to convert it to a string and create a function from it
      try {
        callback = new Function(String(callback));
      } catch (e) {
        throw new TypeError('setTimeout callback must be a function');
      }
    }
    
    // Get the additional arguments to pass to the callback
    const args = Array.prototype.slice.call(arguments, 2);
    
    // Generate a unique ID for this timeout
    const timeoutId = nextTimeoutId++;
    
    // Store the start time
    const startTime = Date.now();
    
    // Create a function to execute the callback
    const executeCallback = function() {
      // Remove the timeout ID from the tracking object
      delete globalObj._timeoutIDs[timeoutId];
      
      // Execute the callback with the provided arguments
      callback.apply(globalObj, args);
    };
    
    // Create a function to check if the delay has elapsed
    const checkTime = function() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime >= delay) {
        // If the delay has elapsed, execute the callback
        executeCallback();
      } else {
        // Otherwise, check again after a short interval
        globalObj._timeoutIDs[timeoutId] = setTimeout(checkTime, 10);
      }
    };
    
    // Start checking the time
    globalObj._timeoutIDs[timeoutId] = originalSetTimeout ? 
      originalSetTimeout(executeCallback, delay) : 
      setTimeout(checkTime, 10);
    
    // Return the timeout ID
    return timeoutId;
  };
}
