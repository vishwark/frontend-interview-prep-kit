# Object Manipulation Utility Functions in JavaScript

This document covers implementations of various object manipulation utility functions in JavaScript.

## 1. Flatten Object

Flatten a nested object into a single-level object with dot notation keys.

```javascript
/**
 * Flattens a nested object into a single-level object with dot notation keys
 * 
 * @param {Object} obj - The object to flatten
 * @param {string} [prefix=''] - The prefix to use for keys (used in recursion)
 * @param {Object} [result={}] - The result object (used in recursion)
 * @returns {Object} - A flattened object with dot notation keys
 * 
 * Edge cases handled:
 * - Arrays (indices become part of the path)
 * - Null values
 * - Empty objects
 * - Circular references (skipped to prevent infinite recursion)
 */
function flattenObject(obj, prefix = '', result = {}, visited = new Set()) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    result[prefix] = obj;
    return result;
  }
  
  // Handle circular references
  if (visited.has(obj)) {
    result[prefix] = '[Circular Reference]';
    return result;
  }
  
  // Add to visited objects
  visited.add(obj);
  
  // Handle empty objects
  if (Object.keys(obj).length === 0 && prefix) {
    result[prefix] = {};
    return result;
  }
  
  // Process each property
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value === null || typeof value !== 'object') {
        // For primitive values, just add them with the current prefix
        result[newPrefix] = value;
      } else {
        // For objects, recurse with an updated prefix
        flattenObject(value, newPrefix, result, new Set(visited));
      }
    }
  }
  
  return result;
}
```

### Examples

```javascript
// Basic usage
const nested = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001",
    coordinates: {
      lat: 40.7128,
      lng: -74.006
    }
  },
  hobbies: ["reading", "swimming"]
};

const flattened = flattenObject(nested);
console.log(flattened);
/*
{
  'name': 'John',
  'age': 30,
  'address.street': '123 Main St',
  'address.city': 'New York',
  'address.zip': '10001',
  'address.coordinates.lat': 40.7128,
  'address.coordinates.lng': -74.006,
  'hobbies.0': 'reading',
  'hobbies.1': 'swimming'
}
*/

// Edge cases
console.log(flattenObject(null)); // {}
console.log(flattenObject({})); // {}
console.log(flattenObject({ empty: {} })); // { 'empty': {} }

// Circular reference
const circular = { a: 1 };
circular.self = circular;
console.log(flattenObject(circular));
// { 'a': 1, 'self': '[Circular Reference]' }
```

## 2. Unflatten Object

Convert a flattened object with dot notation keys back into a nested object structure.

```javascript
/**
 * Unflattens an object with dot notation keys into a nested object structure
 * 
 * @param {Object} obj - The flattened object to unflatten
 * @returns {Object} - A nested object
 * 
 * Edge cases handled:
 * - Array indices in paths (converted back to arrays)
 * - Empty objects
 * - Conflicting paths
 */
function unflattenObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const result = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip if the key doesn't contain a dot
      if (!key.includes('.')) {
        result[key] = obj[key];
        continue;
      }
      
      // Split the key into parts
      const parts = key.split('.');
      let current = result;
      
      // Process all parts except the last one
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        
        // Check if the next part is a number (array index)
        const nextIsArrayIndex = !isNaN(Number(parts[i + 1]));
        
        // Create the property if it doesn't exist
        if (!(part in current)) {
          current[part] = nextIsArrayIndex ? [] : {};
        } else if (nextIsArrayIndex && !Array.isArray(current[part])) {
          // Handle conflicting paths - if we need an array but have an object
          current[part] = [];
        } else if (!nextIsArrayIndex && typeof current[part] !== 'object') {
          // Handle conflicting paths - if we need an object but have a primitive
          current[part] = {};
        }
        
        current = current[part];
      }
      
      // Set the value at the final part
      const lastPart = parts[parts.length - 1];
      current[lastPart] = obj[key];
    }
  }
  
  // Convert numeric indices objects to arrays where appropriate
  function convertNumericKeysToArrays(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    // Check if object has only numeric keys in sequence
    const keys = Object.keys(obj);
    const isArrayLike = keys.length > 0 && 
      keys.every((key, i) => !isNaN(Number(key)) && Number(key) == i);
    
    if (isArrayLike) {
      // Convert to array
      return keys.map(key => convertNumericKeysToArrays(obj[key]));
    }
    
    // Process object properties recursively
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = convertNumericKeysToArrays(obj[key]);
      }
    }
    
    return obj;
  }
  
  return convertNumericKeysToArrays(result);
}
```

### Examples

