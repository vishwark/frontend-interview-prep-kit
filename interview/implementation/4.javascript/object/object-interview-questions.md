# 🎯 Practical Object Interview Questions (Topic-wise)

## 1️⃣ Equality (deep/shallow)

### Easy

#### Write a function to check shallow equality of two objects.

```javascript
/**
 * Compares two objects for shallow equality
 * @param {Object} obj1 - First object to compare
 * @param {Object} obj2 - Second object to compare
 * @returns {boolean} - True if objects are shallowly equal, false otherwise
 */
function shallowEqual(obj1, obj2) {
  // Handle edge cases: null, undefined, or non-objects
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null || 
      typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  
  // Check if they have the same number of keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  // Check if all keys in obj1 exist in obj2 with the same values
  return keys1.every(key => 
    Object.prototype.hasOwnProperty.call(obj2, key) && 
    obj1[key] === obj2[key]
  );
}

// Example usage
console.log(shallowEqual({a: 1, b: 2}, {a: 1, b: 2})); // true
console.log(shallowEqual({a: 1, b: 2}, {a: 1, b: 3})); // false
console.log(shallowEqual({a: 1, b: 2}, {a: 1})); // false
console.log(shallowEqual({a: 1, b: {c: 3}}, {a: 1, b: {c: 3}})); // false (nested objects)
console.log(shallowEqual(null, {})); // false
console.log(shallowEqual(undefined, {})); // false
console.log(shallowEqual({}, {})); // true
```

**Edge Cases to Consider:**
- Objects with same properties but different order
- Objects with nested objects (shallow equality will return false)
- Non-object inputs (null, undefined, primitives)
- Empty objects
- Objects with inherited properties (we only check own properties)

#### Why does {} === {} return false?

In JavaScript, when comparing objects using the strict equality operator (`===`), it checks if both operands reference the exact same object in memory, not if they have the same content.

```javascript
const obj1 = {};
const obj2 = {};
const obj3 = obj1;

console.log(obj1 === obj2); // false - different objects in memory
console.log(obj1 === obj3); // true - same reference

// This is different from primitive values
console.log(1 === 1); // true
console.log("hello" === "hello"); // true
```

**Explanation:**
- Objects are reference types in JavaScript
- `{}` creates a new object instance each time
- When comparing with `===`, JavaScript checks if both sides point to the same memory location
- For primitives (strings, numbers, etc.), JavaScript compares their values
- To compare object contents, you need to use a custom equality function like the `shallowEqual` above

### Medium

#### Implement deepEqual(obj1, obj2) for nested objects.

```javascript
/**
 * Compares two values for deep equality
 * @param {any} obj1 - First value to compare
 * @param {any} obj2 - Second value to compare
 * @returns {boolean} - True if values are deeply equal, false otherwise
 */
function deepEqual(obj1, obj2) {
  // Same reference or same primitive value
  if (obj1 === obj2) {
    return true;
  }
  
  // Handle special case: NaN (NaN === NaN is false, but we want true for deep equality)
  if (typeof obj1 === 'number' && typeof obj2 === 'number' && 
      isNaN(obj1) && isNaN(obj2)) {
    return true;
  }
  
  // If either is null or not an object, and they're not strictly equal, they're not equal
  if (obj1 === null || obj2 === null || 
      typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  
  // Special handling for Date objects
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  
  // Special handling for RegExp objects
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  // If one is array and the other is not, they're not equal
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }
  
  // Compare object keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  // Check if all keys in obj1 exist in obj2 with the same values (recursively)
  return keys1.every(key => 
    Object.prototype.hasOwnProperty.call(obj2, key) && 
    deepEqual(obj1[key], obj2[key])
  );
}

// Example usage
console.log(deepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})); // true
console.log(deepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 3}})); // false
console.log(deepEqual([1, 2, [3, 4]], [1, 2, [3, 4]])); // true
console.log(deepEqual(new Date('2023-01-01'), new Date('2023-01-01'))); // true
console.log(deepEqual(/abc/g, /abc/g)); // true
console.log(deepEqual(NaN, NaN)); // true
console.log(deepEqual({a: undefined}, {b: undefined})); // false
console.log(deepEqual({a: undefined}, {a: undefined})); // true
```

**Edge Cases to Consider:**
- Objects with nested objects and arrays
- Special JavaScript objects like Date, RegExp
- NaN values (NaN !== NaN in JavaScript, but we want them to be equal)
- undefined vs missing keys
- Arrays with nested objects
- Objects with same properties but in different order

#### Compare { a: 1, b: { c: 2 } } and { a: 1, b: { c: 2 } } — how to ensure equality?

To ensure equality between nested objects like these, you need to use a deep equality function that recursively compares all nested properties. The `deepEqual` function above handles this case correctly.

```javascript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

console.log(obj1 === obj2); // false (different references)
console.log(deepEqual(obj1, obj2)); // true (same structure and values)
```

### Hard

#### Handle edge cases in deep equality: arrays, dates, NaN, undefined vs missing keys.

```javascript
/**
 * Advanced deep equality function that handles various edge cases
 * @param {any} obj1 - First value to compare
 * @param {any} obj2 - Second value to compare
 * @param {Object} options - Comparison options
 * @param {boolean} options.strict - Whether to use strict comparison for undefined vs missing keys
 * @returns {boolean} - True if values are deeply equal, false otherwise
 */
function advancedDeepEqual(obj1, obj2, options = { strict: false }) {
  // Same reference or same primitive value
  if (obj1 === obj2) {
    return true;
  }
  
  // Handle special case: NaN
  if (typeof obj1 === 'number' && typeof obj2 === 'number' && 
      isNaN(obj1) && isNaN(obj2)) {
    return true;
  }
  
  // If either is null or not an object, and they're not strictly equal, they're not equal
  if (obj1 === null || obj2 === null || 
      typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  
  // Special handling for Date objects
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  
  // Special handling for RegExp objects
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }
  
  // Special handling for Map objects
  if (obj1 instanceof Map && obj2 instanceof Map) {
    if (obj1.size !== obj2.size) {
      return false;
    }
    
    for (const [key, val] of obj1) {
      // For maps, we need to check if the key exists and the value is equal
      if (!obj2.has(key) || !advancedDeepEqual(val, obj2.get(key), options)) {
        return false;
      }
    }
    
    return true;
  }
  
  // Special handling for Set objects
  if (obj1 instanceof Set && obj2 instanceof Set) {
    if (obj1.size !== obj2.size) {
      return false;
    }
    
    // Convert sets to arrays and compare them
    return advancedDeepEqual([...obj1], [...obj2], options);
  }
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    
    for (let i = 0; i < obj1.length; i++) {
      if (!advancedDeepEqual(obj1[i], obj2[i], options)) {
        return false;
      }
    }
    
    return true;
  }
  
  // If one is array and the other is not, they're not equal
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }
  
  // Compare object keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  // In strict mode, objects must have the same keys
  if (options.strict && keys1.length !== keys2.length) {
    return false;
  }
  
  // In non-strict mode, we need to check for undefined vs missing keys
  if (!options.strict) {
    // Get all unique keys from both objects
    const allKeys = [...new Set([...keys1, ...keys2])];
    
    // Check each key
    for (const key of allKeys) {
      const hasKey1 = Object.prototype.hasOwnProperty.call(obj1, key);
      const hasKey2 = Object.prototype.hasOwnProperty.call(obj2, key);
      
      // If one has the key and the other doesn't
      if (hasKey1 !== hasKey2) {
        // If the value is undefined, treat it as if the key is missing
        if ((hasKey1 && obj1[key] === undefined) || 
            (hasKey2 && obj2[key] === undefined)) {
          continue; // Skip this key
        }
        return false;
      }
      
      // If both have the key, compare the values
      if (hasKey1 && hasKey2 && !advancedDeepEqual(obj1[key], obj2[key], options)) {
        return false;
      }
    }
    
    return true;
  }
  
  // In strict mode, check if all keys in obj1 exist in obj2 with the same values
  return keys1.every(key => 
    Object.prototype.hasOwnProperty.call(obj2, key) && 
    advancedDeepEqual(obj1[key], obj2[key], options)
  );
}

// Example usage
console.log(advancedDeepEqual(
  {a: 1, b: [1, 2, {c: 3}]}, 
  {a: 1, b: [1, 2, {c: 3}]}
)); // true

console.log(advancedDeepEqual(
  {a: undefined}, 
  {b: 5}
)); // false

console.log(advancedDeepEqual(
  {a: undefined}, 
  {}, 
  {strict: false}
)); // true (non-strict mode treats undefined as missing key)

console.log(advancedDeepEqual(
  {a: undefined}, 
  {}, 
  {strict: true}
)); // false (strict mode requires same keys)

console.log(advancedDeepEqual(
  new Map([['a', 1], ['b', 2]]), 
  new Map([['a', 1], ['b', 2]])
)); // true

console.log(advancedDeepEqual(
  new Set([1, 2, 3]), 
  new Set([1, 2, 3])
)); // true

console.log(advancedDeepEqual(
  [NaN, undefined, null], 
  [NaN, undefined, null]
)); // true
```

**Edge Cases Handled:**
- NaN values (which are not equal to themselves with standard comparison)
- Date objects (compared by timestamp)
- RegExp objects (compared by string representation)
- Map and Set objects
- Arrays with nested objects
- undefined values vs missing keys (with strict/non-strict options)
- null values

#### Implement a deep equality check that detects circular references without infinite loop.

```javascript
/**
 * Deep equality function that handles circular references
 * @param {any} obj1 - First value to compare
 * @param {any} obj2 - Second value to compare
 * @returns {boolean} - True if values are deeply equal, false otherwise
 */
function circularDeepEqual(obj1, obj2) {
  // Use WeakMap to track visited pairs to handle circular references
  const visited = new WeakMap();
  
  function deepEqualInternal(o1, o2) {
    // Same reference or same primitive value
    if (o1 === o2) {
      return true;
    }
    
    // Handle special case: NaN
    if (typeof o1 === 'number' && typeof o2 === 'number' && 
        isNaN(o1) && isNaN(o2)) {
      return true;
    }
    
    // If either is null or not an object, and they're not strictly equal, they're not equal
    if (o1 === null || o2 === null || 
        typeof o1 !== 'object' || typeof o2 !== 'object') {
      return false;
    }
    
    // Check if we've already compared these objects (circular reference)
    if (visited.has(o1)) {
      // If we've seen o1 before, check if it was compared with o2
      const knownComparisons = visited.get(o1);
      if (knownComparisons.has(o2)) {
        return knownComparisons.get(o2);
      }
    } else {
      // Initialize the map for o1
      visited.set(o1, new Map());
    }
    
    // Mark these objects as being compared (initially assume they're equal)
    visited.get(o1).set(o2, true);
    
    // Special handling for Date objects
    if (o1 instanceof Date && o2 instanceof Date) {
      const result = o1.getTime() === o2.getTime();
      visited.get(o1).set(o2, result);
      return result;
    }
    
    // Special handling for RegExp objects
    if (o1 instanceof RegExp && o2 instanceof RegExp) {
      const result = o1.toString() === o2.toString();
      visited.get(o1).set(o2, result);
      return result;
    }
    
    // Handle arrays
    if (Array.isArray(o1) && Array.isArray(o2)) {
      if (o1.length !== o2.length) {
        visited.get(o1).set(o2, false);
        return false;
      }
      
      for (let i = 0; i < o1.length; i++) {
        if (!deepEqualInternal(o1[i], o2[i])) {
          visited.get(o1).set(o2, false);
          return false;
        }
      }
      
      visited.get(o1).set(o2, true);
      return true;
    }
    
    // If one is array and the other is not, they're not equal
    if (Array.isArray(o1) !== Array.isArray(o2)) {
      visited.get(o1).set(o2, false);
      return false;
    }
    
    // Compare object keys
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);
    
    if (keys1.length !== keys2.length) {
      visited.get(o1).set(o2, false);
      return false;
    }
    
    // Check if all keys in o1 exist in o2 with the same values
    for (const key of keys1) {
      if (!Object.prototype.hasOwnProperty.call(o2, key) || 
          !deepEqualInternal(o1[key], o2[key])) {
        visited.get(o1).set(o2, false);
        return false;
      }
    }
    
    visited.get(o1).set(o2, true);
    return true;
  }
  
  return deepEqualInternal(obj1, obj2);
}

// Example usage with circular references
const obj1 = { a: 1 };
const obj2 = { a: 1 };

// Create circular references
obj1.self = obj1;
obj2.self = obj2;

console.log(circularDeepEqual(obj1, obj2)); // true

const obj3 = { a: 1, b: 2 };
const obj4 = { a: 1, b: 3 };

// Create circular references
obj3.self = obj3;
obj4.self = obj4;

console.log(circularDeepEqual(obj3, obj4)); // false

// More complex circular structures
const obj5 = { a: 1 };
const obj6 = { a: 1 };
const nested1 = { parent: obj5 };
const nested2 = { parent: obj6 };
obj5.child = nested1;
obj6.child = nested2;

console.log(circularDeepEqual(obj5, obj6)); // true
```

**How Circular Reference Detection Works:**
1. Use a WeakMap to track objects we've already compared
2. When we encounter an object, check if we've seen it before
3. If we have, and it was compared with the current object, return the stored result
4. Otherwise, store the pair and continue with the comparison
5. This prevents infinite recursion while correctly handling circular structures

## 2️⃣ Copying (deep/shallow)

### Easy

