/**
 * Array.prototype.filter() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.filter() method.
 * The filter() method creates a new array with all elements that pass the test
 * implemented by the provided function.
 * 
 * Parameters:
 * - callback: Function to test each element of the array. Return a value that coerces to true to keep the element,
 *   or to false otherwise. The callback function accepts three arguments:
 *   - currentValue: The current element being processed in the array
 *   - index (optional): The index of the current element being processed in the array
 *   - array (optional): The array filter() was called upon
 * - thisArg (optional): Value to use as 'this' when executing callback
 * 
 * Returns:
 * - A new array with the elements that pass the test
 * 
 * Edge Cases:
 * - If no elements pass the test, an empty array is returned
 * - Elements added to the array after the call to filter() begins will not be visited
 * - Elements that are deleted or changed will not be visited or will be visited with their current value
 */

if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback, thisArg) {
    // Check if callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    const result = [];
    const length = this.length;
    
    // Iterate through the array and apply the callback to each element
    for (let i = 0; i < length; i++) {
      // Skip holes in sparse arrays
      if (i in this) {
        const currentValue = this[i];
        // If the callback returns a truthy value, add the element to the result array
        if (callback.call(thisArg, currentValue, i, this)) {
          result.push(currentValue);
        }
      }
    }
    
    return result;
  };
}
