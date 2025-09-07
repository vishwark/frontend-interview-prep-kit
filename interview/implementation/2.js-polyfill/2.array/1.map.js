/**
 * Array.prototype.map() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.map() method.
 * The map() method creates a new array populated with the results of calling a provided function
 * on every element in the calling array.
 * 
 * Parameters:
 * - callback: Function that is called for every element of the array. Each time callback executes,
 *   the returned value is added to the new array. The callback function accepts three arguments:
 *   - currentValue: The current element being processed in the array
 *   - index (optional): The index of the current element being processed in the array
 *   - array (optional): The array map() was called upon
 * - thisArg (optional): Value to use as 'this' when executing callback
 * 
 * Returns:
 * - A new array with each element being the result of the callback function
 * 
 * Edge Cases:
 * - If the array is modified during mapping, the callback will use the modified values
 * - Elements that don't exist when the map() method starts won't be visited
 * - If a thisArg parameter is provided, it will be used as the 'this' value for each callback invocation
 * - skip the sparse array with in
 */

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    // Check if callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // Create a new array with the same length as the original
    const result = new Array(this.length);
    
    // Iterate through the array and apply the callback to each element
    for (let i = 0; i < this.length; i++) {
      // Skip holes in sparse arrays
      if (i in this) {
        // Call the callback with the provided thisArg or undefined
        result[i] = callback.call(thisArg, this[i], i, this);
      }
    }
    
    return result;
  };
}