#### Demonstrate shallow copy with spread operator {...obj}. Why do nested objects still mutate?

```javascript
/**
 * Demonstrates shallow copy with spread operator
 */
function demonstrateShallowCopy() {
  // Original object with nested structure
  const original = {
    name: "John",
    age: 30,
    address: {
      city: "New York",
      zip: "10001"
    },
    hobbies: ["reading", "swimming"]
  };
  
  // Create a shallow copy using spread operator
  const copy = { ...original };
  
  // Modify primitive value in copy
  copy.name = "Jane";
  
  // Modify nested object in copy
  copy.address.city = "Boston";
  
  // Modify array in copy
  copy.hobbies.push("running");
  
  console.log("Original after modification:", original);
  console.log("Copy after modification:", copy);
  
  // Result explanation:
  // 1. Primitive values (name, age) are copied by value, so changing them in the copy doesn't affect the original
  // 2. Nested objects and arrays are copied by reference, so changing them in the copy DOES affect the original
}

demonstrateShallowCopy();
// Output:
// Original after modification: {
//   name: "John",
//   age: 30,
//   address: { city: "Boston", zip: "10001" },  // Changed!
//   hobbies: ["reading", "swimming", "running"] // Changed!
// }
// Copy after modification: {
//   name: "Jane",
//   age: 30,
//   address: { city: "Boston", zip: "10001" },
//   hobbies: ["reading", "swimming", "running"]
// }
```

**Why Nested Objects Still Mutate:**
- The spread operator `{...obj}` creates a shallow copy
- Primitive values (strings, numbers, booleans) are copied by value
- Objects and arrays are copied by reference
- When you modify a nested object in the copy, you're modifying the same object that the original references
- To avoid this, you need to create a deep copy that recursively copies all nested objects

#### Write a function to shallow copy an object with Object.assign.

```javascript
/**
 * Creates a shallow copy of an object using Object.assign
 * @param {Object} obj - Object to copy
 * @returns {Object} - Shallow copy of the object
 */
function shallowCopyWithAssign(obj) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return [...obj]; // or Object.assign([], obj);
  }
  
  // Handle regular objects
  return Object.assign({}, obj);
}

// Example usage
const original = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    zip: "10001"
  },
  hobbies: ["reading", "swimming"]
};

const copy = shallowCopyWithAssign(original);

// Modify copy
copy.name = "Jane";
copy.address.city = "Boston"; // Will affect original too
copy.hobbies.push("running"); // Will affect original too

console.log("Original:", original);
console.log("Copy:", copy);

// Edge cases
console.log(shallowCopyWithAssign(null)); // null
console.log(shallowCopyWithAssign(42)); // 42
console.log(shallowCopyWithAssign([1, 2, 3])); // [1, 2, 3] (new array)
```

**Important Notes about Object.assign:**
- `Object.assign({}, obj)` creates a new object and copies all enumerable own properties from `obj` to it
- Like the spread operator, it only creates a shallow copy
- It can handle arrays, but it's better to use array-specific methods like slice() or spread for arrays
- It doesn't copy property descriptors (enumerable, configurable, writable)
- It doesn't copy prototype properties
- It will throw an error if obj is null or undefined

### Medium

#### Implement a deep copy function using recursion.

```javascript
/**
 * Creates a deep copy of a value using recursion
 * @param {any} value - Value to copy
 * @returns {any} - Deep copy of the value
 */
function deepCopy(value) {
  // Handle primitives and null
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value);
  }
  
  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => deepCopy(item));
  }
  
  // Handle Objects
  const copy = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      copy[key] = deepCopy(value[key]);
    }
  }
  
  return copy;
}

// Example usage
const original = {
  name: "John",
  age: 30,
  birthDate: new Date('1990-01-01'),
  pattern: /test/gi,
  address: {
    city: "New York",
    zip: "10001"
  },
  hobbies: ["reading", {type: "sport", name: "swimming"}]
};

const copy = deepCopy(original);

// Modify copy
copy.name = "Jane";
copy.address.city = "Boston"; // Won't affect original
copy.hobbies[1].name = "running"; // Won't affect original
copy.birthDate.setFullYear(2000); // Won't affect original

console.log("Original:", original);
console.log("Copy:", copy);
```

**Edge Cases and Limitations:**
- This implementation handles primitive values, objects, arrays, dates, and regular expressions
- It doesn't handle circular references (will cause stack overflow)
- It doesn't preserve non-enumerable properties
- It doesn't handle some built-in types like Map, Set, etc.
- It doesn't preserve the prototype chain

#### What's the issue with JSON.stringify(JSON.parse(obj)) for deep cloning?

```javascript
/**
 * Demonstrates the limitations of using JSON.stringify/parse for deep cloning
 */
function demonstrateJsonCloneLimitations() {
  const original = {
    // These will work fine
    string: "Hello",
    number: 42,
    boolean: true,
    null: null,
    array: [1, 2, 3],
    nestedObj: { a: 1, b: 2 },
    
    // These will be lost or transformed
    date: new Date(),
    regex: /test/gi,
    undefined: undefined,
    infinity: Infinity,
    nan: NaN,
    
    // Functions will be lost
    method: function() { return "Hello"; },
    
    // Symbol keys will be lost
    [Symbol('id')]: 123,
    
    // Circular references will cause errors
    // circular: null // Will set this later
  };
  
  // Create circular reference
  // original.circular = original;
  
  try {
    // Attempt to clone using JSON
    const jsonClone = JSON.parse(JSON.stringify(original));
    
    console.log("Original:", original);
    console.log("JSON Clone:", jsonClone);
    
    // Check what happened to special values
    console.log("\nComparisons:");
    console.log("Date (original):", original.date, "- type:", typeof original.date);
    console.log("Date (clone):", jsonClone.date, "- type:", typeof jsonClone.date);
    
    console.log("RegExp (original):", original.regex, "- type:", typeof original.regex);
    console.log("RegExp (clone):", jsonClone.regex, "- type:", typeof jsonClone.regex);
    
    console.log("Function exists in original:", typeof original.method === 'function');
    console.log("Function exists in clone:", typeof jsonClone.method === 'function');
    
    console.log("Undefined in original:", original.undefined);
    console.log("Undefined in clone:", jsonClone.undefined);
    
    console.log("Symbol key in original:", original[Symbol('id')]);
    console.log("Symbol key in clone:", jsonClone[Symbol('id')]);
    
    console.log("Infinity in original:", original.infinity);
    console.log("Infinity in clone:", jsonClone.infinity);
    
    console.log("NaN in original:", original.nan);
    console.log("NaN in clone:", jsonClone.nan);
    
  } catch (error) {
    console.error("Error during JSON cloning:", error.message);
    
    // Uncomment to see error with circular references
    // console.log("Try uncommenting the circular reference to see the error");
  }
}

demonstrateJsonCloneLimitations();
```

**Issues with JSON.stringify/parse for Deep Cloning:**

1. **Loss of Data Types:**
   - Functions are completely lost
   - Dates are converted to strings
   - RegExp objects are converted to empty objects
   - undefined values are removed
   - Symbol keys are removed
   - Infinity and NaN are converted to null

2. **Circular References:**
   - Throws an error: "TypeError: Converting circular structure to JSON"

3. **Special Objects:**
   - Map, Set, WeakMap, WeakSet are converted to empty objects
   - TypedArrays are not handled correctly
   - Error objects lose their properties

4. **Prototype Chain:**
   - The prototype chain is not preserved
   - All objects in the result are plain objects

5. **Performance:**
   - Can be slow for large objects due to serialization/deserialization

### Hard

#### Implement deep copy that handles Date, Map, Set, RegExp.

```javascript
/**
 * Creates a deep copy of a value with support for various built-in types
 * @param {any} value - Value to copy
 * @param {WeakMap} [visited=new WeakMap()] - Map to track visited objects (for circular references)
 * @returns {any} - Deep copy of the value
 */
function advancedDeepCopy(value, visited = new WeakMap()) {
  // Handle primitives and null
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle circular references
  if (visited.has(value)) {
    return visited.get(value);
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }
  
  // Handle Map objects
  if (value instanceof Map) {
    const mapCopy = new Map();
    visited.set(value, mapCopy);
    
    value.forEach((val, key) => {
      mapCopy.set(
        advancedDeepCopy(key, visited),
        advancedDeepCopy(val, visited)
      );
    });
    
    return mapCopy;
  }
  
  // Handle Set objects
  if (value instanceof Set) {
    const setCopy = new Set();
    visited.set(value, setCopy);
    
    value.forEach(val => {
      setCopy.add(advancedDeepCopy(val, visited));
    });
    
    return setCopy;
  }
  
  // Handle Arrays
  if (Array.isArray(value)) {
    const arrayCopy = [];
    visited.set(value, arrayCopy);
    
    for (let i = 0; i < value.length; i++) {
      arrayCopy[i] = advancedDeepCopy(value[i], visited);
    }
    
    return arrayCopy;
  }
  
  // Handle plain Objects
  const objectCopy = Object.create(Object.getPrototypeOf(value));
  visited.set(value, objectCopy);
  
  // Copy all enumerable own properties
  const keys = Object.keys(value);
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      objectCopy[key] = advancedDeepCopy(value[key], visited);
    }
  }
  
  return objectCopy;
}

// Example usage
const original = {
  name: "John",
  birthDate: new Date('1990-01-01'),
  pattern: /test/gi,
  hobbies: new Set(["reading", "swimming"]),
  scores: new Map([["math", 95], ["science", 90]]),
  address: {
    city: "New York",
    zip: "10001"
  }
};

const copy = advancedDeepCopy(original);

// Modify copy
copy.name = "Jane";
copy.birthDate.setFullYear(2000);
copy.hobbies.add("running");
copy.scores.set("math", 100);
copy.address.city = "Boston";

console.log("Original:", original);
console.log("Copy:", copy);
```

**Edge Cases Handled:**
- Circular references (using WeakMap to track visited objects)
- Date objects
- RegExp objects
- Map objects (with deep copying of keys and values)
- Set objects
- Arrays
- Preserves prototype chain

#### Write a deep clone function that preserves circular references.

```javascript
/**
 * Creates a deep copy of a value while preserving circular references
 * @param {any} value - Value to copy
 * @returns {any} - Deep copy of the value
 */
function deepCloneWithCircularRefs(value) {
  // Use WeakMap to track visited objects and their copies
  const visited = new WeakMap();
  
  function clone(item) {
    // Handle primitives and null
    if (item === null || typeof item !== 'object') {
      return item;
    }
    
    // Handle circular references
    if (visited.has(item)) {
      return visited.get(item);
    }
    
    // Handle Date objects
    if (item instanceof Date) {
      const dateCopy = new Date(item.getTime());
      visited.set(item, dateCopy);
      return dateCopy;
    }
    
    // Handle RegExp objects
    if (item instanceof RegExp) {
      const regExpCopy = new RegExp(item.source, item.flags);
      visited.set(item, regExpCopy);
      return regExpCopy;
    }
    
    // Handle Map objects
    if (item instanceof Map) {
      const mapCopy = new Map();
      visited.set(item, mapCopy);
      
      item.forEach((val, key) => {
        // Handle circular references in keys and values
        mapCopy.set(clone(key), clone(val));
      });
      
      return mapCopy;
    }
    
    // Handle Set objects
    if (item instanceof Set) {
      const setCopy = new Set();
      visited.set(item, setCopy);
      
      item.forEach(val => {
        // Handle circular references in values
        setCopy.add(clone(val));
      });
      
      return setCopy;
    }
    
    // Handle Arrays
    if (Array.isArray(item)) {
      const arrayCopy = [];
      // Store the copy in the visited map BEFORE recursing
      visited.set(item, arrayCopy);
      
      for (let i = 0; i < item.length; i++) {
        arrayCopy[i] = clone(item[i]);
      }
      
      return arrayCopy;
    }
    
    // Handle plain Objects
    const objectCopy = Object.create(Object.getPrototypeOf(item));
    // Store the copy in the visited map BEFORE recursing
    visited.set(item, objectCopy);
    
    // Copy all enumerable own properties
    const keys = Object.keys(item);
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        objectCopy[key] = clone(item[key]);
      }
    }
    
    return objectCopy;
  }
  
  return clone(value);
}

// Example usage with circular references
const original = {
  name: "John",
  hobbies: ["reading", "swimming"]
};

// Create circular reference
original.self = original;
original.hobbies.push(original);

const copy = deepCloneWithCircularRefs(original);

console.log("Original name:", original.name);
console.log("Copy name:", copy.name);
console.log("Circular reference preserved:", copy.self === copy);
console.log("Array circular reference preserved:", copy.hobbies[2] === copy);
console.log("Original and copy are different objects:", original !== copy);
```

**How Circular Reference Preservation Works:**
1. Use a WeakMap to track objects we've already cloned
2. When we encounter an object, check if we've seen it before
3. If we have, return the previously created copy
4. Otherwise, create a new copy and store it in the WeakMap BEFORE recursively cloning its properties
5. This ensures that circular references point to the correct objects in the cloned structure

## 3️⃣ Descriptors / Freezing

### Easy

#### Make an object property read-only using Object.defineProperty.

