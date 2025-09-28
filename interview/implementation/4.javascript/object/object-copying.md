# Object Copying / Cloning in JavaScript

This document covers implementations of shallow and deep copying techniques for JavaScript objects.

## 1. Shallow Copy

Shallow copying creates a new object with copies of the top-level properties, but nested objects are still shared references.

### Using Spread Operator

```javascript
/**
 * Creates a shallow copy of an object using the spread operator
 * 
 * @param {Object} obj - Object to copy
 * @returns {Object} - A new object with the same top-level properties
 */
function shallowCopySpread(obj) {
  // Handle non-object inputs
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return [...obj];
  }
  
  // Handle plain objects
  return { ...obj };
}
```

### Using Object.assign()

```javascript
/**
 * Creates a shallow copy of an object using Object.assign()
 * 
 * @param {Object} obj - Object to copy
 * @returns {Object} - A new object with the same top-level properties
 */
function shallowCopyAssign(obj) {
  // Handle non-object inputs
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return Object.assign([], obj);
  }
  
  // Handle plain objects
  return Object.assign({}, obj);
}
```

### Examples

```javascript
// Basic usage
const original = { 
  name: "John", 
  age: 30, 
  address: { city: "New York", zip: "10001" },
  hobbies: ["reading", "swimming"]
};

// Using spread operator
const copy1 = shallowCopySpread(original);
copy1.name = "Jane";
copy1.address.city = "Boston";
copy1.hobbies.push("running");

console.log(original.name); // "John" (primitive value not affected)
console.log(original.address.city); // "Boston" (nested object affected)
console.log(original.hobbies); // ["reading", "swimming", "running"] (array affected)

// Using Object.assign()
const copy2 = shallowCopyAssign(original);
copy2.age = 25;
copy2.address.zip = "02108";

console.log(original.age); // 30 (primitive value not affected)
console.log(original.address.zip); // "02108" (nested object affected)

// Edge cases
console.log(shallowCopySpread(null)); // null
console.log(shallowCopySpread(42)); // 42
console.log(shallowCopySpread([1, 2, 3])); // [1, 2, 3] (new array)
```

## 2. Deep Copy

Deep copying creates a completely independent clone with all nested objects and properties copied recursively.

### Basic Implementation

```javascript
/**
 * Creates a deep copy of an object or value
 * 
 * @param {any} value - Value to deep copy
 * @returns {any} - A new deeply copied value
 * 
 * Note: This basic implementation doesn't handle circular references,
 * functions, or special object types like Date, RegExp, Map, Set, etc.
 */
function basicDeepCopy(value) {
  // Handle primitive types
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => basicDeepCopy(item));
  }
  
  // Handle plain objects
  const result = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = basicDeepCopy(value[key]);
    }
  }
  
  return result;
}
```

### Complete Implementation

```javascript
/**
 * Creates a deep copy of any JavaScript value
 * 
 * @param {any} value - Value to deep copy
 * @returns {any} - A new deeply copied value
 * 
 * Handles:
 * - Primitive values
 * - Objects and arrays
 * - Date objects
 * - RegExp objects
 * - Map and Set objects
 * - Functions (reference only)
 */
function deepCopy(value) {
  // Handle primitive types
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }
  
  // Handle Arrays
  if (Array.isArray(value)) {
    return value.map(item => deepCopy(item));
  }
  
  // Handle Map objects
  if (value instanceof Map) {
    const result = new Map();
    value.forEach((val, key) => {
      result.set(deepCopy(key), deepCopy(val));
    });
    return result;
  }
  
  // Handle Set objects
  if (value instanceof Set) {
    const result = new Set();
    value.forEach(val => {
      result.add(deepCopy(val));
    });
    return result;
  }
  
  // Handle plain objects
  const result = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepCopy(value[key]);
    }
  }
  
  return result;
}
```

### Examples

```javascript
// Basic usage
const original = {
  name: "John",
  age: 30,
  address: { city: "New York", zip: "10001" },
  hobbies: ["reading", { type: "sport", name: "swimming" }],
  birthDate: new Date("1990-01-01"),
  regex: /test/g,
  data: new Map([["key", { value: 42 }]]),
  tags: new Set(["javascript", "programming"])
};

const copy = deepCopy(original);

// Modify the copy
copy.name = "Jane";
copy.address.city = "Boston";
copy.hobbies[1].name = "running";
copy.birthDate.setFullYear(1995);
copy.data.get("key").value = 100;
copy.tags.add("coding");

// Original remains unchanged
console.log(original.name); // "John"
console.log(original.address.city); // "New York"
console.log(original.hobbies[1].name); // "swimming"
console.log(original.birthDate.getFullYear()); // 1990
console.log(original.data.get("key").value); // 42
console.log(original.tags.has("coding")); // false

// Edge cases
console.log(deepCopy(null)); // null
console.log(deepCopy(undefined)); // undefined
console.log(deepCopy(NaN)); // NaN
console.log(deepCopy(function() {})); // [Function]
```

