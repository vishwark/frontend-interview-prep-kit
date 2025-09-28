# Object Equality in JavaScript

This document covers implementations of shallow and deep equality checks for JavaScript objects.

## Built-in Methods for Object Equality

JavaScript provides several built-in operators and methods for checking equality, each with its own advantages and limitations:

### Equality Operators

1. **Loose Equality (==)**
   - Syntax: `a == b`
   - Performs type coercion before comparison
   - Limitations:
     - Unpredictable results due to type coercion
     - `null == undefined` returns true
     - `'0' == 0` returns true
     - Cannot distinguish between -0 and +0
     - Not suitable for object comparison (compares references only)

2. **Strict Equality (===)**
   - Syntax: `a === b`
   - No type coercion, types must match
   - Limitations:
     - NaN !== NaN (returns false when comparing NaN with itself)
     - -0 === +0 (cannot distinguish between negative and positive zero)
     - Only compares object references, not their contents
     - Arrays and objects with identical contents but different references return false

3. **Object.is()**
   - Syntax: `Object.is(a, b)`
   - Similar to === but with improved handling of edge cases
   - Advantages:
     - NaN is equal to NaN
     - -0 is not equal to +0
   - Limitations:
     - Still only compares object references, not their contents
     - No deep equality checking for nested objects

### Object Comparison Methods

1. **JSON.stringify() Comparison**
   - Syntax: `JSON.stringify(obj1) === JSON.stringify(obj2)`
   - Simple way to compare object contents
   - Limitations:
     - Doesn't work with circular references
     - Ignores undefined values and functions
     - Order of properties matters
     - Cannot distinguish between different object types with same JSON representation
     - Converts dates to strings

2. **Lodash isEqual()**
   - Syntax: `_.isEqual(obj1, obj2)`
   - Performs deep equality comparison
   - Advantages:
     - Handles nested objects and arrays
     - Compares values rather than references
     - Handles special cases like dates, regexps, etc.
   - Limitations:
     - Requires external library
     - May have performance implications for large objects

The implementations in this document provide more control and handle edge cases that built-in methods don't address.

## 1. Shallow Equal

Shallow equality checks if two objects have the same keys and values at the top level only (no nested deep check).

```javascript
/**
 * Checks if two objects are shallowly equal (same keys & values, no nested deep check)
 * 
 * @param {Object} obj1 - First object to compare
 * @param {Object} obj2 - Second object to compare
 * @returns {boolean} - True if objects are shallowly equal, false otherwise
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Different number of keys
 * - Different key names
 * - Different value types
 * - Special values like NaN, -0/+0
 */
function shallowEqual(obj1, obj2) {
  // Handle non-object inputs
  if (typeof obj1 !== 'object' || obj1 === null || 
      typeof obj2 !== 'object' || obj2 === null) {
    return Object.is(obj1, obj2);
  }
  
  // Check if they're the same reference
  if (obj1 === obj2) {
    return true;
  }
  
  // Get keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  // Quick check: different number of keys means not equal
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  // Check if all keys in obj1 exist in obj2 with the same values
  for (const key of keys1) {
    // Check if key exists in obj2
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }
    
    // Compare values using Object.is for proper NaN and -0/+0 handling
    if (!Object.is(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}
```

### Examples

```javascript
// Basic usage
const obj1 = { a: 1, b: 2, c: 'hello' };
const obj2 = { a: 1, b: 2, c: 'hello' };
const obj3 = { a: 1, b: 3, c: 'hello' };

console.log(shallowEqual(obj1, obj2)); // true
console.log(shallowEqual(obj1, obj3)); // false

// Edge cases
console.log(shallowEqual(null, null)); // true
console.log(shallowEqual({}, {})); // true
console.log(shallowEqual({ a: NaN }, { a: NaN })); // true (Object.is handles NaN correctly)
console.log(shallowEqual({ a: 0 }, { a: -0 })); // false (Object.is distinguishes -0 and +0)

// Nested objects (shallow equality only checks references)
const nested1 = { a: 1, b: { c: 2 } };
const nested2 = { a: 1, b: { c: 2 } };
console.log(shallowEqual(nested1, nested2)); // false (nested objects have different references)

const shared = { c: 2 };
const nested3 = { a: 1, b: shared };
const nested4 = { a: 1, b: shared };
console.log(shallowEqual(nested3, nested4)); // true (nested objects have same reference)
```

## 2. Deep Equal

Deep equality recursively checks if two objects have the same structure and values, including nested objects and arrays.