```javascript
/**
 * Demonstrates how to make an object property read-only
 */
function demonstrateReadOnlyProperty() {
  const user = {
    name: "John",
    age: 30
  };
  
  // Make the name property read-only
  Object.defineProperty(user, 'name', {
    value: "John",
    writable: false,
    enumerable: true,
    configurable: true
  });
  
  console.log("Initial user:", user);
  
  // Try to modify the read-only property
  try {
    user.name = "Jane";
  } catch (error) {
    console.log("Error:", error.message);
  }
  
  // The name property remains unchanged
  console.log("User after attempted modification:", user);
  
  // Age property can still be modified
  user.age = 31;
  console.log("User after modifying age:", user);
  
  // We can still add new properties
  user.email = "john@example.com";
  console.log("User after adding email:", user);
}

demonstrateReadOnlyProperty();
```

**Property Descriptor Attributes:**
- `value`: The value associated with the property
- `writable`: Whether the property can be changed with an assignment
- `enumerable`: Whether the property appears during enumeration (e.g., in for...in loops)
- `configurable`: Whether the property can be deleted or have its attributes modified

**Note:** In strict mode, attempting to write to a read-only property will throw an error. In non-strict mode, the write operation is silently ignored.

#### How to check if an object is frozen? (Object.isFrozen)

```javascript
/**
 * Demonstrates how to check if an object is frozen
 */
function demonstrateObjectIsFrozen() {
  // Create a regular object
  const user = {
    name: "John",
    age: 30
  };
  
  // Check if it's frozen (initially)
  console.log("Is user frozen initially?", Object.isFrozen(user)); // false
  
  // Freeze the object
  Object.freeze(user);
  
  // Check if it's frozen now
  console.log("Is user frozen after Object.freeze?", Object.isFrozen(user)); // true
  
  // Try to modify the frozen object
  try {
    user.name = "Jane"; // Will be ignored in non-strict mode
    user.email = "john@example.com"; // Will be ignored in non-strict mode
    delete user.age; // Will be ignored in non-strict mode
  } catch (error) {
    console.log("Error:", error.message);
  }
  
  // The object remains unchanged
  console.log("User after attempted modifications:", user);
  
  // Create another object with non-writable properties
  const partiallyFrozen = {};
  Object.defineProperty(partiallyFrozen, 'name', {
    value: "John",
    writable: false,
    configurable: true,
    enumerable: true
  });
  
  // This is not considered frozen
  console.log("Is partiallyFrozen object frozen?", Object.isFrozen(partiallyFrozen)); // false
  
  // Empty objects can be frozen too
  const emptyObj = {};
  Object.freeze(emptyObj);
  console.log("Is empty object frozen?", Object.isFrozen(emptyObj)); // true
  
  // Primitives are considered frozen
  console.log("Is number frozen?", Object.isFrozen(42)); // true
  console.log("Is string frozen?", Object.isFrozen("hello")); // true
}

demonstrateObjectIsFrozen();
```

**What Object.isFrozen Checks:**
- An object is frozen if and only if:
  1. It is not extensible (no new properties can be added)
  2. All its properties are non-configurable (cannot be deleted or have their attributes changed)
  3. All its data properties are non-writable (values cannot be changed)
- Primitives are considered frozen by definition
- A frozen object is effectively immutable

### Medium

#### Freeze an object so no properties can be added or updated.

```javascript
/**
 * Demonstrates how to freeze an object and its limitations
 */
function demonstrateObjectFreeze() {
  const user = {
    name: "John",
    age: 30,
    address: {
      city: "New York",
      zip: "10001"
    }
  };
  
  // Freeze the object
  Object.freeze(user);
  
  console.log("Is user frozen?", Object.isFrozen(user)); // true
  
  // Attempt to modify the frozen object
  user.name = "Jane"; // Silently ignored (or throws in strict mode)
  user.email = "john@example.com"; // Can't add new properties
  delete user.age; // Can't delete properties
  
  // The object remains unchanged
  console.log("User after attempted modifications:", user);
  
  // However, nested objects are NOT frozen!
  user.address.city = "Boston"; // This works!
  
  console.log("User after modifying nested object:", user);
  console.log("Is nested address object frozen?", Object.isFrozen(user.address)); // false
  
  // To completely freeze an object with nested objects, you need to recursively freeze
  function deepFreeze(obj) {
    // Get all properties, including non-enumerable ones
    const props = Object.getOwnPropertyNames(obj);
    
    // Freeze properties before freezing the object
    props.forEach(prop => {
      const value = obj[prop];
      
      // Recursively freeze if it's an object and not null
      if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
        deepFreeze(value);
      }
    });
    
    // Freeze the object itself
    return Object.freeze(obj);
  }
  
  const user2 = {
    name: "Alice",
    age: 25,
    address: {
      city: "Chicago",
      zip: "60601"
    }
  };
  
  deepFreeze(user2);
  
  // Now nested objects are also frozen
  user2.address.city = "Boston"; // Silently ignored
  
  console.log("Deep frozen user after attempted modification:", user2);
  console.log("Is nested address object frozen?", Object.isFrozen(user2.address)); // true
}

demonstrateObjectFreeze();
```

**Object.freeze Effects:**
- Makes an object immutable at the top level:
  - Prevents adding new properties
  - Prevents removing existing properties
  - Prevents modifying property values
  - Prevents reconfiguring properties (changing their descriptors)
- Does NOT freeze nested objects (shallow freeze)
- Cannot be reversed - once frozen, an object cannot be unfrozen

#### Show difference between Object.freeze, Object.seal, and Object.preventExtensions.

```javascript
/**
 * Demonstrates the differences between Object.freeze, Object.seal, and Object.preventExtensions
 */
function demonstrateObjectImmutabilityMethods() {
  // Create three identical objects for comparison
  const frozen = { name: "John", age: 30 };
  const sealed = { name: "John", age: 30 };
  const preventExtended = { name: "John", age: 30 };
  
  // Apply the different methods
  Object.freeze(frozen);
  Object.seal(sealed);
  Object.preventExtensions(preventExtended);
  
  console.log("Initial state:");
  console.log("frozen:", frozen);
  console.log("sealed:", sealed);
  console.log("preventExtended:", preventExtended);
  
  // Test 1: Adding new properties
  frozen.email = "john@example.com";
  sealed.email = "john@example.com";
  preventExtended.email = "john@example.com";
  
  console.log("\nAfter attempting to add new properties:");
  console.log("frozen:", frozen); // No change
  console.log("sealed:", sealed); // No change
  console.log("preventExtended:", preventExtended); // No change
  
  // Test 2: Modifying existing properties
  frozen.name = "Jane";
  sealed.name = "Jane";
  preventExtended.name = "Jane";
  
  console.log("\nAfter attempting to modify existing properties:");
  console.log("frozen:", frozen); // No change
  console.log("sealed:", sealed); // Changed
  console.log("preventExtended:", preventExtended); // Changed
  
  // Test 3: Deleting properties
  delete frozen.age;
  delete sealed.age;
  delete preventExtended.age;
  
  console.log("\nAfter attempting to delete properties:");
  console.log("frozen:", frozen); // No change
  console.log("sealed:", sealed); // No change
  console.log("preventExtended:", preventExtended); // Changed
  
  // Summary
  console.log("\nSummary:");
  console.log("Object.freeze:", {
    isExtensible: Object.isExtensible(frozen),
    isSealed: Object.isSealed(frozen),
    isFrozen: Object.isFrozen(frozen)
  });
  
  console.log("Object.seal:", {
    isExtensible: Object.isExtensible(sealed),
    isSealed: Object.isSealed(sealed),
    isFrozen: Object.isFrozen(sealed)
  });
  
  console.log("Object.preventExtensions:", {
    isExtensible: Object.isExtensible(preventExtended),
    isSealed: Object.isSealed(preventExtended),
    isFrozen: Object.isFrozen(preventExtended)
  });
}

demonstrateObjectImmutabilityMethods();
```

**Comparison:**

| Method | Add Properties | Modify Properties | Delete Properties | Configure Properties |
|--------|---------------|------------------|------------------|---------------------|
| `Object.preventExtensions` | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| `Object.seal` | ❌ No | ✅ Yes | ❌ No | ❌ No |
| `Object.freeze` | ❌ No | ❌ No | ❌ No | ❌ No |

**Key Points:**
- `Object.preventExtensions`: Prevents adding new properties, but allows modifying or deleting existing ones
- `Object.seal`: Prevents adding new properties and deleting existing ones, but allows modifying values
- `Object.freeze`: Most restrictive - prevents adding, deleting, and modifying properties (shallow immutability)
- All three methods are shallow - they only affect the top-level object, not nested objects

### Hard

#### Create a custom function deepFreeze(obj) that freezes an object and all its nested properties.

```javascript
/**
 * Deeply freezes an object and all its nested properties
 * @param {Object} obj - Object to freeze
 * @returns {Object} - The frozen object
 */
function deepFreeze(obj) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
    return obj;
  }
  
  // Get all properties, including non-enumerable ones
  const props = Object.getOwnPropertyNames(obj);
  
  // Freeze properties before freezing the object itself
  for (const prop of props) {
    const value = obj[prop];
    
    // Skip non-configurable properties that can't be re-defined
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor && !descriptor.configurable) {
      continue;
    }
    
    // Handle property values that are objects
    if (value !== null && typeof value === 'object') {
      obj[prop] = deepFreeze(value);
    }
  }
  
  // Freeze the object itself
  return Object.freeze(obj);
}

// Example usage
const user = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    zip: "10001",
    geo: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  hobbies: ["reading", "swimming", { type: "sport", name: "running" }]
};

deepFreeze(user);

// Try to modify at different levels
try {
  user.name = "Jane"; // Top level - blocked
  user.address.city = "Boston"; // Nested object - blocked
  user.address.geo.lat = 42.3601; // Deeply nested object - blocked
  user.hobbies[0] = "coding"; // Array element - blocked
  user.hobbies[2].name = "cycling"; // Object in array - blocked
  user.newProp = "test"; // New property - blocked
} catch (error) {
  console.log("Error:", error.message);
}

console.log("User after attempted modifications:", user);

// Check if everything is frozen
console.log("Is user frozen?", Object.isFrozen(user));
console.log("Is address frozen?", Object.isFrozen(user.address));
console.log("Is geo frozen?", Object.isFrozen(user.address.geo));
console.log("Is hobbies array frozen?", Object.isFrozen(user.hobbies));
console.log("Is hobby object frozen?", Object.isFrozen(user.hobbies[2]));
```

**Edge Cases Handled:**
- Null and non-object values
- Already frozen objects (to prevent infinite recursion)
- Non-configurable properties
- Arrays and their contents
- Deeply nested object structures
- Objects within arrays

#### Implement immutability in an object while allowing new copies (like Redux).

```javascript
/**
 * Creates an immutable store with Redux-like state management
 * @param {Object} initialState - Initial state object
 * @returns {Object} - Store with getState and dispatch methods
 */
function createImmutableStore(initialState = {}) {
  // Deep freeze the initial state
  let currentState = deepFreeze(JSON.parse(JSON.stringify(initialState)));
  
  // List of subscribers
  const listeners = [];
  
  /**
   * Creates a new state by applying an update function
   * @param {Function} updateFn - Function that takes current state and returns new state
   * @returns {Object} - New state
   */
  function produceNewState(updateFn) {
    // Create a deep clone of the current state
    const draft = JSON.parse(JSON.stringify(currentState));
    
    // Apply the update function to get the new state
    const newState = updateFn(draft);
    
    // Use the result of the update function if it returns a value,
    // otherwise use the modified draft
    return deepFreeze(newState !== undefined ? newState : draft);
  }
  
  /**
   * Gets the current state
   * @returns {Object} - Current state
   */
  function getState() {
    return currentState;
  }
  
  /**
   * Dispatches an action to update the state
   * @param {Object} action - Action object with type and payload
   * @returns {Object} - The action
   */
  function dispatch(action) {
    if (!action || typeof action !== 'object' || !action.type) {
      throw new Error('Actions must be plain objects with a type property');
    }
    
    // Apply the reducer to get the new state
    const newState = reducer(currentState, action);
    
    // Update the current state
    currentState = newState;
    
    // Notify all listeners
    listeners.forEach(listener => listener());
    
    return action;
  }
  
  /**
   * Subscribes to state changes
   * @param {Function} listener - Function to call on state changes
   * @returns {Function} - Unsubscribe function
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    
    listeners.push(listener);
    
    // Return unsubscribe function
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Reducer function that handles actions
   * @param {Object} state - Current state
   * @param {Object} action - Action object
   * @returns {Object} - New state
   */
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE_USER':
        return produceNewState(draft => {
          draft.user = { ...draft.user, ...action.payload };
          return draft;
        });
        
      case 'ADD_ITEM':
        return produceNewState(draft => {
          draft.items = [...(draft.items || []), action.payload];
          return draft;
        });
        
      case 'REMOVE_ITEM':
        return produceNewState(draft => {
          draft.items = (draft.items || []).filter(item => 
            item.id !== action.payload.id
          );
          return draft;
        });
        
      case 'UPDATE_NESTED':
        return produceNewState(draft => {
          // Handle nested updates using path
          const { path, value } = action.payload;
          const pathArray = path.split('.');
          let current = draft;
          
          // Navigate to the parent of the property to update
          for (let i = 0; i < pathArray.length - 1; i++) {
            const key = pathArray[i];
            if (current[key] === undefined) {
              current[key] = {};
            }
            current = current[key];
          }
          
          // Update the property
          current[pathArray[pathArray.length - 1]] = value;
          
          return draft;
        });
        
      default:
        return state;
    }
  }
  
  // Return the store API
  return {
    getState,
    dispatch,
    subscribe
  };
}

// Example usage
const store = createImmutableStore({
  user: {
    name: "John",
    age: 30
  },
  items: [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" }
  ]
});

// Subscribe to changes
const unsubscribe = store.subscribe(() => {
  console.log("State changed:", store.getState());
});

// Dispatch actions to update state
store.dispatch({
  type: 'UPDATE_USER',
  payload: { age: 31, email: "john@example.com" }
});

store.dispatch({
  type: 'ADD_ITEM',
  payload: { id: 3, name: "Item 3" }
});

store.dispatch({
  type: 'REMOVE_ITEM',
  payload: { id: 1 }
});

store.dispatch({
  type: 'UPDATE_NESTED',
  payload: {
    path: 'user.address.city',
    value: "New York"
  }
});

// Unsubscribe
unsubscribe();

// Final state
console.log("Final state:", store.getState());

// Try to modify the state directly (will fail because it's frozen)
try {
  store.getState().user.name = "Jane";
} catch (error) {
  console.log("Error when trying to modify state directly:", error.message);
}
```