```javascript
// Basic usage
const flattened = {
  'name': 'John',
  'age': 30,
  'address.street': '123 Main St',
  'address.city': 'New York',
  'address.zip': '10001',
  'address.coordinates.lat': 40.7128,
  'address.coordinates.lng': -74.006,
  'hobbies.0': 'reading',
  'hobbies.1': 'swimming'
};

const nested = unflattenObject(flattened);
console.log(nested);
/*
{
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York',
    zip: '10001',
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  hobbies: ['reading', 'swimming']
}
*/

// Edge cases
console.log(unflattenObject({})); // {}
console.log(unflattenObject({ 'a': 1, 'a.b': 2 })); 
// { a: { b: 2 } } - Note: conflicting paths, the nested path wins

// Complex array handling
const arrayFlat = {
  'users.0.name': 'John',
  'users.0.roles.0': 'admin',
  'users.0.roles.1': 'editor',
  'users.1.name': 'Jane',
  'users.1.roles.0': 'user'
};
console.log(unflattenObject(arrayFlat));
/*
{
  users: [
    { name: 'John', roles: ['admin', 'editor'] },
    { name: 'Jane', roles: ['user'] }
  ]
}
*/
```

## 3. Get By Path

Safely access nested properties in an object given a string path.

```javascript
/**
 * Safely access a nested property in an object given a string path
 * 
 * @param {Object} obj - The object to access
 * @param {string} path - The path to the property (e.g., "a.b.c" or "a[0].b")
 * @param {any} [defaultValue=undefined] - Value to return if the path doesn't exist
 * @returns {any} - The value at the path or the default value
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Array indices in bracket notation
 * - Non-existent paths
 * - Empty path segments
 */
function getByPath(obj, path, defaultValue = undefined) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return defaultValue;
  }
  
  if (typeof path !== 'string' || path.trim() === '') {
    return obj;
  }
  
  // Normalize path (convert bracket notation to dot notation)
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1');
  const parts = normalizedPath.split('.');
  
  // Navigate the path
  let current = obj;
  
  for (const part of parts) {
    // Skip empty parts
    if (!part) continue;
    
    // If current is null/undefined or doesn't have the property, return default
    if (current === null || 
        typeof current !== 'object' || 
        !(part in current)) {
      return defaultValue;
    }
    
    current = current[part];
  }
  
  return current;
}
```

### Examples

```javascript
// Basic usage
const obj = {
  user: {
    name: "John",
    address: {
      city: "New York",
      zip: "10001"
    },
    hobbies: ["reading", "swimming"]
  },
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      push: false
    }
  }
};

console.log(getByPath(obj, "user.name")); // "John"
console.log(getByPath(obj, "user.address.city")); // "New York"
console.log(getByPath(obj, "user.hobbies[1]")); // "swimming"
console.log(getByPath(obj, "settings.notifications.push")); // false

// Non-existent paths
console.log(getByPath(obj, "user.age")); // undefined
console.log(getByPath(obj, "user.address.country")); // undefined
console.log(getByPath(obj, "user.address.country", "USA")); // "USA" (default value)

// Edge cases
console.log(getByPath(null, "user.name")); // undefined
console.log(getByPath(undefined, "user.name")); // undefined
console.log(getByPath(obj, "")); // The entire object
console.log(getByPath(obj, "user..name")); // "John" (handles empty segments)
console.log(getByPath(obj, "user.hobbies[2]")); // undefined (out of bounds)
```

## 4. Set By Path

Set a nested property in an object given a path string, creating intermediate objects/arrays as needed.

```javascript
/**
 * Sets a nested property in an object given a path string
 * 
 * @param {Object} obj - The object to modify
 * @param {string} path - The path to the property (e.g., "a.b.c" or "a[0].b")
 * @param {any} value - The value to set
 * @returns {Object} - The modified object
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Array indices in bracket notation
 * - Creating intermediate objects/arrays as needed
 * - Empty path segments
 */
function setByPath(obj, path, value) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (typeof path !== 'string' || path.trim() === '') {
    return obj;
  }
  
  // Normalize path (convert bracket notation to dot notation)
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1');
  const parts = normalizedPath.split('.');
  
  // Navigate the path
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    // Skip empty parts
    if (!part) continue;
    
    // Check if the next part is a number (array index)
    const nextIsArrayIndex = !isNaN(Number(parts[i + 1]));
    
    // Create intermediate objects/arrays as needed
    if (!(part in current)) {
      current[part] = nextIsArrayIndex ? [] : {};
    } else if (nextIsArrayIndex && !Array.isArray(current[part])) {
      // Convert to array if needed
      current[part] = [];
    } else if (!nextIsArrayIndex && (current[part] === null || typeof current[part] !== 'object')) {
      // Convert to object if needed
      current[part] = {};
    }
    
    current = current[part];
  }
  
  // Set the value at the final part
  const lastPart = parts[parts.length - 1];
  if (lastPart) {
    current[lastPart] = value;
  }
  
  return obj;
}
```

