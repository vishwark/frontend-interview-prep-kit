/**
 * Flatten Nested Object and Array Functions
 * 
 * Description:
 * This file implements functions to flatten nested objects and arrays into simpler structures.
 */

/**
 * Flatten Array
 * 
 * Description:
 * Converts a multi-dimensional array into a single-dimensional array.
 * 
 * Parameters:
 * - arr: The array to flatten
 * - depth (optional): The maximum recursion depth (default: Infinity)
 * 
 * Returns:
 * - A new flattened array
 * 
 * Edge Cases:
 * - If input is not an array, returns an empty array
 * - If depth is 0 or negative, returns a shallow copy of the original array
 * - Non-array elements are preserved as-is
 */
function flattenArray(arr, depth = Infinity) {
  // Validate input
  if (!Array.isArray(arr)) {
    return [];
  }
  
  // Handle base cases
  if (depth <= 0) {
    return [...arr];
  }
  
  // Recursively flatten the array
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
    return result;
  }, []);
}

/**
 * Flatten Object
 * 
 * Description:
 * Converts a nested object into a flat object with keys representing the path to each value.
 * 
 * Parameters:
 * - obj: The object to flatten
 * - prefix (optional): A string prefix for keys (used in recursion)
 * - delimiter (optional): The character to use as a delimiter in the flattened keys (default: '.')
 * 
 * Returns:
 * - A new flattened object
 * 
 * Edge Cases:
 * - If input is not an object or is null, returns an empty object
 * - Arrays within objects are treated as objects with numeric keys
 * - Circular references are not handled (will cause stack overflow)
 */
function flattenObject(obj, prefix = '', delimiter = '.') {
  // Validate input
  if (typeof obj !== 'object' || obj === null) {
    return {};
  }
  
  // Initialize result object
  const result = {};
  
  // Process each key in the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively flatten nested objects
        Object.assign(result, flattenObject(obj[key], newKey, delimiter));
      } else {
        // Add leaf values directly
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

/**
 * Flatten Mixed Structure
 * 
 * Description:
 * Flattens a structure that may contain both nested objects and arrays.
 * 
 * Parameters:
 * - input: The structure to flatten (object or array)
 * - depth (optional): The maximum recursion depth for arrays (default: Infinity)
 * - delimiter (optional): The character to use as a delimiter in flattened object keys (default: '.')
 * 
 * Returns:
 * - If input is an array: a flattened array
 * - If input is an object: a flattened object
 * - Otherwise: the input itself
 * 
 * Edge Cases:
 * - Handles mixed structures (objects containing arrays and vice versa)
 * - Preserves primitive values
 * - Circular references are not handled (will cause stack overflow)
 */
function flattenMixed(input, depth = Infinity, delimiter = '.') {
  if (Array.isArray(input)) {
    return flattenArray(input, depth);
  } else if (typeof input === 'object' && input !== null) {
    return flattenObject(input, '', delimiter);
  } else {
    return input;
  }
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    flattenArray,
    flattenObject,
    flattenMixed
  };
}