**Key Concepts:**
1. **Immutability**: Each state update creates a new object rather than modifying the existing one
2. **Deep Freezing**: Prevents accidental mutations of the state
3. **State Tree**: Maintains a single source of truth for the application state
4. **Actions**: Plain objects describing what happened
5. **Reducers**: Pure functions that specify how the state changes in response to actions
6. **Subscribers**: Functions that are notified when the state changes

## 4️⃣ Prototypes / Inheritance

### Easy

#### Explain __proto__ vs prototype.

```javascript
/**
 * Demonstrates the difference between __proto__ and prototype
 */
function demonstrateProtoVsPrototype() {
  // Constructor function
  function Person(name) {
    this.name = name;
  }
  
  // Adding a method to the prototype
  Person.prototype.sayHello = function() {
    return `Hello, my name is ${this.name}`;
  };
  
  // Create an instance
  const john = new Person("John");
  
  console.log("Person.prototype:", Person.prototype);
  console.log("john.__proto__:", john.__proto__);
  console.log("john.__proto__ === Person.prototype:", john.__proto__ === Person.prototype);
  
  // Function's prototype vs function's __proto__
  console.log("Person.prototype:", Person.prototype); // The prototype object for instances
  console.log("Person.__proto__:", Person.__proto__); // Function's own prototype (Function.prototype)
  
  // Object literals
  const obj = { x: 10 };
  console.log("obj.__proto__ === Object.prototype:", obj.__proto__ === Object.prototype);
  
  // Object.create
  const child = Object.create(obj);
  console.log("child.__proto__ === obj:", child.__proto__ === obj);
  
  // null prototype
  const noProto = Object.create(null);
  console.log("noProto.__proto__:", noProto.__proto__); // undefined
}

demonstrateProtoVsPrototype();
```

**Explanation:**

1. **prototype**:
   - A property of constructor functions
   - Contains properties and methods that will be inherited by instances
   - Used to implement prototype-based inheritance
   - Only functions have this property by default

2. **__proto__**:
   - A property of all objects
   - Points to the prototype of the constructor that created the object
   - Used to look up properties in the prototype chain
   - When you access a property on an object, JavaScript first looks for it on the object itself, then on object.__proto__, then on object.__proto__.__proto__, and so on

3. **Relationship**:
   - For an instance created with `new Constructor()`, the instance's `__proto__` points to `Constructor.prototype`
   - `instance.__proto__ === Constructor.prototype`

#### Show how to create an object that inherits from another object.

```javascript
/**
 * Demonstrates different ways to create objects that inherit from other objects
 */
function demonstrateObjectInheritance() {
  // 1. Using Object.create()
  const parent = {
    greet() {
      return `Hello, my name is ${this.name}`;
    }
  };
  
  const child1 = Object.create(parent);
  child1.name = "John";
  
  console.log("child1.greet():", child1.greet());
  console.log("child1.__proto__ === parent:", child1.__proto__ === parent);
  
  // 2. Using constructor functions
  function Animal(name) {
    this.name = name;
  }
  
  Animal.prototype.makeSound = function() {
    return "Some generic sound";
  };
  
  function Dog(name, breed) {
    // Call the parent constructor
    Animal.call(this, name);
    this.breed = breed;
  }
  
  // Set up inheritance
  Dog.prototype = Object.create(Animal.prototype);
  // Fix the constructor property
  Dog.prototype.constructor = Dog;
  
  // Override the makeSound method
  Dog.prototype.makeSound = function() {
    return "Woof!";
  };
  
  const dog = new Dog("Rex", "German Shepherd");
  console.log("dog.name:", dog.name);
  console.log("dog.breed:", dog.breed);
  console.log("dog.makeSound():", dog.makeSound());
  console.log("dog instanceof Dog:", dog instanceof Dog);
  console.log("dog instanceof Animal:", dog instanceof Animal);
  
  // 3. Using ES6 classes (syntactic sugar over prototypes)
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    
    introduce() {
      return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
    }
  }
  
  class Employee extends Person {
    constructor(name, age, role) {
      super(name, age);
      this.role = role;
    }
    
    introduce() {
      return `${super.introduce()}. I work as a ${this.role}`;
    }
  }
  
  const employee = new Employee("Jane", 30, "Developer");
  console.log("employee.introduce():", employee.introduce());
  console.log("employee instanceof Employee:", employee instanceof Employee);
  console.log("employee instanceof Person:", employee instanceof Person);
}

demonstrateObjectInheritance();
```

**Different Ways to Create Inheriting Objects:**

1. **Object.create()**:
   - Creates a new object with the specified prototype object
   - Simplest way to establish inheritance between objects
   - No constructor function needed

2. **Constructor Functions**:
   - Traditional way before ES6 classes
   - Use `ParentConstructor.call(this, ...)` to inherit properties
   - Use `ChildConstructor.prototype = Object.create(ParentConstructor.prototype)` to inherit methods
   - Remember to fix the constructor property

3. **ES6 Classes**:
   - Modern syntax that makes inheritance clearer
   - Uses `extends` keyword for inheritance
   - Uses `super()` to call parent constructor
   - Still uses prototypes under the hood

### Medium

#### Implement prototypal inheritance with a constructor function.

```javascript
/**
 * Implements prototypal inheritance with constructor functions
 */
function implementPrototypalInheritance() {
  // Parent constructor
  function Vehicle(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.isRunning = false;
  }
  
  // Add methods to the parent prototype
  Vehicle.prototype.start = function() {
    this.isRunning = true;
    return `${this.make} ${this.model} started`;
  };
  
  Vehicle.prototype.stop = function() {
    this.isRunning = false;
    return `${this.make} ${this.model} stopped`;
  };
  
  Vehicle.prototype.toString = function() {
    return `${this.year} ${this.make} ${this.model}`;
  };
  
  // Child constructor
  function Car(make, model, year, numDoors) {
    // Call the parent constructor with the current context
    Vehicle.call(this, make, model, year);
    
    // Add car-specific properties
    this.numDoors = numDoors;
    this.type = 'car';
  }
  
  // Set up inheritance
  // This creates a new object with Vehicle.prototype as its prototype
  // and assigns it to Car.prototype
  Car.prototype = Object.create(Vehicle.prototype);
  
  // Fix the constructor property, which would otherwise point to Vehicle
  Car.prototype.constructor = Car;
  
  // Add or override methods on the child prototype
  Car.prototype.honk = function() {
    return 'Beep beep!';
  };
  
  // Override the toString method
  Car.prototype.toString = function() {
    return `${Vehicle.prototype.toString.call(this)}, ${this.numDoors}-door`;
  };
  
  // Create instances
  const vehicle = new Vehicle('Generic', 'Vehicle', 2020);
  const car = new Car('Toyota', 'Camry', 2022, 4);
  
  // Test inheritance
  console.log("vehicle.start():", vehicle.start());
  console.log("car.start():", car.start()); // Inherited method
  console.log("car.honk():", car.honk()); // Car-specific method
  
  console.log("vehicle.toString():", vehicle.toString());
  console.log("car.toString():", car.toString()); // Overridden method
  
  console.log("car instanceof Car:", car instanceof Car); // true
  console.log("car instanceof Vehicle:", car instanceof Vehicle); // true
  
  // Demonstrate prototype chain
  console.log("car.__proto__ === Car.prototype:", car.__proto__ === Car.prototype);
  console.log("Car.prototype.__proto__ === Vehicle.prototype:", Car.prototype.__proto__ === Vehicle.prototype);
}

implementPrototypalInheritance();
```

**Key Steps in Prototypal Inheritance with Constructor Functions:**

1. **Create Parent Constructor**:
   - Define properties using `this` keyword

2. **Add Methods to Parent Prototype**:
   - Add shared methods to `ParentConstructor.prototype`

3. **Create Child Constructor**:
   - Call parent constructor with `ParentConstructor.call(this, ...)` to inherit properties
   - Add child-specific properties

4. **Set Up Inheritance Chain**:
   - Set `ChildConstructor.prototype = Object.create(ParentConstructor.prototype)`
   - This creates a new object with the parent's prototype as its prototype

5. **Fix Constructor Property**:
   - Set `ChildConstructor.prototype.constructor = ChildConstructor`
   - This ensures `instance.constructor` points to the correct constructor

6. **Add/Override Methods**:
   - Add child-specific methods to `ChildConstructor.prototype`
   - Override parent methods as needed

#### Add a method to Object.prototype and show why it's dangerous.

```javascript
/**
 * Demonstrates adding a method to Object.prototype and its dangers
 */
function demonstrateObjectPrototypeModification() {
  // Add a method to Object.prototype
  Object.prototype.describe = function() {
    const props = [];
    for (const key in this) {
      // Only include own properties, not inherited ones
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        props.push(`${key}: ${this[key]}`);
      }
    }
    return `Object with properties: ${props.join(', ')}`;
  };
  
  // Create a regular object
  const user = {
    name: "John",
    age: 30
  };
  
  // Our new method is available on all objects
  console.log("user.describe():", user.describe());
  
  // But it also appears in for...in loops!
  console.log("\nProperties in user (for...in):");
  for (const key in user) {
    console.log(key); // Includes 'describe'!
  }
  
  // It can break code that assumes only own properties
  console.log("\nProperties in user (for...in without hasOwnProperty check):");
  for (const key in user) {
    console.log(`${key}: ${user[key]}`); // Will include 'describe'
  }
  
  // It can interfere with JSON serialization
  console.log("\nJSON.stringify(user):", JSON.stringify(user));
  // This works because JSON.stringify only includes own properties
  
  // It can break libraries or frameworks that use for...in
  console.log("\nObject.keys(user):", Object.keys(user));
  // This works because Object.keys only returns own properties
  
  // It can cause unexpected behavior in third-party code
  const library = {
    processObject(obj) {
      let result = '';
      for (const key in obj) {
        // If the library doesn't use hasOwnProperty check
        result += `Processed ${key}\n`;
      }
      return result;
    }
  };
  
  console.log("\nLibrary processing:", library.processObject(user));
  
  // Clean up - remove the added method
  delete Object.prototype.describe;
  
  console.log("\nAfter cleanup, user.describe:", user.describe);
}

demonstrateObjectPrototypeModification();
```

**Why Modifying Object.prototype is Dangerous:**

1. **Breaks for...in Loops**:
   - Added properties appear in for...in loops
   - Code that doesn't use `hasOwnProperty` check will process these properties

2. **Naming Collisions**:
   - Your method might conflict with future JavaScript features
   - It might conflict with methods added by libraries or frameworks

3. **Performance Impact**:
   - Every object inherits from Object.prototype
   - Adding properties can affect performance across the entire application

4. **Unexpected Behavior**:
   - Third-party code might not expect additional properties
   - Can lead to hard-to-debug issues

5. **Maintainability Issues**:
   - Makes code harder to understand and maintain
   - Other developers might not expect global modifications

**Safer Alternatives:**
- Create utility functions instead of adding to Object.prototype
- Use classes or factory functions with their own prototypes
- Use Symbol properties if you need to add non-enumerable properties

### Hard

#### Implement a simple polyfill of Object.create.

```javascript
/**
 * Polyfill for Object.create
 * @param {Object|null} proto - The prototype object to use
 * @param {Object} [propertiesObject] - Optional object with property descriptors
 * @returns {Object} - A new object with the specified prototype
 */
function objectCreate(proto, propertiesObject) {
  // Handle edge cases
  if (typeof proto !== 'object' && proto !== null) {
    throw new TypeError('Object prototype may only be an Object or null');
  }
  
  // Create a temporary constructor function
  function F() {}
  
  // Set its prototype to the provided proto
  F.prototype = proto;
  
  // Create a new instance
  const obj = new F();
  
  // If properties object is provided, define properties
  if (propertiesObject !== undefined) {
    // Ensure propertiesObject is an object
    if (typeof propertiesObject !== 'object') {
      throw new TypeError('Properties must be an object');
    }
    
    // Use Object.defineProperties to add properties
    Object.defineProperties(obj, propertiesObject);
  }
  
  // Return the new object
  return obj;
}

// Example usage
function demonstrateObjectCreatePolyfill() {
  // Test case 1: Create object with a prototype
  const parent = {
    greet() {
      return `Hello, my name is ${this.name}`;
    }
  };
  
  const child1 = objectCreate(parent);
  child1.name = "John";
  
  console.log("child1.greet():", child1.greet());
  console.log("child1.__proto__ === parent:", Object.getPrototypeOf(child1) === parent);
  
  // Test case 2: Create object with null prototype
  const noProto = objectCreate(null);
  console.log("Object.getPrototypeOf(noProto):", Object.getPrototypeOf(noProto));
  
  // Test case 3: Create object with properties
  const child2 = objectCreate(parent, {
    name: {
      value: "Jane",
      writable: true,
      enumerable: true,
      configurable: true
    },
    age: {
      value: 30,
      writable: false, // Read-only property
      enumerable: true,
      configurable: true
    }
  });
  
  console.log("child2.name:", child2.name);
  console.log("child2.age:", child2.age);
  console.log("child2.greet():", child2.greet());
  
  // Test read-only property
  child2.age = 40;
  console.log("child2.age after attempted change:", child2.age); // Still 30
  
  // Test error cases
  try {
    objectCreate("not an object");
  } catch (error) {
    console.log("Error with invalid prototype:", error.message);
  }
  
  try {
    objectCreate({}, "not an object");
  } catch (error) {
    console.log("Error with invalid properties:", error.message);
  }
}

demonstrateObjectCreatePolyfill();
```

