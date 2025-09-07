/**
 * Array.prototype.flat() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.flat() method.
 * The flat() method creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth.
 * 
 * Parameters:
 * - depth (optional): The depth level specifying how deep a nested array structure should be flattened.
 *   Default is 1.
 * 
 * Returns:
 * - A new array with the sub-array elements concatenated into it
 * 
 * Edge Cases:
 * - If depth is 0, the original array is returned as a shallow copy
 * - If depth is negative, the original array is returned as a shallow copy
 * - Empty slots in arrays are preserved at nested level where flattening not applied
 */

if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth) {
    // Default depth is 1
    depth = depth === undefined ? 1 : Number(depth);
    
    // If depth is 0 or negative, return a shallow copy of the array
    if (depth < 1) {
      return Array.prototype.slice.call(this);
    }

    // Use recursion to flatten the array
    return Array.prototype.reduce.call(
      this,
      function(acc, cur) {
        // If the current element is an array and we have depth remaining,
        // flatten it and concatenate with the accumulator
        if (Array.isArray(cur) && depth > 0) {
          return acc.concat(Array.prototype.flat.call(cur, depth - 1));
        }
        // Otherwise, just add the current element to the accumulator
        return acc.concat(cur);
      },
      []
    );
  };
}

if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth = 1) {
    // If depth is less than 1, just return a shallow copy of the array
    // Example: [1, [2]].flat(0) → [1, [2]]
    if (depth < 1) return [...this];

    // Use reduce to accumulate flattened results
    return this.reduce((acc, cur) => {
      // If current element is an array AND depth > 0, flatten it recursively
      if (Array.isArray(cur)) {
        // Call flat again on the sub-array with depth - 1
        // Spread (...) ensures elements are pushed individually, not as a nested array
        acc.push(...cur.flat(depth - 1));
      } else {
        // If it's not an array, just push the value directly
        acc.push(cur);
      }

      // Return the accumulator for the next iteration
      return acc;
    }, []); // Start reduce with an empty array
  };
}


/**
 * Array.prototype.flatMap() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.flatMap() method.
 * The flatMap() method first maps each element using a mapping function,
 * then flattens the result into a new array. It's essentially a combination
 * of map() followed by flat() of depth 1.
 * 
 * Parameters:
 * - callback: Function that produces an element of the new Array, taking three arguments:
 *   - currentValue: The current element being processed in the array
 *   - index (optional): The index of the current element being processed in the array
 *   - array (optional): The array flatMap() was called upon
 * - thisArg (optional): Value to use as 'this' when executing callback
 * 
 * Returns:
 * - A new array with each element being the result of the callback function
 *   and flattened to a depth of 1
 */

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    // Check if callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // First map, then flat with depth 1
    return this.map(callback, thisArg).flat(1);
  };
}
