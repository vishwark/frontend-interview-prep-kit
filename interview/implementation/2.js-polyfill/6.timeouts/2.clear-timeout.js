/**
 * clearTimeout() Polyfill
 * 
 * Description:
 * This is a polyfill for the native clearTimeout() function.
 * The clearTimeout() function cancels a timeout previously established by calling setTimeout().
 * 
 * This polyfill works in conjunction with the setTimeout polyfill to provide a complete
 * timing solution in environments where these functions might not be available.
 * 
 * Parameters:
 * - timeoutId: The identifier of the timeout you want to cancel, as returned by setTimeout()
 * 
 * Returns:
 * - undefined
 * 
 * Edge Cases:
 * - If the timeoutId does not exist, the function does nothing
 * - If the timeoutId is not a number, the function does nothing
 * - If the timeout has already executed or been cleared, the function does nothing
 */

// Store the original clearTimeout if it exists
const originalClearTimeout = typeof clearTimeout !== 'undefined' ? clearTimeout : null;

// Get the appropriate global object
const globalObj = typeof window !== 'undefined' ? window : 
                 typeof global !== 'undefined' ? global : this;

// Ensure the _timeoutIDs object exists
if (!globalObj._timeoutIDs) {
  globalObj._timeoutIDs = {};
}

// Implement the clearTimeout polyfill
if (!originalClearTimeout) {
  globalObj.clearTimeout = function(timeoutId) {
    // If timeoutId is not a number or is invalid, do nothing
    if (typeof timeoutId !== 'number' || timeoutId <= 0) {
      return;
    }
    
    // If the timeout exists in our tracking object
    if (globalObj._timeoutIDs[timeoutId]) {
      // If the original clearTimeout exists, use it to clear the timeout
      if (originalClearTimeout) {
        originalClearTimeout(globalObj._timeoutIDs[timeoutId]);
      }
      
      // Remove the timeout ID from the tracking object
      delete globalObj._timeoutIDs[timeoutId];
    }
  };
}