**How Object.create Works:**
1. It creates a new object with the specified prototype object
2. It optionally defines properties on the new object
3. It handles special cases like null prototypes
4. It throws errors for invalid inputs

**Edge Cases Handled:**
- Non-object prototypes (throws TypeError)
- Null prototype (creates object with no prototype)
- Property descriptors with various configurations
- Non-object property descriptors (throws TypeError)

#### Simulate classical inheritance in ES5 (before class).

```javascript
/**
 * Demonstrates classical inheritance pattern in ES5
 */
function demonstrateClassicalInheritance() {
  // Base "class" constructor
  function Person(name, age) {
    // Constructor logic
    this.name = name;
    this.age = age;
  }
  
  // Add methods to the base prototype
  Person.prototype.introduce = function() {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
  };
  
  Person.prototype.birthday = function() {
    this.age++;
    return `Happy birthday! Now I'm ${this.age}`;
  };
  
  // Static method (on the constructor, not instances)
  Person.create = function(name, age) {
    return new Person(name, age);
  };
  
  // "Subclass" constructor
  function Employee(name, age, position, salary) {
    // Call the parent constructor (super)
    Person.call(this, name, age);
    
    // Subclass-specific properties
    this.position = position;
    this.salary = salary;
  }
  
  // Inherit from Person
  Employee.prototype = Object.create(Person.prototype);
  Employee.prototype.constructor = Employee;
  
  // Override a method
  Employee.prototype.introduce = function() {
    // Call the parent method (super.introduce())
    const personIntro = Person.prototype.introduce.call(this);
    return `${personIntro}. I work as a ${this.position}`;
  };
  
  // Add subclass-specific methods
  Employee.prototype.promote = function(newPosition, salaryIncrease) {
    this.position = newPosition;
    this.salary += salaryIncrease;
    return `Promoted to ${this.position} with salary increase of $${salaryIncrease}`;
  };
  
  // Inherit static methods
  Employee.create = function(name, age, position, salary) {
    return new Employee(name, age, position, salary);
  };
  
  // Create a "subclass" of Employee
  function Manager(name, age, department, directReports) {
    // Call the parent constructor
    Employee.call(this, name, age, 'Manager', 100000);
    
    // Subclass-specific properties
    this.department = department;
    this.directReports = directReports || [];
  }
  
  // Inherit from Employee
  Manager.prototype = Object.create(Employee.prototype);
  Manager.prototype.constructor = Manager;
  
  // Add Manager-specific methods
  Manager.prototype.addReport = function(employee) {
    this.directReports.push(employee);
    return `${employee.name} now reports to ${this.name}`;
  };
  
  // Override Employee's method
  Manager.prototype.introduce = function() {
    // Call the parent method
    const employeeIntro = Employee.prototype.introduce.call(this);
    return `${employeeIntro}. I manage the ${this.department} department with ${this.directReports.length} direct reports`;
  };
  
  // Create instances
  const person = new Person('John', 30);
  const employee = new Employee('Jane', 28, 'Developer', 80000);
  const manager = new Manager('Bob', 45, 'Engineering', [employee]);
  
  // Test inheritance
  console.log("person.introduce():", person.introduce());
  console.log("employee.introduce():", employee.introduce());
  console.log("manager.introduce():", manager.introduce());
  
  console.log("employee.birthday():", employee.birthday()); // Inherited from Person
  console.log("manager.promote('Senior Manager', 20000):", manager.promote('Senior Manager', 20000)); // Inherited from Employee
  
  // Test instanceof
  console.log("person instanceof Person:", person instanceof Person); // true
  console.log("employee instanceof Employee:", employee instanceof Employee); // true
  console.log("employee instanceof Person:", employee instanceof Person); // true
  console.log("manager instanceof Manager:", manager instanceof Manager); // true
  console.log("manager instanceof Employee:", manager instanceof Employee); // true
  console.log("manager instanceof Person:", manager instanceof Person); // true
  
  // Create using static methods
  const person2 = Person.create('Alice', 25);
  const employee2 = Employee.create('Bob', 32, 'Designer', 75000);
  
  console.log("person2.introduce():", person2.introduce());
  console.log("employee2.introduce():", employee2.introduce());
}

demonstrateClassicalInheritance();
```

**Classical Inheritance Pattern in ES5:**

1. **Constructor Functions**:
   - Define properties using `this`
   - Act as class constructors

2. **Prototype Methods**:
   - Add methods to the prototype for sharing across instances
   - Equivalent to instance methods in class-based languages

3. **Static Methods**:
   - Add methods directly to the constructor function
   - Not available on instances

4. **Inheritance**:
   - Call parent constructor with `ParentClass.call(this, ...)` to inherit properties
   - Set `ChildClass.prototype = Object.create(ParentClass.prototype)` to inherit methods
   - Fix constructor reference with `ChildClass.prototype.constructor = ChildClass`

5. **Method Overriding**:
   - Define methods with the same name on the child prototype
   - Call parent methods with `ParentClass.prototype.method.call(this, ...)`

6. **Multi-level Inheritance**:
   - Create chains of inheritance (e.g., Manager extends Employee extends Person)

This pattern was commonly used before ES6 classes were introduced, and it's still the underlying mechanism that ES6 classes use behind the scenes.

## 5️⃣ Basic Manipulations (find, update, delete, iterate, transform)

### Easy

#### Write a function to check if an object has a key.

```javascript
/**
 * Checks if an object has a specific key
 * @param {Object} obj - The object to check
 * @param {string} key - The key to look for
 * @returns {boolean} - True if the key exists, false otherwise
 */
function hasKey(obj, key) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  // Method 1: Using in operator (checks own and inherited properties)
  const hasKeyWithIn = key in obj;
  
  // Method 2: Using hasOwnProperty (checks only own properties)
  const hasOwnKey = Object.prototype.hasOwnProperty.call(obj, key);
  
  // Method 3: Using Object.keys (checks only own enumerable properties)
  const hasKeyInKeys = Object.keys(obj).includes(key);
  
  // Method 4: Direct property access and check for undefined
  // Note: This can give false negatives if the property exists but is undefined
  const directAccess = obj[key] !== undefined;
  
  console.log(`Checking for key "${key}":`);
  console.log(`- Using 'in' operator: ${hasKeyWithIn}`);
  console.log(`- Using hasOwnProperty: ${hasOwnKey}`);
  console.log(`- Using Object.keys: ${hasKeyInKeys}`);
  console.log(`- Using direct access: ${directAccess}`);
  
  // Return result using hasOwnProperty (most commonly used)
  return hasOwnKey;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  address: null,
  settings: undefined
};

// Create an object with inherited properties
const protoObj = { inherited: true };
const childObj = Object.create(protoObj);
childObj.own = "value";

console.log("hasKey(user, 'name'):", hasKey(user, 'name')); // true
console.log("hasKey(user, 'email'):", hasKey(user, 'email')); // false
console.log("hasKey(user, 'address'):", hasKey(user, 'address')); // true (null is a valid value)
console.log("hasKey(user, 'settings'):", hasKey(user, 'settings')); // true (undefined is a valid value)
console.log("hasKey(childObj, 'own'):", hasKey(childObj, 'own')); // true (own property)
console.log("hasKey(childObj, 'inherited'):", hasKey(childObj, 'inherited')); // false (inherited property)
console.log("hasKey(null, 'anything'):", hasKey(null, 'anything')); // false (null object)
```

**Different Ways to Check for a Key:**

1. **`key in obj`**:
   - Checks both own and inherited properties
   - Returns true if the key exists anywhere in the prototype chain

2. **`obj.hasOwnProperty(key)`**:
   - Checks only own properties (not inherited)
   - Safer to use `Object.prototype.hasOwnProperty.call(obj, key)` to handle objects with no prototype

3. **`Object.keys(obj).includes(key)`**:
   - Checks only own enumerable properties
   - Returns false for non-enumerable properties

4. **`obj[key] !== undefined`**:
   - Simple but can give false negatives if the property exists but is undefined
   - Can give false positives for inherited properties

**Best Practice:**
- Use `Object.prototype.hasOwnProperty.call(obj, key)` for most cases
- Use `key in obj` if you need to check inherited properties too

#### Update a property immutably.

```javascript
/**
 * Updates an object property immutably
 * @param {Object} obj - The original object
 * @param {string} key - The key to update
 * @param {any} value - The new value
 * @returns {Object} - A new object with the updated property
 */
function updatePropertyImmutably(obj, key, value) {
  // Method 1: Using spread operator
  const updatedWithSpread = {
    ...obj,
    [key]: value
  };
  
  // Method 2: Using Object.assign
  const updatedWithAssign = Object.assign({}, obj, { [key]: value });
  
  // Method 3: Manual copy
  const updatedManually = {};
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      updatedManually[k] = k === key ? value : obj[k];
    }
  }
  
  console.log("Original:", obj);
  console.log("Updated with spread:", updatedWithSpread);
  console.log("Updated with Object.assign:", updatedWithAssign);
  console.log("Updated manually:", updatedManually);
  
  // Return the result using spread operator (most concise)
  return updatedWithSpread;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    zip: "10001"
  }
};

const updatedUser = updatePropertyImmutably(user, 'age', 31);

// Verify the original wasn't modified
console.log("Original user after update:", user);
console.log("Original user === updatedUser:", user === updatedUser); // false

// Update nested property immutably
function updateNestedPropertyImmutably(obj, path, value) {
  // Handle edge cases
  if (!path) return obj;
  
  // Convert string path to array (e.g., 'address.city' -> ['address', 'city'])
  const pathArray = typeof path === 'string' ? path.split('.') : path;
  
  // If we've reached the end of the path, return a new object with the updated value
  if (pathArray.length === 1) {
    return {
      ...obj,
      [pathArray[0]]: value
    };
  }
  
  // Otherwise, recursively update the nested object
  const key = pathArray[0];
  const remainingPath = pathArray.slice(1);
  
  return {
    ...obj,
    [key]: updateNestedPropertyImmutably(
      obj[key] || {}, // Use empty object if the key doesn't exist
      remainingPath,
      value
    )
  };
}

// Example with nested property
const updatedAddress = updateNestedPropertyImmutably(user, 'address.city', 'Boston');
console.log("Updated nested property:", updatedAddress);
console.log("Original user after nested update:", user);
```

**Immutable Update Patterns:**

1. **Spread Operator**:
   - `{ ...obj, [key]: value }`
   - Most concise and readable
   - Creates a shallow copy

2. **Object.assign**:
   - `Object.assign({}, obj, { [key]: value })`
   - Works in older browsers
   - Also creates a shallow copy

3. **Manual Copy**:
   - Loop through properties and create a new object
   - More verbose but gives more control

4. **Nested Updates**:
   - Requires recursion or a path-based approach
   - Each level of nesting needs its own immutable update

**Important Note:**
- These methods create shallow copies
- Nested objects are still shared between original and copy
- For deep immutability, you need to recursively create new objects

#### Delete a property immutably (without delete).

```javascript
/**
 * Removes a property from an object immutably
 * @param {Object} obj - The original object
 * @param {string} key - The key to remove
 * @returns {Object} - A new object without the specified property
 */
function removePropertyImmutably(obj, key) {
  // Method 1: Using spread operator and rest parameters
  const { [key]: removed, ...rest } = obj;
  
  // Method 2: Using Object.assign with all keys except the one to remove
  const withoutKeyAssign = Object.keys(obj)
    .filter(k => k !== key)
    .reduce((newObj, k) => {
      newObj[k] = obj[k];
      return newObj;
    }, {});
  
  // Method 3: Manual copy excluding the key
  const withoutKeyManual = {};
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && k !== key) {
      withoutKeyManual[k] = obj[k];
    }
  }
  
  console.log("Original:", obj);
  console.log("Without key using spread/rest:", rest);
  console.log("Without key using Object.assign:", withoutKeyAssign);
  console.log("Without key manually:", withoutKeyManual);
  
  // Return the result using spread/rest (most concise)
  return rest;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    city: "New York",
    zip: "10001"
  }
};

const userWithoutEmail = removePropertyImmutably(user, 'email');

// Verify the original wasn't modified
console.log("Original user after removal:", user);
console.log("Original user === userWithoutEmail:", user === userWithoutEmail); // false