```javascript
/**
 * Checks if two values are deeply equal (including nested objects and arrays)
 * 
 * @param {any} val1 - First value to compare
 * @param {any} val2 - Second value to compare
 * @param {Map} [visited=new Map()] - Map to track visited objects (for circular references)
 * @returns {boolean} - True if values are deeply equal, false otherwise
 * 
 * Edge cases handled:
 * - Primitive values
 * - Different types
 * - Arrays with same values but different order
 * - Special values like NaN, -0/+0
 * - Date objects
 * - RegExp objects
 * - Circular references
 * - Maps and Sets
 */
function deepEqual(val1, val2, visited = new Map()) {
  // Handle primitive types and special cases
  if (Object.is(val1, val2)) {
    return true;
  }
  
  // If either is not an object or null, they're not equal (since Object.is already checked)
  if (typeof val1 !== 'object' || val1 === null || 
      typeof val2 !== 'object' || val2 === null) {
    return false;
  }
  
  // Handle circular references
  if (visited.has(val1)) {
    return visited.get(val1) === val2;
  }
  
  // Track this pair to handle circular references
  visited.set(val1, val2);
  
  // Handle different object types
  const type1 = Object.prototype.toString.call(val1);
  const type2 = Object.prototype.toString.call(val2);
  
  // If they're different types of objects, they're not equal
  if (type1 !== type2) {
    return false;
  }
  
  // Handle Date objects
  if (val1 instanceof Date) {
    return val1.getTime() === val2.getTime();
  }
  
  // Handle RegExp objects
  if (val1 instanceof RegExp) {
    return val1.toString() === val2.toString();
  }
  
  // Handle Arrays
  if (Array.isArray(val1)) {
    if (val1.length !== val2.length) {
      return false;
    }
    
    for (let i = 0; i < val1.length; i++) {
      if (!deepEqual(val1[i], val2[i], new Map(visited))) {
        return false;
      }
    }
    
    return true;
  }
  
  // Handle Maps
  if (val1 instanceof Map) {
    if (val1.size !== val2.size) {
      return false;
    }
    
    for (const [key, value] of val1) {
      // Check if val2 has the key and if the values are deeply equal
      if (!val2.has(key) || !deepEqual(value, val2.get(key), new Map(visited))) {
        return false;
      }
    }
    
    return true;
  }
  
  // Handle Sets
  if (val1 instanceof Set) {
    if (val1.size !== val2.size) {
      return false;
    }
    
    // Convert sets to arrays for comparison
    const arr1 = Array.from(val1);
    const arr2 = Array.from(val2);
    
    // For each item in arr1, find a matching item in arr2
    for (const item1 of arr1) {
      // Try to find a matching item in arr2
      const found = arr2.some(item2 => deepEqual(item1, item2, new Map(visited)));
      if (!found) {
        return false;
      }
    }
    
    return true;
  }
  
  // Handle plain objects
  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  // Check if all keys in val1 exist in val2 with deeply equal values
  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(val2, key) || 
        !deepEqual(val1[key], val2[key], new Map(visited))) {
      return false;
    }
  }
  
  return true;
}
```

### Examples

```javascript
// Basic usage
const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
const obj3 = { a: 1, b: { c: 2, d: [3, 5] } };

console.log(deepEqual(obj1, obj2)); // true
console.log(deepEqual(obj1, obj3)); // false

// Edge cases
console.log(deepEqual(null, null)); // true
console.log(deepEqual({}, {})); // true
console.log(deepEqual([], [])); // true
console.log(deepEqual({ a: NaN }, { a: NaN })); // true
console.log(deepEqual({ a: 0 }, { a: -0 })); // false

// Date objects
const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');
console.log(deepEqual(date1, date2)); // true
console.log(deepEqual(date1, date3)); // false
console.log(deepEqual({ date: date1 }, { date: date2 })); // true

// RegExp objects
console.log(deepEqual(/test/g, /test/g)); // true
console.log(deepEqual(/test/g, /test/i)); // false

// Maps and Sets
const map1 = new Map([['a', 1], ['b', 2]]);
const map2 = new Map([['a', 1], ['b', 2]]);
const map3 = new Map([['a', 1], ['b', 3]]);
console.log(deepEqual(map1, map2)); // true
console.log(deepEqual(map1, map3)); // false

const set1 = new Set([1, 2, { a: 3 }]);
const set2 = new Set([1, 2, { a: 3 }]);
const set3 = new Set([1, 2, { a: 4 }]);
console.log(deepEqual(set1, set2)); // true
console.log(deepEqual(set1, set3)); // false

// Circular references
const circular1 = { a: 1 };
circular1.self = circular1;
const circular2 = { a: 1 };
circular2.self = circular2;
const circular3 = { a: 2 };
circular3.self = circular3;

console.log(deepEqual(circular1, circular2)); // true
console.log(deepEqual(circular1, circular3)); // false

// Complex nested structures
const complex1 = {
  a: 1,
  b: {
    c: [1, 2, { d: 3 }],
    e: new Map([['f', { g: new Set([1, 2]) }]])
  }
};
const complex2 = {
  a: 1,
  b: {
    c: [1, 2, { d: 3 }],
    e: new Map([['f', { g: new Set([1, 2]) }]])
  }
};
console.log(deepEqual(complex1, complex2)); // true
