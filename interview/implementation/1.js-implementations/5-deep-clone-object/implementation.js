/**
 * Deep Clone Object
 * 
 * Description:
 * This file implements functions to create deep copies of objects and arrays,
 * ensuring that nested objects and arrays are also copied rather than referenced.
 */

/**
 * Basic Deep Clone
 * 
 * Description:
 * Creates a deep copy of an object or array using recursion.
 * 
 * Parameters:
 * - obj: The object or array to clone
 * 
 * Returns:
 * - A deep copy of the input
 * 
 * Edge Cases:
 * - Handles primitive values, objects, arrays, and null
 * - Does not handle special object types like Date, RegExp, etc.
 * - Does not handle circular references (will cause stack overflow)
 */
function basicDeepClone(obj) {
  // Handle primitive values and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => basicDeepClone(item));
  }
  
  // Handle objects
  const clonedObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = basicDeepClone(obj[key]);
    }
  }
  
  return clonedObj;
}

/**
 * Advanced Deep Clone
 * 
 * Description:
 * Creates a deep copy of an object or array, handling special object types and circular references.
 * 
 * Parameters:
 * - obj: The object or array to clone
 * 
 * Returns:
 * - A deep copy of the input
 * 
 * Edge Cases:
 * - Handles primitive values, objects, arrays, and null
 * - Handles special object types like Date, RegExp, Map, Set
 * - Handles circular references
 */
function advancedDeepClone(obj) {
  // Keep track of visited objects to handle circular references
  const visited = new WeakMap();
  
  function clone(item) {
    // Handle primitive values and null
    if (item === null || typeof item !== 'object') {
      return item;
    }
    
    // Handle circular references
    if (visited.has(item)) {
      return visited.get(item);
    }
    
    // Handle Date objects
    if (item instanceof Date) {
      return new Date(item.getTime());
    }
    
    // Handle RegExp objects
    if (item instanceof RegExp) {
      return new RegExp(item.source, item.flags);
    }
    
    // Handle Map objects
    if (item instanceof Map) {
      const clonedMap = new Map();
      visited.set(item, clonedMap);
      item.forEach((value, key) => {
        clonedMap.set(clone(key), clone(value));
      });
      return clonedMap;
    }
    
    // Handle Set objects
    if (item instanceof Set) {
      const clonedSet = new Set();
      visited.set(item, clonedSet);
      item.forEach(value => {
        clonedSet.add(clone(value));
      });
      return clonedSet;
    }
    
    // Handle arrays
    if (Array.isArray(item)) {
      const clonedArray = [];
      visited.set(item, clonedArray);
      item.forEach((value, index) => {
        clonedArray[index] = clone(value);
      });
      return clonedArray;
    }
    
    // Handle objects
    const clonedObj = Object.create(Object.getPrototypeOf(item));
    visited.set(item, clonedObj);
    
    Object.getOwnPropertyNames(item).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      if (descriptor.value !== undefined) {
        descriptor.value = clone(descriptor.value);
      }
      Object.defineProperty(clonedObj, key, descriptor);
    });
    
    return clonedObj;
  }
  
  return clone(obj);
}

/**
 * JSON Deep Clone
 * 
 * Description:
 * Creates a deep copy of an object or array using JSON.parse and JSON.stringify.
 * This is a simple but limited approach.
 * 
 * Parameters:
 * - obj: The object or array to clone
 * 
 * Returns:
 * - A deep copy of the input
 * 
 * Edge Cases:
 * - Does not handle functions, undefined values, or symbols
 * - Does not handle special object types like Date (converts to string), RegExp (converts to empty object)
 * - Does not handle circular references (throws an error)
 * - May lose precision for very large numbers
 */
function jsonDeepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    throw new Error('Cannot clone object: ' + error.message);
  }
}

/**
 * Structured Clone (Modern Browsers)
 * 
 * Description:
 * Creates a deep copy of an object using the structured clone algorithm via structuredClone().
 * This is available in modern browsers and Node.js 17+.
 * 
 * Parameters:
 * - obj: The object or array to clone
 * 
 * Returns:
 * - A deep copy of the input
 * 
 * Edge Cases:
 * - Does not handle functions or DOM nodes
 * - Handles most built-in types including Date, RegExp, Map, Set, ArrayBuffer, etc.
 * - Handles circular references
 */
function structuredDeepClone(obj) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj);
    } catch (error) {
      throw new Error('Cannot clone object: ' + error.message);
    }
  } else {
    // Fallback for environments without structuredClone
    return advancedDeepClone(obj);
  }
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    basicDeepClone,
    advancedDeepClone,
    jsonDeepClone,
    structuredDeepClone
  };
}