// Remove nested property immutably
function removeNestedPropertyImmutably(obj, path) {
  // Handle edge cases
  if (!path) return obj;
  
  // Convert string path to array (e.g., 'address.city' -> ['address', 'city'])
  const pathArray = typeof path === 'string' ? path.split('.') : path;
  
  // If we've reached the parent of the property to remove
  if (pathArray.length === 1) {
    const { [pathArray[0]]: removed, ...rest } = obj;
    return rest;
  }
  
  // Otherwise, recursively update the nested object
  const key = pathArray[0];
  const remainingPath = pathArray.slice(1);
  
  // If the key doesn't exist, return the object as is
  if (!(key in obj)) return obj;
  
  return {
    ...obj,
    [key]: removeNestedPropertyImmutably(obj[key], remainingPath)
  };
}

// Example with nested property
const userWithoutZip = removeNestedPropertyImmutably(user, 'address.zip');
console.log("Without nested property:", userWithoutZip);
console.log("Original user after nested removal:", user);
```

**Immutable Property Removal Patterns:**

1. **Spread/Rest Operator**:
   - `const { [key]: removed, ...rest } = obj;`
   - Most concise and readable
   - Creates a new object without the specified property

2. **Object.keys + reduce**:
   - Filter out the key and build a new object
   - Works in environments that support Object.keys and Array methods

3. **Manual Copy**:
   - Loop through properties and create a new object, skipping the key to remove
   - More verbose but works everywhere

4. **Nested Removal**:
   - Requires recursion or a path-based approach
   - Each level of nesting needs its own immutable update

**Benefits of Immutable Removal:**
- Preserves the original object
- Enables easy undo/redo functionality
- Works well with state management libraries like Redux
- Helps with change detection in frameworks like React

### Medium

#### Write a function to get a nested property by string path "a.b.c".

```javascript
/**
 * Gets a nested property from an object using a string path
 * @param {Object} obj - The object to get the property from
 * @param {string} path - The path to the property (e.g., 'a.b.c')
 * @param {any} [defaultValue] - The default value to return if the property doesn't exist
 * @returns {any} - The value at the specified path or the default value
 */
function getNestedProperty(obj, path, defaultValue = undefined) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object' || !path) {
    return defaultValue;
  }
  
  // Method 1: Using reduce
  const valueWithReduce = path.split('.')
    .reduce((current, key) => {
      return current !== undefined && current !== null ? current[key] : undefined;
    }, obj);
  
  // Method 2: Using a for loop
  let valueWithLoop = obj;
  const keys = path.split('.');
  
  for (const key of keys) {
    if (valueWithLoop === null || valueWithLoop === undefined) {
      valueWithLoop = defaultValue;
      break;
    }
    valueWithLoop = valueWithLoop[key];
  }
  
  // Method 3: Using recursion
  function getRecursively(object, pathArray) {
    if (pathArray.length === 0) return object;
    if (object === null || object === undefined) return defaultValue;
    
    const [first, ...rest] = pathArray;
    return getRecursively(object[first], rest);
  }
  
  const valueWithRecursion = getRecursively(obj, path.split('.'));
  
  console.log(`Getting property at path "${path}":`);
  console.log(`- Using reduce: ${valueWithReduce}`);
  console.log(`- Using loop: ${valueWithLoop}`);
  console.log(`- Using recursion: ${valueWithRecursion}`);
  
  // Return the result (using reduce method)
  return valueWithReduce !== undefined ? valueWithReduce : defaultValue;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  address: {
    home: {
      city: "New York",
      zip: "10001",
      geo: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    work: null
  },
  hobbies: ["reading", "swimming"]
};

console.log("user.address.home.city:", getNestedProperty(user, 'address.home.city')); // "New York"
console.log("user.address.home.geo.lat:", getNestedProperty(user, 'address.home.geo.lat')); // 40.7128
console.log("user.address.work.city:", getNestedProperty(user, 'address.work.city', 'N/A')); // "N/A" (default value)
console.log("user.hobbies.0:", getNestedProperty(user, 'hobbies.0')); // "reading"
console.log("user.nonexistent.path:", getNestedProperty(user, 'nonexistent.path', 'Not found')); // "Not found"
console.log("null object:", getNestedProperty(null, 'any.path', 'Invalid object')); // "Invalid object"
```

**Different Approaches to Get Nested Properties:**

1. **Using reduce**:
   - Elegant and functional approach
   - Handles the path traversal in a single operation
   - Good performance for most cases

2. **Using a for loop**:
   - More imperative but easier to understand
   - Can be more efficient for very deep paths
   - Easier to add additional logic during traversal

3. **Using recursion**:
   - Clean and elegant for handling nested structures
   - Less efficient for very deep paths (potential stack overflow)
   - Good for complex path formats or when additional processing is needed

**Edge Cases Handled:**
- Null or undefined values in the path
- Non-existent paths
- Array indexing (e.g., 'hobbies.0')
- Default values for missing properties

#### Write a function to set a nested property by string path.

```javascript
/**
 * Sets a nested property on an object using a string path
 * @param {Object} obj - The object to set the property on
 * @param {string} path - The path to the property (e.g., 'a.b.c')
 * @param {any} value - The value to set
 * @returns {Object} - The modified object
 */
function setNestedProperty(obj, path, value) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    throw new Error('Cannot set property on null or non-object');
  }
  
  if (!path) {
    throw new Error('Path cannot be empty');
  }
  
  // Method 1: Mutating the original object
  function setMutating(object, pathString, val) {
    const keys = pathString.split('.');
    let current = object;
    
    // Navigate to the parent of the property to set
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      // If the path doesn't exist or is not an object, create it
      if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object') {
        // If the next key is a number, create an array, otherwise an object
        current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      }
      
      current = current[key];
    }
    
    // Set the value on the last key
    const lastKey = keys[keys.length - 1];
    current[lastKey] = val;
    
    return object;
  }
  
  // Method 2: Immutable approach (creates a new object)
  function setImmutable(object, pathString, val) {
    const keys = pathString.split('.');
    
    // Base case: if we're at the last key, return a new object with the updated value
    if (keys.length === 1) {
      return {
        ...object,
        [keys[0]]: val
      };
    }
    
    // Get the current key and the rest of the path
    const key = keys[0];
    const remainingPath = keys.slice(1).join('.');
    
    // If the key doesn't exist or is not an object, create a new one
    const nextObj = object[key] === undefined || object[key] === null || typeof object[key] !== 'object'
      ? /^\d+$/.test(keys[1]) ? [] : {}
      : object[key];
    
    // Recursively set the value on the next level
    return {
      ...object,
      [key]: setImmutable(nextObj, remainingPath, val)
    };
  }
  
  // Execute both methods
  const mutatedObj = setMutating({...obj}, path, value);
  const immutableObj = setImmutable(obj, path, value);
  
  console.log("Original object:", obj);
  console.log("After mutating:", mutatedObj);
  console.log("Immutable result:", immutableObj);
  
  // Return the mutated object (most common approach)
  return mutatedObj;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  address: {
    home: {
      city: "New York",
      zip: "10001"
    }
  },
  hobbies: ["reading", "swimming"]
};

// Set existing nested property
setNestedProperty(user, 'address.home.city', 'Boston');

// Set property that doesn't exist yet
setNestedProperty(user, 'address.work.city', 'San Francisco');

// Set array element
setNestedProperty(user, 'hobbies.1', 'running');

// Set new array element
setNestedProperty(user, 'hobbies.2', 'cycling');

// Set deeply nested property that doesn't exist
setNestedProperty(user, 'preferences.theme.dark.colors.background', '#000000');

console.log("Final user object:", user);
```

**Key Aspects of Setting Nested Properties:**

1. **Path Creation**:
   - Create intermediate objects/arrays if they don't exist
   - Determine whether to create an object or array based on the next key

2. **Mutable vs. Immutable**:
   - Mutable approach modifies the original object (more efficient)
   - Immutable approach creates a new object at each level (safer, works with state management libraries)

3. **Array Handling**:
   - Detect numeric keys to create arrays instead of objects
   - Handle array indices properly

4. **Edge Cases**:
   - Handle null or non-object values in the path
   - Validate inputs to prevent errors
   - Consider type conflicts (e.g., trying to set a property on a string or number)

#### Iterate over object keys and transform values (e.g., square all numbers).

```javascript
/**
 * Transforms values in an object based on a transformation function
 * @param {Object} obj - The object to transform
 * @param {Function} transformFn - Function to apply to each value
 * @param {boolean} [deep=false] - Whether to transform nested objects recursively
 * @returns {Object} - A new object with transformed values
 */
function transformObjectValues(obj, transformFn, deep = false) {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Method 1: Using Object.entries and Object.fromEntries
  function transformWithEntries(object) {
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => {
        // If deep and value is an object, transform recursively
        if (deep && value !== null && typeof value === 'object') {
          return [key, transformWithEntries(value)];
        }
        // Otherwise apply the transformation function
        return [key, transformFn(value, key, object)];
      })
    );
  }
  
  // Method 2: Using reduce
  function transformWithReduce(object) {
    return Object.keys(object).reduce((result, key) => {
      const value = object[key];
      
      // If deep and value is an object, transform recursively
      if (deep && value !== null && typeof value === 'object') {
        result[key] = transformWithReduce(value);
      } else {
        // Otherwise apply the transformation function
        result[key] = transformFn(value, key, object);
      }
      
      return result;
    }, {});
  }
  
  // Method 3: Using a for...in loop
  function transformWithForIn(object) {
    const result = {};
    
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];
        
        // If deep and value is an object, transform recursively
        if (deep && value !== null && typeof value === 'object') {
          result[key] = transformWithForIn(value);
        } else {
          // Otherwise apply the transformation function
          result[key] = transformFn(value, key, object);
        }
      }
    }
    
    return result;
  }
  
  // Execute all methods
  const resultWithEntries = transformWithEntries(obj);
  const resultWithReduce = transformWithReduce(obj);
  const resultWithForIn = transformWithForIn(obj);
  
  console.log("Original object:", obj);
  console.log("Transformed with Object.entries:", resultWithEntries);
  console.log("Transformed with reduce:", resultWithReduce);
  console.log("Transformed with for...in:", resultWithForIn);
  
  // Return the result (using Object.entries method)
  return resultWithEntries;
}

// Example 1: Square all numbers
const data = {
  a: 2,
  b: 3,
  c: "hello",
  d: true,
  e: {
    f: 4,
    g: "world",
    h: {
      i: 5
    }
  }
};

const squareNumbers = transformObjectValues(
  data,
  value => typeof value === 'number' ? value * value : value,
  true // deep transform
);

console.log("Object with squared numbers:", squareNumbers);

// Example 2: Convert all strings to uppercase
const uppercaseStrings = transformObjectValues(
  data,
  value => typeof value === 'string' ? value.toUpperCase() : value,
  true
);

console.log("Object with uppercase strings:", uppercaseStrings);

// Example 3: Add prefix to all keys (using a custom implementation)
function transformObjectKeys(obj, transformFn, deep = false) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    const newKey = transformFn(key);
    
    // If deep and value is an object, transform recursively
    if (deep && value !== null && typeof value === 'object') {
      result[newKey] = transformObjectKeys(value, transformFn, deep);
    } else {
      result[newKey] = value;
    }
    
    return result;
  }, {});
}

const prefixedKeys = transformObjectKeys(
  data,
  key => `prefix_${key}`,
  true
);

console.log("Object with prefixed keys:", prefixedKeys);
```

**Different Approaches to Transform Object Values:**

1. **Using Object.entries and Object.fromEntries**:
   - Modern and clean approach
   - Good for functional programming style
   - Available in newer JavaScript environments

2. **Using reduce**:
   - Flexible and powerful
   - Works well with complex transformations
   - Good performance

3. **Using for...in loop**:
   - More traditional approach
   - Works in all JavaScript environments
   - Requires hasOwnProperty check to avoid prototype properties

**Common Transformation Use Cases:**
- Formatting values (e.g., capitalizing strings, rounding numbers)
- Type conversions (e.g., converting string numbers to actual numbers)
- Data normalization (e.g., ensuring consistent formats)
- Filtering values (by returning null or undefined for unwanted values)
- Adding metadata to values

### Hard

#### Recursively transform all keys of an object (camelCase ↔ snake_case).

```javascript
/**
 * Recursively transforms all keys in an object between camelCase and snake_case
 * @param {Object} obj - The object to transform
 * @param {string} format - The target format: 'camel' or 'snake'
 * @returns {Object} - A new object with transformed keys
 */
function transformObjectKeys(obj, format = 'camel') {
  // Handle edge cases
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => transformObjectKeys(item, format));
  }
  
  // Convert camelCase to snake_case
  function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
  
  // Convert snake_case to camelCase
  function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  
  // Choose the appropriate transformation function
  const transformKey = format === 'snake' ? camelToSnake : snakeToCamel;
  
  // Transform the object
  return Object.entries(obj).reduce((result, [key, value]) => {
    // Transform the key
    const newKey = transformKey(key);
    
    // Transform the value recursively if it's an object
    result[newKey] = value !== null && typeof value === 'object'
      ? transformObjectKeys(value, format)
      : value;
    
    return result;
  }, {});
}

// Example usage
const camelCaseObj = {
  firstName: "John",
  lastName: "Doe",
  contactInfo: {
    emailAddress: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    socialMedia: {
      linkedInProfile: "johndoe",
      twitterHandle: "@johndoe"
    }
  },
  addressDetails: [
    {
      streetName: "Main St",
      cityName: "New York",
      zipCode: "10001"
    },
    {
      streetName: "Broadway",
      cityName: "Boston",
      zipCode: "02101"
    }
  ]
};

// Convert to snake_case
const snakeCaseObj = transformObjectKeys(camelCaseObj, 'snake');
console.log("Snake case object:", JSON.stringify(snakeCaseObj, null, 2));

