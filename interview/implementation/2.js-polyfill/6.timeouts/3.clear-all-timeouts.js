/**
 * clearAllTimeouts() Utility Function
 * 
 * Description:
 * This is a utility function that clears all active timeouts in the application.
 * Unlike setTimeout and clearTimeout, this is not a standard browser function,
 * but a useful utility for scenarios where you need to clean up all pending timeouts,
 * such as when unmounting a component or navigating away from a page.
 * 
 * This function works in conjunction with the setTimeout and clearTimeout polyfills,
 * which track all active timeouts in a global _timeoutIDs object.
 * 
 * Parameters:
 * - None
 * 
 * Returns:
 * - The number of timeouts that were cleared
 * 
 * Use Cases:
 * - Cleaning up resources when a component unmounts
 * - Preventing memory leaks in single-page applications during navigation
 * - Resetting the state of an application
 * - Stopping all animations or scheduled tasks at once
 */

// Get the appropriate global object
const globalObj = typeof window !== 'undefined' ? window : 
                 typeof global !== 'undefined' ? global : this;

// Ensure the _timeoutIDs object exists
if (!globalObj._timeoutIDs) {
  globalObj._timeoutIDs = {};
}

/**
 * Clears all active timeouts in the application
 * @returns {number} The number of timeouts that were cleared
 */
function clearAllTimeouts() {
  let count = 0;
  
  // Iterate through all timeout IDs in the tracking object
  for (const timeoutId in globalObj._timeoutIDs) {
    if (globalObj._timeoutIDs.hasOwnProperty(timeoutId)) {
      // Clear the timeout
      clearTimeout(parseInt(timeoutId, 10));
      count++;
    }
  }
  
  // Reset the tracking object
  globalObj._timeoutIDs = {};
  
  return count;
}

// Add the function to the global object
globalObj.clearAllTimeouts = clearAllTimeouts;

// Export the function if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = clearAllTimeouts;
}