## 3. Deep Copy with Circular References

This implementation handles objects with circular references by tracking visited objects.

```javascript
/**
 * Creates a deep copy of any JavaScript value, handling circular references
 * 
 * @param {any} value - Value to deep copy
 * @param {Map} [visited=new Map()] - Map to track visited objects
 * @returns {any} - A new deeply copied value
 * 
 * Handles:
 * - Primitive values
 * - Objects and arrays
 * - Date objects
 * - RegExp objects
 * - Map and Set objects
 * - Functions (reference only)
 * - Circular references
 */
function deepCopyWithCircular(value, visited = new Map()) {
  // Handle primitive types
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
  
  // Create new instance of the same type
  let result;
  
  if (Array.isArray(value)) {
    result = [];
    // Store reference before recursing to handle circular references
    visited.set(value, result);
    
    // Copy array elements
    value.forEach((item, index) => {
      result[index] = deepCopyWithCircular(item, visited);
    });
    
    return result;
  }
  
  // Handle Map objects
  if (value instanceof Map) {
    result = new Map();
    // Store reference before recursing
    visited.set(value, result);
    
    value.forEach((val, key) => {
      result.set(
        deepCopyWithCircular(key, visited),
        deepCopyWithCircular(val, visited)
      );
    });
    
    return result;
  }
  
  // Handle Set objects
  if (value instanceof Set) {
    result = new Set();
    // Store reference before recursing
    visited.set(value, result);
    
    value.forEach(val => {
      result.add(deepCopyWithCircular(val, visited));
    });
    
    return result;
  }
  
  // Handle plain objects
  result = {};
  // Store reference before recursing
  visited.set(value, result);
  
  // Get all property descriptors, including non-enumerable ones
  const allProps = Object.getOwnPropertyNames(value);
  
  for (const key of allProps) {
    // Skip non-enumerable properties if desired
    if (!Object.prototype.propertyIsEnumerable.call(value, key)) {
      continue;
    }
    
    result[key] = deepCopyWithCircular(value[key], visited);
  }
  
  // Copy symbol properties as well
  const symbols = Object.getOwnPropertySymbols(value);
  for (const sym of symbols) {
    if (Object.prototype.propertyIsEnumerable.call(value, sym)) {
      result[sym] = deepCopyWithCircular(value[sym], visited);
    }
  }
  
  return result;
}
```

### Examples

```javascript
// Circular reference example
const circular = {
  name: "Circular Object",
  created: new Date(),
  nested: {
    data: [1, 2, 3]
  }
};

// Create circular reference
circular.self = circular;
circular.nested.parent = circular;
circular.nested.data.push(circular.nested);

// Deep copy with circular references
const circularCopy = deepCopyWithCircular(circular);

// Verify the copy has the same structure
console.log(circularCopy.name); // "Circular Object"
console.log(circularCopy.self === circularCopy); // true
console.log(circularCopy.nested.parent === circularCopy); // true
console.log(circularCopy.nested.data[3] === circularCopy.nested); // true

// But it's a different object from the original
console.log(circularCopy !== circular); // true
console.log(circularCopy.nested !== circular.nested); // true

// Complex example with various types
const complex = {
  primitives: {
    string: "hello",
    number: 42,
    boolean: true,
    null: null,
    undefined: undefined
  },
  dates: [new Date(), new Date("2023-01-01")],
  regexes: [/test/g, new RegExp("pattern", "i")],
  collections: {
    map: new Map([["key1", "value1"], ["key2", { nested: "value2" }]]),
    set: new Set([1, 2, { id: 3 }])
  },
  symbols: {
    [Symbol("id")]: "symbol value"
  }
};

// Create circular references
complex.self = complex;
complex.collections.owner = complex;

const complexCopy = deepCopyWithCircular(complex);

// Verify it's a deep copy with preserved circular references
console.log(complexCopy !== complex); // true
console.log(complexCopy.self === complexCopy); // true
console.log(complexCopy.collections.owner === complexCopy); // true

// Verify nested objects are copied correctly
console.log(complexCopy.dates[0].getTime() === complex.dates[0].getTime()); // true
console.log(complexCopy.collections.map.get("key2").nested === "value2"); // true
```

## Performance Considerations

When choosing between shallow and deep copying:

1. **Shallow copy** is much faster and uses less memory, but doesn't create truly independent copies of nested objects.

2. **Deep copy** ensures complete independence but is more expensive in terms of performance and memory usage.

3. **JSON.parse(JSON.stringify())** is a common shortcut for deep copying but has significant limitations:
   - Doesn't handle circular references
   - Loses functions, undefined values, and symbols
   - Converts dates to strings
   - Doesn't preserve Maps, Sets, RegExp, etc.

4. For large objects with complex structures, consider using a specialized library like Lodash's `cloneDeep` or Immer for immutable updates.

5. For simple objects or when performance is critical, consider using shallow copies and only deep copying the specific nested objects that need to be modified.