### Examples

```javascript
// Basic usage
const obj = {
  user: {
    name: "John",
    address: {
      city: "New York"
    }
  }
};

// Set existing property
setByPath(obj, "user.name", "Jane");
console.log(obj.user.name); // "Jane"

// Set new property
setByPath(obj, "user.age", 30);
console.log(obj.user.age); // 30

// Set nested property
setByPath(obj, "user.address.zip", "10001");
console.log(obj.user.address.zip); // "10001"

// Create intermediate objects
setByPath(obj, "settings.theme.color", "dark");
console.log(obj.settings.theme.color); // "dark"

// Work with arrays
setByPath(obj, "user.hobbies[0]", "reading");
setByPath(obj, "user.hobbies[1]", "swimming");
console.log(obj.user.hobbies); // ["reading", "swimming"]

// Edge cases
const empty = {};
setByPath(empty, "a.b.c", 42);
console.log(empty); // { a: { b: { c: 42 } } }

setByPath(obj, "", "ignored");
console.log(obj); // Original object unchanged at the top level

setByPath(obj, "user..name", "John"); // Handles empty segments
console.log(obj.user.name); // "John"
```

## 5. Delete Key

Delete a key from an object without mutating the original object.

```javascript
/**
 * Deletes a key from an object without mutating the original
 * 
 * @param {Object} obj - The object to remove a key from
 * @param {string} key - The key to remove
 * @returns {Object} - A new object without the specified key
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Key doesn't exist
 * - Symbol keys
 */
function deleteKey(obj, key) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.filter((_, index) => String(index) !== key);
  }
  
  // Create a new object without the key
  const result = {};
  
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop) && prop !== key) {
      result[prop] = obj[prop];
    }
  }
  
  // Handle symbol keys
  const symbols = Object.getOwnPropertySymbols(obj);
  for (const sym of symbols) {
    if (sym.toString() !== key.toString()) {
      result[sym] = obj[sym];
    }
  }
  
  return result;
}

/**
 * Alternative implementation using destructuring (only works for string keys)
 * 
 * @param {Object} obj - The object to remove a key from
 * @param {string} key - The key to remove
 * @returns {Object} - A new object without the specified key
 */
function deleteKeyDestructuring(obj, key) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Use destructuring to remove the key
  const { [key]: removed, ...rest } = obj;
  return rest;
}
```

### Examples

```javascript
// Basic usage
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    city: "New York",
    zip: "10001"
  }
};

const userWithoutEmail = deleteKey(user, "email");
console.log(userWithoutEmail);
/*
{
  name: "John",
  age: 30,
  address: {
    city: "New York",
    zip: "10001"
  }
}
*/

// Original object is unchanged
console.log(user.email); // "john@example.com"

// Using destructuring
const userWithoutAge = deleteKeyDestructuring(user, "age");
console.log(userWithoutAge);
/*
{
  name: "John",
  email: "john@example.com",
  address: {
    city: "New York",
    zip: "10001"
  }
}
*/

// Edge cases
console.log(deleteKey(null, "key")); // null
console.log(deleteKey({}, "nonexistent")); // {}

// Arrays
const arr = [10, 20, 30, 40];
console.log(deleteKey(arr, "1")); // [10, 30, 40]

// Symbol keys
const sym = Symbol("id");
const objWithSymbol = { name: "John", [sym]: 123 };
console.log(deleteKey(objWithSymbol, "name")); // { [Symbol(id)]: 123 }
console.log(deleteKey(objWithSymbol, sym)); // { name: "John" }
```

## 6. Merge Objects

Deep merge two or more objects recursively.

