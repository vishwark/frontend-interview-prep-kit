/**
 * Fetch Keys from Nested Object
 * 
 * Description:
 * This file implements functions to extract keys from nested objects in various formats.
 */

/**
 * Get All Keys
 * 
 * Description:
 * Retrieves all keys from an object, including those in nested objects.
 * 
 * Parameters:
 * - obj: The object to extract keys from
 * 
 * Returns:
 * - An array containing all keys from the object and its nested objects
 * 
 * Edge Cases:
 * - Returns an empty array for null or non-object inputs
 * - Handles arrays as objects with numeric keys
 * - Does not handle circular references (will cause stack overflow)
 */
function getAllKeys(obj) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return [];
  }
  
  // Initialize result array
  const keys = [];
  
  // Get keys from the current object
  const currentKeys = Object.keys(obj);
  
  // Add current keys to the result
  keys.push(...currentKeys);
  
  // Recursively get keys from nested objects
  for (const key of currentKeys) {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      keys.push(...getAllKeys(obj[key]));
    }
  }
  
  return keys;
}

/**
 * Get Flattened Keys
 * 
 * Description:
 * Retrieves all keys from an object in a flattened format with dot notation for nested keys.
 * 
 * Parameters:
 * - obj: The object to extract keys from
 * - prefix (optional): A string prefix for keys (used in recursion)
 * - delimiter (optional): The character to use as a delimiter in the flattened keys (default: '.')
 * 
 * Returns:
 * - An array containing all flattened keys from the object
 * 
 * Edge Cases:
 * - Returns an empty array for null or non-object inputs
 * - Handles arrays as objects with numeric keys
 * - Does not handle circular references (will cause stack overflow)
 */
function getFlattenedKeys(obj, prefix = '', delimiter = '.') {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return [];
  }
  
  // Initialize result array
  const keys = [];
  
  // Process each key in the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      
      // Add the current key to the result
      keys.push(newKey);
      
      // Recursively get keys from nested objects
      if (obj[key] !== null && typeof obj[key] === 'object') {
        keys.push(...getFlattenedKeys(obj[key], newKey, delimiter));
      }
    }
  }
  
  return keys;
}

/**
 * Get Keys By Level
 * 
 * Description:
 * Retrieves keys from an object grouped by their nesting level.
 * 
 * Parameters:
 * - obj: The object to extract keys from
 * 
 * Returns:
 * - An array of arrays, where each inner array contains keys from a specific nesting level
 * 
 * Edge Cases:
 * - Returns an empty array for null or non-object inputs
 * - Handles arrays as objects with numeric keys
 * - Does not handle circular references (will cause stack overflow)
 */
function getKeysByLevel(obj) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return [];
  }
  
  // Initialize result array
  const result = [];
  
  // Helper function to process each level
  function processLevel(currentObj, level) {
    // Ensure the level exists in the result
    if (!result[level]) {
      result[level] = [];
    }
    
    // Get keys from the current object
    const currentKeys = Object.keys(currentObj);
    
    // Add current keys to the result
    result[level].push(...currentKeys);
    
    // Recursively process nested objects
    for (const key of currentKeys) {
      if (currentObj[key] !== null && typeof currentObj[key] === 'object') {
        processLevel(currentObj[key], level + 1);
      }
    }
  }
  
  // Start processing from level 0
  processLevel(obj, 0);
  
  return result;
}

/**
 * Get Keys with Path
 * 
 * Description:
 * Retrieves all keys from an object along with their full paths.
 * 
 * Parameters:
 * - obj: The object to extract keys from
 * - delimiter (optional): The character to use as a delimiter in the paths (default: '.')
 * 
 * Returns:
 * - An array of objects, each containing a key and its path
 * 
 * Edge Cases:
 * - Returns an empty array for null or non-object inputs
 * - Handles arrays as objects with numeric keys
 * - Does not handle circular references (will cause stack overflow)
 */
function getKeysWithPath(obj, delimiter = '.') {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return [];
  }
  
  // Initialize result array
  const result = [];
  
  // Helper function to process each key
  function processKey(currentObj, path = '') {
    // Get keys from the current object
    const currentKeys = Object.keys(currentObj);
    
    // Process each key
    for (const key of currentKeys) {
      const currentPath = path ? `${path}${delimiter}${key}` : key;
      
      // Add the current key and path to the result
      result.push({ key, path: currentPath });
      
      // Recursively process nested objects
      if (currentObj[key] !== null && typeof currentObj[key] === 'object') {
        processKey(currentObj[key], currentPath);
      }
    }
  }
  
  // Start processing from the root
  processKey(obj);
  
  return result;
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllKeys,
    getFlattenedKeys,
    getKeysByLevel,
    getKeysWithPath
  };
}