// Convert back to camelCase
const backToCamelCase = transformObjectKeys(snakeCaseObj, 'camel');
console.log("Back to camel case:", JSON.stringify(backToCamelCase, null, 2));

// Handle edge cases
const mixedObj = {
  user_id: 123,
  userName: "john_doe",
  "first-name": "John",
  "last-name": "Doe",
  nested_object: {
    property_one: "value",
    propertyTwo: "another value"
  }
};

const normalizedObj = transformObjectKeys(mixedObj, 'camel');
console.log("Normalized object:", JSON.stringify(normalizedObj, null, 2));
```

**Key Aspects of Key Transformation:**

1. **Recursive Handling**:
   - Process nested objects and arrays
   - Maintain the original structure

2. **Case Conversion**:
   - camelCase to snake_case: Insert underscore before capital letters and lowercase them
   - snake_case to camelCase: Remove underscores and capitalize the following letter

3. **Edge Cases**:
   - Handle arrays properly
   - Skip non-object values
   - Handle mixed formats
   - Consider special characters and non-standard naming

4. **Applications**:
   - API response normalization
   - Database to frontend data conversion
   - Configuration standardization
   - Cross-platform data exchange

#### Search for a key in a deeply nested object and return its path(s).

```javascript
/**
 * Searches for a key in a deeply nested object and returns its path(s)
 * @param {Object} obj - The object to search in
 * @param {string} searchKey - The key to search for
 * @returns {string[]} - Array of paths where the key was found
 */
function findKeyInNestedObject(obj, searchKey) {
  // Store all found paths
  const paths = [];
  
  // Recursive search function
  function search(object, currentPath = '') {
    // Skip null and non-objects
    if (object === null || typeof object !== 'object') {
      return;
    }
    
    // Check all keys in the current object
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        // Build the current key path
        const keyPath = currentPath ? `${currentPath}.${key}` : key;
        
        // Check if this is the key we're looking for
        if (key === searchKey) {
          paths.push(keyPath);
        }
        
        // Recursively search in nested objects
        if (object[key] !== null && typeof object[key] === 'object') {
          search(object[key], keyPath);
        }
      }
    }
  }
  
  // Start the search
  search(obj);
  
  return paths;
}

// Example usage
const complexObj = {
  user: {
    id: 1,
    name: "John",
    address: {
      city: "New York",
      zip: "10001",
      geo: {
        lat: 40.7128,
        lng: -74.0060
      }
    }
  },
  products: [
    {
      id: 101,
      name: "Laptop",
      price: 999,
      specs: {
        cpu: "Intel i7",
        ram: "16GB",
        storage: {
          type: "SSD",
          size: "512GB"
        }
      }
    },
    {
      id: 102,
      name: "Phone",
      price: 699,
      specs: {
        cpu: "A14",
        ram: "4GB",
        storage: {
          type: "Flash",
          size: "256GB"
        }
      }
    }
  ],
  settings: {
    theme: {
      name: "dark",
      colors: {
        background: "#000",
        text: "#fff"
      }
    },
    notifications: {
      email: true,
      sms: false
    }
  }
};

// Find all occurrences of 'name'
const namePaths = findKeyInNestedObject(complexObj, 'name');
console.log("Paths for 'name':", namePaths);

// Find all occurrences of 'type'
const typePaths = findKeyInNestedObject(complexObj, 'type');
console.log("Paths for 'type':", typePaths);

// Find all occurrences of 'nonexistent'
const nonexistentPaths = findKeyInNestedObject(complexObj, 'nonexistent');
console.log("Paths for 'nonexistent':", nonexistentPaths);

// Enhanced version that also returns values
function findKeyWithValues(obj, searchKey) {
  const results = [];
  
  function search(object, currentPath = '') {
    if (object === null || typeof object !== 'object') {
      return;
    }
    
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const keyPath = currentPath ? `${currentPath}.${key}` : key;
        
        if (key === searchKey) {
          results.push({
            path: keyPath,
            value: object[key]
          });
        }
        
        if (object[key] !== null && typeof object[key] === 'object') {
          search(object[key], keyPath);
        }
      }
    }
  }
  
  search(obj);
  return results;
}

// Find all occurrences of 'size' with their values
const sizeResults = findKeyWithValues(complexObj, 'size');
console.log("Results for 'size':", sizeResults);
```

**Key Aspects of Deep Object Searching:**

1. **Path Building**:
   - Track the current path as you traverse the object
   - Use dot notation for nested properties
   - Handle arrays appropriately (using indices)

2. **Recursive Traversal**:
   - Visit all nested objects and arrays
   - Skip null values and primitives
   - Check each key against the search key

3. **Result Collection**:
   - Collect all matching paths
   - Optionally collect values along with paths
   - Handle multiple occurrences of the same key

4. **Applications**:
   - Debugging complex objects
   - Data extraction from nested structures
   - Configuration validation
   - Finding specific data in large JSON responses

## 6️⃣ Advanced Manipulations (deep merge, circular refs, serializer, immutability patterns)

### Easy

#### Merge two shallow objects with spread.

```javascript
/**
 * Merges two objects using the spread operator
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {Object} - Merged object
 */
function mergeWithSpread(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

// Example usage
const user = {
  name: "John",
  age: 30
};

const userDetails = {
  email: "john@example.com",
  phone: "123-456-7890"
};

const mergedUser = mergeWithSpread(user, userDetails);
console.log("Merged user:", mergedUser);

// Example with overlapping properties
const defaultSettings = {
  theme: "light",
  fontSize: 14,
  showNotifications: true
};

const userSettings = {
  theme: "dark",
  fontSize: 16
};

const finalSettings = mergeWithSpread(defaultSettings, userSettings);
console.log("Final settings:", finalSettings);
```

**How Spread Operator Merging Works:**
- Creates a new object with all properties from both objects
- Properties are copied from left to right
- If both objects have the same key, the value from the second object overwrites the first

#### What happens when both objects have the same key?

```javascript
/**
 * Demonstrates what happens when merging objects with the same keys
 */
function demonstrateMergeConflicts() {
  // Simple primitive values
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { b: 20, c: 30, d: 40 };
  
  const merged1 = { ...obj1, ...obj2 };
  console.log("Merged with obj2 overwriting obj1:", merged1);
  
  const merged2 = { ...obj2, ...obj1 };
  console.log("Merged with obj1 overwriting obj2:", merged2);
  
  // Nested objects
  const user1 = {
    name: "John",
    settings: {
      theme: "light",
      fontSize: 14,
      notifications: {
        email: true,
        sms: false
      }
    }
  };
  
  const user2 = {
    name: "Jane",
    settings: {
      theme: "dark",
      notifications: {
        push: true
      }
    }
  };
  
  // Shallow merge (nested objects are overwritten completely)
  const mergedUser = { ...user1, ...user2 };
  console.log("Shallow merged users:", mergedUser);
  
  // The nested settings object from user1 is completely replaced
  console.log("Original user1.settings:", user1.settings);
  console.log("Merged user.settings:", mergedUser.settings);
  console.log("Email notifications setting is lost:", mergedUser.settings.notifications.email);
  
  // To preserve nested structures, you need a deep merge
  function deepMerge(obj1, obj2) {
    const result = { ...obj1 };
    
    for (const key in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, key)) {
        if (obj2[key] !== null && typeof obj2[key] === 'object' && 
            obj1[key] !== null && typeof obj1[key] === 'object') {
          // Recursively merge nested objects
          result[key] = deepMerge(obj1[key], obj2[key]);
        } else {
          // Otherwise use the value from obj2
          result[key] = obj2[key];
        }
      }
    }
    
    return result;
  }
  
  const deepMergedUser = deepMerge(user1, user2);
  console.log("Deep merged users:", deepMergedUser);
  console.log("Email notifications preserved:", deepMergedUser.settings.notifications.email);
}

demonstrateMergeConflicts();
```

**Key Points About Object Merging Conflicts:**

1. **Last Write Wins**:
   - When both objects have the same key, the value from the last object in the spread overwrites previous values
   - Order matters: `{ ...obj1, ...obj2 }` vs `{ ...obj2, ...obj1 }` can produce different results

2. **Shallow Merging**:
   - Spread operator only performs a shallow merge
   - Nested objects are completely replaced, not merged
   - This can lead to data loss if not handled carefully

3. **Solutions**:
   - For simple objects, order your spread operators based on precedence needs
   - For nested objects, use a deep merge function or library
   - Consider using dedicated utilities like lodash's `_.merge` for complex cases

### Medium

#### Implement deep merge of two objects.

```javascript
/**
 * Performs a deep merge of two objects
 * @param {Object} target - Target object to merge into
 * @param {Object} source - Source object to merge from
 * @returns {Object} - Deeply merged object
 */
function deepMerge(target, source) {
  // Create a new object to avoid modifying the inputs
  const output = { ...target };
  
  // Handle edge cases
  if (!isObject(target) || !isObject(source)) {
    return source === undefined ? target : source;
  }
  
  // Helper function to check if value is an object
  function isObject(item) {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
  }
  
  // Iterate through all keys in the source
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      // If key doesn't exist in target, create it
      if (!output[key]) {
        output[key] = {};
      }
      
      // If target[key] is not an object, overwrite it
      if (!isObject(output[key])) {
        output[key] = {};
      }
      
      // Recursively merge the nested object
      output[key] = deepMerge(output[key], source[key]);
    } else if (Array.isArray(source[key])) {
      // For arrays, we have multiple strategies:
      
      // Strategy 1: Replace the array (default)
      output[key] = [...source[key]];
      
      // Strategy 2: Concatenate arrays
      // output[key] = [...(output[key] || []), ...source[key]];
      
      // Strategy 3: Merge arrays by index
      // output[key] = output[key] || [];
      // source[key].forEach((item, index) => {
      //   output[key][index] = isObject(item) && isObject(output[key][index])
      //     ? deepMerge(output[key][index], item)
      //     : item;
      // });
    } else {
      // For primitive values, simply copy from source
      output[key] = source[key];
    }
  });
  
  return output;
}

// Example usage
const obj1 = {
  name: "John",
  age: 30,
  address: {
    home: {
      city: "New York",
      zip: "10001",
      geo: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    work: {
      city: "Boston",
      zip: "02101"
    }
  },
  hobbies: ["reading", "swimming"],
  settings: {
    notifications: {
      email: true,
      sms: false
    },
    theme: "light"
  }
};

const obj2 = {
  name: "Jane",
  address: {
    home: {
      street: "123 Main St",
      zip: "10002",
      geo: {
        lat: 40.7129
      }
    }
  },
  hobbies: ["running", "cycling"],
  settings: {
    notifications: {
      push: true
    },
    fontSize: 16
  }
};

const merged = deepMerge(obj1, obj2);
console.log("Deep merged result:", JSON.stringify(merged, null, 2));

// Test with arrays
const arrayTest1 = {
  items: [1, 2, 3],
  nested: [{ a: 1 }, { b: 2 }]
};

const arrayTest2 = {
  items: [4, 5],
  nested: [{ c: 3 }, { d: 4 }]
};

const mergedArrays = deepMerge(arrayTest1, arrayTest2);
console.log("Merged with arrays:", mergedArrays);
```

**Key Aspects of Deep Merging:**

1. **Recursive Approach**:
   - Traverse both objects recursively
   - Merge nested objects instead of replacing them
   - Handle special cases like arrays and null values

2. **Array Handling Strategies**:
   - Replace: Use the array from the source object
   - Concatenate: Combine arrays from both objects
   - Merge by index: Combine corresponding elements
   - Custom merge: Apply special logic based on array contents

3. **Edge Cases**:
   - Type conflicts (e.g., object in target, non-object in source)
   - Null values
   - Arrays vs objects
   - Circular references (requires additional handling)

4. **Applications**:
   - Configuration merging
   - Default options with overrides
   - State management
   - API response normalization

#### Serialize an object to JSON while excluding certain keys.

```javascript
/**
 * Serializes an object to JSON while excluding specified keys
 * @param {Object} obj - The object to serialize
 * @param {string[]} excludeKeys - Array of keys to exclude
 * @returns {string} - JSON string representation
 */
function serializeWithExclusions(obj, excludeKeys = []) {
  // Method 1: Using a replacer function with JSON.stringify
  function replacer(key, value) {
    // Exclude keys that are in the excludeKeys array
    if (excludeKeys.includes(key)) {
      return undefined; // This will remove the property
    }
    return value;
  }
  
  const jsonWithReplacer = JSON.stringify(obj, replacer, 2);
  
  // Method 2: Create a clean object first, then stringify
  function removeKeys(object) {
    if (object === null || typeof object !== 'object') {
      return object;
    }
    
    // Handle arrays
    if (Array.isArray(object)) {
      return object.map(item => removeKeys(item));
    }
    
    // Create a new object without excluded keys
    return Object.entries(object).reduce((result, [key, value]) => {
      // Skip excluded keys
      if (excludeKeys.includes(key)) {
        return result;
      }
      
      // Recursively process nested objects
      result[key] = removeKeys(value);
      return result;
    }, {});
  }
  
  const cleanObject = removeKeys(obj);
  const jsonWithCleanObject = JSON.stringify(cleanObject, null, 2);
  
  console.log("Using replacer function:");
  console.log(jsonWithReplacer);
  
  console.log("\nUsing clean object:");
  console.log(jsonWithCleanObject);
  
  // Return the result using replacer function (more efficient)
  return jsonWithReplacer;
}

// Example usage
const user = {
  name: "John",
  age: 30,
  password: "secret123",
  email: "john@example.com",
  creditCard: "1234-5678-9012-3456",
  address: {
    city: "New York",
    zip: "10001",
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      sms: false
    }
  }
};

