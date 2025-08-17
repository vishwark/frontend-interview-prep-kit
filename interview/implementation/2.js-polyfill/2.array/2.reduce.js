/**
 * Array.prototype.reduce() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.reduce() method.
 * The reduce() method executes a reducer function on each element of the array,
 * resulting in a single output value. It applies a function against an accumulator
 * and each element in the array (from left to right).
 * 
 * Parameters:
 * - callback: Function to execute on each element in the array, taking four arguments:
 *   - accumulator: The accumulator accumulates the callback's return values
 *   - currentValue: The current element being processed in the array
 *   - index (optional): The index of the current element being processed
 *   - array (optional): The array reduce() was called upon
 * - initialValue (optional): Value to use as the first argument to the first call of the callback
 * 
 * Returns:
 * - The single value that results from the reduction
 * 
 * Edge Cases:
 * - If the array is empty and no initialValue is provided, a TypeError is thrown
 * - If the array has only one element and no initialValue is provided, that single element is returned
 * - If initialValue is provided but the array is empty, the initialValue is returned
 */

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, initialValue) {
    // Check if callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    const length = this.length;
    
    // If array is empty and no initialValue is provided, throw an error
    if (length === 0 && arguments.length < 2) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    let accumulator;
    let startIndex;
    
    // If initialValue is provided, use it as the accumulator
    // Otherwise, use the first element of the array
    if (arguments.length >= 2) {
      accumulator = initialValue;
      startIndex = 0;
    } else {
      // Find the first element that exists in the array
      let i = 0;
      while (i < length && !(i in this)) {
        i++;
      }
      
      // If no element exists in the array, throw an error
      if (i >= length) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      
      accumulator = this[i];
      startIndex = i + 1;
    }
    
    // Iterate through the array starting from startIndex
    for (let i = startIndex; i < length; i++) {
      // Skip holes in sparse arrays
      if (i in this) {
        accumulator = callback(accumulator, this[i], i, this);
      }
    }
    
    return accumulator;
  };
}
