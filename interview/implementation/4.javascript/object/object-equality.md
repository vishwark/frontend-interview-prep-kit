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
 * This implementation is inspired by Lodash's isEqual function
 * 
 * @param {any} a - First value to compare
 * @param {any} b - Second value to compare
 * @param {WeakMap} [seen=new WeakMap()] - WeakMap to track visited objects (for circular references)
 * @returns {boolean} - True if values are deeply equal, false otherwise
 */
const isEqual = (a, b, seen = new WeakMap()) => {
    // Fast path for primitives and same references using Object.is
    // Handles special cases like NaN === NaN and -0 !== +0
    if (Object.is(a, b)) return true;

    // If either is not an object or null, they're not equal
    // (since Object.is already checked primitive equality)
    if (typeof a !== 'object' || a === null ||
        typeof b !== 'object' || b === null) return false;

    // Handle circular references by checking if we've seen this pair before
    if (seen.has(a) && seen.get(a) === b) return true;
    
    // Track this pair to handle circular references in nested structures
    seen.set(a, b);

    // Get the object type tags using toString (more reliable than instanceof)
    // This helps differentiate between arrays, plain objects, dates, etc.
    const tagA = Object.prototype.toString.call(a);
    const tagB = Object.prototype.toString.call(b);
    
    // If they're different types of objects, they're not equal
    if (tagA !== tagB) return false;

    // Handle different object types with specific comparison logic
    switch (tagA) {
        case '[object Array]': {
            // Arrays must have the same length
            if (a.length !== b.length) return false;
            
            // Compare each element in order (arrays are ordered collections)
            for (let i = 0; i < a.length; i++) {
                // Lodash treats array holes as undefined
                if (!isEqual(a[i], b[i], seen)) return false;
            }
            return true;
        }

        case '[object Object]': {
            // Get all keys including symbols
            const keysA = [...Object.keys(a), ...Object.getOwnPropertySymbols(a)];
            const keysB = [...Object.keys(b), ...Object.getOwnPropertySymbols(b)];

            // Objects must have the same number of properties
            if (keysA.length !== keysB.length) return false;

            // Check each key in a exists in b with equal values
            for (let key of keysA) {
                if (!keysB.includes(key) || !isEqual(a[key], b[key], seen)) return false;
            }
            return true;
        }

        case '[object Date]':
            // Compare dates by their time value
            return a.getTime() === b.getTime();

        case '[object RegExp]':
            // Compare regexps by their source pattern and flags
            return a.source === b.source && a.flags === b.flags;

        case '[object Set]': {
            // Sets must have the same size
            if (a.size !== b.size) return false;

            // Convert set b to array for easier comparison
            const bValues = [...b];
            // Track matched elements to avoid duplicate matches
            const matched = new Set();

            // For each value in set a, find a matching value in set b
            for (let valA of a) {
                let found = false;

                // Try to find an unmatched element in b that equals the current element in a
                for (let i = 0; i < bValues.length; i++) {
                    // Skip already matched elements
                    if (matched.has(i)) continue;
                    
                    // If we find a match, mark it as matched and stop searching
                    if (isEqual(valA, bValues[i], seen)) {
                        matched.add(i);
                        found = true;
                        break;
                    }
                }

                // If no match found for this element, sets are not equal
                if (!found) return false;
            }

            return true;
        }

        case '[object Map]': {
            // Maps must have the same size
            if (a.size !== b.size) return false;

            // Convert map b to entries array for easier comparison
            const bEntries = [...b.entries()];
            // Track matched entries to avoid duplicate matches
            const matched = new Set();

            // For each entry in map a, find a matching entry in map b
            for (let [keyA, valA] of a.entries()) {
                let found = false;

                // Try to find an unmatched entry in b that equals the current entry in a
                for (let i = 0; i < bEntries.length; i++) {
                    // Skip already matched entries
                    if (matched.has(i)) continue;
                    
                    const [keyB, valB] = bEntries[i];
                    
                    // Both key and value must be equal for map entries
                    if (isEqual(keyA, keyB, seen) && isEqual(valA, valB, seen)) {
                        matched.add(i);
                        found = true;
                        break;
                    }
                }

                // If no match found for this entry, maps are not equal
                if (!found) return false;
            }

            return true;
        }

        // For other object types, default to false
        // This could be extended to handle other types like TypedArrays, etc.
        default:
            return false;
    }
};
```

### Limitations and How to Handle Them

This deep equality implementation has several limitations that should be considered:

1. **Performance with Large Objects**:
   - **Limitation**: Deep comparison can be CPU-intensive for large nested structures.
   - **Solution**: Consider implementing a depth limit parameter or using memoization for frequently compared objects.

2. **Special Object Types**:
   - **Limitation**: The current implementation handles Arrays, Objects, Dates, RegExps, Sets, and Maps, but not other specialized objects like TypedArrays, Promises, or custom class instances.
   - **Solution**: Extend the switch statement to handle additional object types or add a customizer function parameter that allows custom comparison logic.

3. **Property Descriptors**:
   - **Limitation**: Property attributes (enumerable, configurable, writable) and getters/setters are not compared.
   - **Solution**: Use Object.getOwnPropertyDescriptors() to compare property descriptors if needed.

4. **Prototype Chain**:
   - **Limitation**: The prototype chain is not considered in the comparison.
   - **Solution**: Add an option to compare constructor properties or the entire prototype chain.

5. **Symbol Properties**:
   - **Limitation**: While the implementation includes symbol keys, it doesn't distinguish between enumerable and non-enumerable symbol properties.
   - **Solution**: Use Object.getOwnPropertySymbols() with filtering for more precise control.

6. **WeakMap vs Map for Circular References**:
   - **Limitation**: Using WeakMap prevents memory leaks but doesn't work with primitive keys.
   - **Solution**: The current implementation is optimal for object comparisons, but could be modified to use Map if primitive keys need to be tracked.

7. **Error Objects**:
   - **Limitation**: Error objects have non-enumerable properties like stack traces that aren't compared.
   - **Solution**: Add special handling for Error objects to compare their message, name, and other relevant properties.

8. **Function Comparison**:
   - **Limitation**: Functions are compared by reference, not by their code or behavior.
   - **Solution**: For function comparison, consider options like comparing function.toString() or treating all functions as equal based on use case.

### Example Implementation with Extended Features

To address some of these limitations, you could extend the isEqual function:

```javascript
const isEqualExtended = (a, b, options = {}, seen = new WeakMap()) => {
    // Default options
    const {
        comparePrototypes = false,
        compareFunctions = 'reference', // 'reference', 'toString', or 'always'
        maxDepth = Infinity,
        currentDepth = 0
    } = options;
    
    // Depth limit check
    if (currentDepth > maxDepth) return true;
    
    // Rest of the implementation with added options...
    // (similar to isEqual but with the extended features)
};
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