// Exclude sensitive information
const excludeKeys = ["password", "creditCard", "lat", "lng"];
const safeJson = serializeWithExclusions(user, excludeKeys);

console.log("Safe JSON for transmission:", safeJson);

// Parse back to object
const parsedUser = JSON.parse(safeJson);
console.log("Parsed user:", parsedUser);
```

**Key Aspects of Selective Serialization:**

1. **Using Replacer Function**:
   - JSON.stringify accepts a replacer function as its second parameter
   - The replacer gets called for each key-value pair
   - Return undefined to exclude a property
   - Works at all levels of nesting

2. **Creating a Clean Object**:
   - Alternative approach: create a new object without excluded keys
   - More control over the process
   - Can be combined with other transformations

3. **Applications**:
   - Removing sensitive data before sending to clients
   - Excluding circular references
   - Customizing API responses
   - Reducing payload size by excluding unnecessary data

### Hard

#### Write a function to detect circular references in an object.

```javascript
/**
 * Detects circular references in an object
 * @param {Object} obj - The object to check for circular references
 * @returns {Array} - Array of paths to circular references
 */
function detectCircularReferences(obj) {
  // Store paths to circular references
  const circularPaths = [];
  
  // Track visited objects and their paths
  const visited = new WeakMap();
  
  // Recursive function to check for circular references
  function detect(object, path = '') {
    // Skip primitives and null
    if (object === null || typeof object !== 'object') {
      return;
    }
    
    // Check if we've seen this object before
    if (visited.has(object)) {
      // We found a circular reference
      circularPaths.push({
        path,
        referencesPath: visited.get(object)
      });
      return;
    }
    
    // Mark this object as visited and store its path
    visited.set(object, path);
    
    // Check all properties recursively
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];
        const newPath = path ? `${path}.${key}` : key;
        
        detect(value, newPath);
      }
    }
    
    // Also check array elements
    if (Array.isArray(object)) {
      object.forEach((item, index) => {
        const newPath = `${path}[${index}]`;
        detect(item, newPath);
      });
    }
  }
  
  // Start detection
  detect(obj);
  
  return circularPaths;
}

// Example usage
function demonstrateCircularDetection() {
  // Create an object with circular references
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: {}
    }
  };
  
  // Create circular references
  obj.b.d.self = obj.b;        // b -> d -> self -> b
  obj.circular = obj;          // obj -> circular -> obj
  obj.b.array = [1, 2, obj];   // b -> array -> [2] -> obj
  
  // Detect circular references
  const circularRefs = detectCircularReferences(obj);
  
  console.log("Circular references detected:", circularRefs);
  
  // Trying to stringify this object would fail
  try {
    JSON.stringify(obj);
  } catch (error) {
    console.log("JSON.stringify error:", error.message);
  }
}

demonstrateCircularDetection();
```

**How Circular Reference Detection Works:**

1. **Tracking Visited Objects**:
   - Use a WeakMap to store objects we've already seen
   - Store the path to each object for reference

2. **Path Building**:
   - Build a string path as we traverse the object
   - Use dot notation for object properties
   - Use bracket notation for array indices

3. **Circular Reference Identification**:
   - When we encounter an object we've seen before, we've found a circular reference
   - Record both the current path and the original path to the object

4. **Applications**:
   - Debugging complex object structures
   - Pre-processing objects before serialization
   - Visualizing object relationships
   - Detecting memory leaks

#### Implement a serializer that can handle circular references (JSON.stringify throws).

```javascript
/**
 * Serializes an object to JSON, handling circular references
 * @param {Object} obj - The object to serialize
 * @returns {string} - JSON string representation
 */
function serializeWithCircularRefs(obj) {
  // Track visited objects and their paths
  const visited = new Map();
  let circularReplacer = null;
  
  // Method 1: Using a custom replacer with reference markers
  function customReplacer(key, value) {
    // Skip the root object
    if (key === '' && value === obj) {
      return value;
    }
    
    // Handle non-object values normally
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    
    // Check for circular references
    if (visited.has(value)) {
      // Return a reference marker
      return { $circularRef: visited.get(value) };
    }
    
    // For arrays, we need special handling
    if (Array.isArray(value)) {
      // Store the path to this array
      const path = getPath(this, key);
      visited.set(value, path);
      
      // Process each array element
      return value;
    }
    
    // For objects, store the path and continue
    const path = getPath(this, key);
    visited.set(value, path);
    
    return value;
  }
  
  // Helper function to get the path to a property
  function getPath(parent, key) {
    // Root object
    if (key === '') {
      return '$';
    }
    
    // Find the path to the parent
    for (const [obj, path] of visited.entries()) {
      if (obj === parent) {
        return Array.isArray(parent) ? `${path}[${key}]` : `${path}.${key}`;
      }
    }
    
    // Should not reach here if used correctly
    return key;
  }
  
  // Method 2: Using a more robust approach with path tracking
  function serializeWithPathTracking() {
    const paths = new Map();
    const serialized = [];
    
    // First pass: collect all objects and their paths
    function collectPaths(obj, path = '$') {
      if (obj === null || typeof obj !== 'object') {
        return;
      }
      
      // Store the path to this object
      paths.set(obj, path);
      
      // Process object properties or array elements
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          collectPaths(item, `${path}[${index}]`);
        });
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            collectPaths(obj[key], `${path}.${key}`);
          }
        }
      }
    }
    
    // Second pass: serialize with circular reference handling
    function serialize(obj, path = '$') {
      if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
      }
      
      // Check if we've seen this object before at a different path
      if (paths.get(obj) !== path) {
        // This is a circular reference
        return `{"$ref":"${paths.get(obj)}"}`;
      }
      
      if (Array.isArray(obj)) {
        const items = obj.map((item, index) => 
          serialize(item, `${path}[${index}]`)
        );
        return `[${items.join(',')}]`;
      }
      
      const pairs = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          pairs.push(`"${key}":${serialize(value, `${path}.${key}`)}`);
        }
      }
      
      return `{${pairs.join(',')}}`;
    }
    
    // Execute both passes
    collectPaths(obj);
    return serialize(obj);
  }
  
  // Execute both methods
  const jsonWithReplacer = JSON.stringify(obj, customReplacer, 2);
  const jsonWithPathTracking = serializeWithPathTracking();
  
  console.log("Using custom replacer:");
  console.log(jsonWithReplacer);
  
  console.log("\nUsing path tracking:");
  console.log(jsonWithPathTracking);
  
  // Return the result using custom replacer (more standard)
  return jsonWithReplacer;
}

// Example usage
function demonstrateCircularSerialization() {
  // Create an object with circular references
  const obj = {
    name: "Circular Object",
    nested: {
      level: 1,
      deeper: {
        level: 2
      }
    },
    array: [1, 2, 3]
  };
  
  // Create circular references
  obj.self = obj;                  // Direct self-reference
  obj.nested.parent = obj;         // Reference to parent
  obj.nested.deeper.evenDeeper = obj.nested; // Reference to ancestor
  obj.array.push(obj.nested);      // Object in array
  
  // Try standard JSON.stringify (will fail)
  try {
    const standardJson = JSON.stringify(obj);
    console.log("Standard JSON:", standardJson);
  } catch (error) {
    console.log("Standard JSON.stringify error:", error.message);
  }
  
  // Use our custom serializer
  const circularJson = serializeWithCircularRefs(obj);
  console.log("Circular-safe JSON:", circularJson);
  
  // Parse and reconstruct the object
  console.log("\nTo fully reconstruct the object with circular references,");
  console.log("you would need a custom reviver function that resolves the reference markers.");
}

demonstrateCircularSerialization();
```

**Approaches to Handling Circular References:**

1. **Reference Markers**:
   - Replace circular references with special markers
   - Markers contain the path to the referenced object
   - Allows for reconstruction during parsing

2. **Path Tracking**:
   - Track the path to each object in the structure
   - When a circular reference is detected, output a reference to the original path
   - More complex but provides complete information

3. **Limitations**:
   - The resulting JSON is not standard JSON
   - Requires a custom parser to reconstruct the original object
   - Some information about object identity may be lost

4. **Applications**:
   - Debugging complex object structures
   - Storing object graphs in databases
   - Transmitting complex data structures
   - Visualizing object relationships

#### Design an immutable update helper that applies a patch to a deeply nested object (Redux style).

```javascript
/**
 * Applies an immutable update to a deeply nested object
 * @param {Object} state - The original state object
 * @param {Object} patch - The patch to apply
 * @returns {Object} - A new state with the patch applied
 */
function immutableUpdate(state, patch) {
  // Handle edge cases
  if (state === null || typeof state !== 'object' || 
      patch === null || typeof patch !== 'object') {
    return patch;
  }
  
  // Handle arrays
  if (Array.isArray(state) && Array.isArray(patch)) {
    // If both are arrays, create a new array with the same length
    return patch.map((item, index) => {
      // If the index exists in the original array, recursively update
      if (index < state.length) {
        return immutableUpdate(state[index], item);
      }
      // Otherwise, use the new item
      return item;
    });
  }
  
  // Handle objects
  if (!Array.isArray(state) && !Array.isArray(patch)) {
    const result = { ...state };
    
    // Process each key in the patch
    for (const key in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) {
        // Special case: if the value is undefined, remove the key
        if (patch[key] === undefined) {
          delete result[key];
        } else if (key.startsWith('$')) {
          // Handle special operators
          handleSpecialOperator(result, key, patch[key]);
        } else if (
          state[key] !== null && 
          typeof state[key] === 'object' && 
          patch[key] !== null && 
          typeof patch[key] === 'object'
        ) {
          // Recursively update nested objects
          result[key] = immutableUpdate(state[key], patch[key]);
        } else {
          // Otherwise, use the new value
          result[key] = patch[key];
        }
      }
    }
    
    return result;
  }
  
  // If types don't match, use the patch
  return patch;
  
  // Helper function to handle special operators
  function handleSpecialOperator(result, operator, value) {
    switch (operator) {
      case '$unset':
        // Remove specified keys
        if (Array.isArray(value)) {
          value.forEach(key => {
            delete result[key];
          });
        }
        break;
        
      case '$push':
        // Push items to arrays
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            if (Array.isArray(result[key])) {
              result[key] = [...result[key], ...value[key]];
            } else {
              result[key] = value[key];
            }
          }
        }
        break;
        
      case '$merge':
        // Shallow merge objects
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            result[key] = { ...result[key], ...value[key] };
          }
        }
        break;
        
      case '$apply':
        // Apply functions to values
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key) && 
              typeof value[key] === 'function') {
            result[key] = value[key](result[key]);
          }
        }
        break;
    }
  }
}

// Example usage
function demonstrateImmutableUpdate() {
  // Initial state
  const state = {
    user: {
      name: "John",
      age: 30,
      address: {
        city: "New York",
        zip: "10001"
      }
    },
    settings: {
      theme: "light",
      notifications: {
        email: true,
        sms: false
      }
    },
    posts: [
      { id: 1, title: "First Post", likes: 10 },
      { id: 2, title: "Second Post", likes: 5 }
    ],
    tags: ["javascript", "react", "redux"]
  };
  
  // Example 1: Update a nested property
  const patch1 = {
    user: {
      address: {
        city: "Boston"
      }
    }
  };
  
  const updatedState1 = immutableUpdate(state, patch1);
  console.log("Example 1 - Updated city:", updatedState1.user.address.city);
  console.log("Original state unchanged:", state.user.address.city);
  
  // Example 2: Add a new property
  const patch2 = {
    user: {
      email: "john@example.com"
    }
  };
  
  const updatedState2 = immutableUpdate(state, patch2);
  console.log("Example 2 - Added email:", updatedState2.user.email);
  
  // Example 3: Update an array item
  const patch3 = {
    posts: [
      { id: 1, likes: 11 },
      undefined
    ]
  };
  
  const updatedState3 = immutableUpdate(state, patch3);
  console.log("Example 3 - Updated likes:", updatedState3.posts[0].likes);
  console.log("Title preserved:", updatedState3.posts[0].title);
  
  // Example 4: Using special operators
  const patch4 = {
    '$push': {
      tags: ["typescript"]
    },
    '$unset': ["user.age"],
    '$apply': {
      'posts[0].likes': likes => likes + 5
    }
  };
  
  const updatedState4 = immutableUpdate(state, patch4);
  console.log("Example 4 - Added tag:", updatedState4.tags);
  console.log("Removed age:", updatedState4.user.age);
  console.log("Applied function to likes:", updatedState4.posts[0].likes);
}

demonstrateImmutableUpdate();
```

**Key Features of Immutable Update Helper:**

1. **Deep Immutability**:
   - Creates new objects at each level of nesting
   - Preserves unchanged parts of the state
   - Ensures referential equality checks work correctly

2. **Special Operators**:
   - `$unset`: Remove properties
   - `$push`: Add items to arrays
   - `$merge`: Shallow merge objects
   - `$apply`: Apply functions to values

3. **Path-Based Updates**:
   - Allows updating deeply nested properties without knowing the full structure
   - Only creates new objects along the update path
   - Efficient for large state trees

4. **Applications**:
   - State management in Redux
   - Immutable data structures in React
   - Undo/redo functionality
   - Performance optimization in change detection