```javascript
/**
 * Deep merges multiple objects recursively
 * 
 * @param {...Object} objects - Objects to merge
 * @returns {Object} - A new merged object
 * 
 * Edge cases handled:
 * - Arrays (replaced by default, can be customized to concatenate)
 * - Null values
 * - Different types at the same path
 * - Circular references
 */
function mergeObjects(...objects) {
  // Filter out non-objects
  const validObjects = objects.filter(obj => obj !== null && typeof obj === 'object');
  
  // If no valid objects, return an empty object
  if (validObjects.length === 0) {
    return {};
  }
  
  // If only one valid object, return a copy of it
  if (validObjects.length === 1) {
    return Array.isArray(validObjects[0]) 
      ? [...validObjects[0]] 
      : { ...validObjects[0] };
  }
  
  // Helper function to perform the deep merge
  function deepMerge(target, source, visited = new WeakMap()) {
    // Handle circular references
    if (visited.has(source)) {
      return visited.get(source);
    }
    
    // Skip null/undefined sources
    if (source === null || source === undefined) {
      return target;
    }
    
    // Create a new object/array to avoid mutating the inputs
    const output = Array.isArray(source) ? [] : {};
    
    // Track this object to handle circular references
    visited.set(source, output);
    
    // Copy target properties
    if (target !== null && typeof target === 'object') {
      for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          output[key] = target[key];
        }
      }
      
      // Copy symbol properties from target
      Object.getOwnPropertySymbols(target).forEach(sym => {
        output[sym] = target[sym];
      });
    }
    
    // Merge source properties
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = output[key];
        
        // If both values are objects, merge them recursively
        if (sourceValue !== null && typeof sourceValue === 'object' &&
            targetValue !== null && typeof targetValue === 'object' &&
            !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
          output[key] = deepMerge(targetValue, sourceValue, visited);
        } else {
          // Otherwise, use the source value
          // For arrays, you could choose to concatenate instead:
          // output[key] = Array.isArray(targetValue) && Array.isArray(sourceValue) 
          //   ? [...targetValue, ...sourceValue] 
          //   : sourceValue;
          output[key] = sourceValue !== null && typeof sourceValue === 'object'
            ? deepMerge({}, sourceValue, visited)
            : sourceValue;
        }
      }
    }
    
    // Copy symbol properties from source
    Object.getOwnPropertySymbols(source).forEach(sym => {
      const sourceValue = source[sym];
      const targetValue = output[sym];
      
      if (sourceValue !== null && typeof sourceValue === 'object' &&
          targetValue !== null && typeof targetValue === 'object' &&
          !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
        output[sym] = deepMerge(targetValue, sourceValue, visited);
      } else {
        output[sym] = sourceValue !== null && typeof sourceValue === 'object'
          ? deepMerge({}, sourceValue, visited)
          : sourceValue;
      }
    });
    
    return output;
  }
  
  // Merge all objects one by one
  return validObjects.reduce((result, obj) => deepMerge(result, obj), {});
}
```

### Examples

```javascript
// Basic usage
const defaults = {
  theme: "light",
  notifications: {
    email: true,
    push: false,
    frequency: "daily"
  },
  display: {
    fontSize: 12,
    colorScheme: "default"
  }
};

const userSettings = {
  theme: "dark",
  notifications: {
    push: true,
    sms: false
  },
  display: {
    fontSize: 14
  }
};

const merged = mergeObjects(defaults, userSettings);
console.log(merged);
/*
{
  theme: "dark",
  notifications: {
    email: true,
    push: true,
    frequency: "daily",
    sms: false
  },
  display: {
    fontSize: 14,
    colorScheme: "default"
  }
}
*/

// Merging multiple objects
const additional = {
  notifications: {
    frequency: "weekly"
  },
  newFeature: true
};

const finalSettings = mergeObjects(defaults, userSettings, additional);
console.log(finalSettings);
/*
{
  theme: "dark",
  notifications: {
    email: true,
    push: true,
    frequency: "weekly",
    sms: false
  },
  display: {
    fontSize: 14,
    colorScheme: "default"
  },
  newFeature: true
}
*/

// Edge cases
console.log(mergeObjects(null, undefined, {})); // {}
console.log(mergeObjects({ a: 1 }, null)); // { a: 1 }

// Arrays
const obj1 = { items: [1, 2, 3] };
const obj2 = { items: [4, 5] };
console.log(mergeObjects(obj1, obj2)); // { items: [4, 5] } (arrays are replaced)

// To concatenate arrays instead, modify the deepMerge function as commented

// Different types at the same path
const obj3 = { data: { value: 42 } };
const obj4 = { data: "string" };
console.log(mergeObjects(obj3, obj4)); // { data: "string" } (later object wins)
console.log(mergeObjects(obj4, obj3)); // { data: { value: 42 } } (later object wins)

// Circular references
const circular1 = { a: 1 };
circular1.self = circular1;
const circular2 = { b: 2 };
circular2.self = circular2;

const mergedCircular = mergeObjects(circular1, circular2);
console.log(mergedCircular.a); // 1
console.log(mergedCircular.b); // 2
console.log(mergedCircular.self === mergedCircular); // true (circular reference preserved)
