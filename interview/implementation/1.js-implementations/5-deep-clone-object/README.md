# Deep Clone Object

## Problem Understanding

### Definition

**Deep cloning** is the process of creating a completely independent copy of an object or array, including all nested objects and arrays. Unlike shallow copying (which only copies the top level), deep cloning ensures that modifying the clone will not affect the original object at any level of nesting.

### Parameters

#### Basic Deep Clone Function
- `obj`: The object or array to clone

#### Advanced Deep Clone Function
- `obj`: The object or array to clone

#### JSON Deep Clone Function
- `obj`: The object or array to clone

#### Structured Clone Function
- `obj`: The object or array to clone

### Return Value

All deep clone functions return a new object or array that is a complete copy of the input, with all nested objects and arrays also copied rather than referenced.

### Edge Cases to Handle

1. **Primitive Values**:
   - Numbers, strings, booleans, undefined, null, symbols
   - These can be copied directly without special handling

2. **Complex Objects**:
   - Nested objects and arrays
   - Special object types (Date, RegExp, Map, Set, etc.)
   - Functions (which typically cannot be deeply cloned)
   - DOM nodes and other browser-specific objects

3. **Circular References**:
   - Objects that reference themselves directly or indirectly
   - Without proper handling, these cause stack overflow errors

4. **Property Descriptors**:
   - Enumerable vs. non-enumerable properties
   - Getters and setters
   - Property attributes (writable, configurable)

5. **Prototype Chain**:
   - Preserving the prototype chain in the cloned object
   - Handling custom classes and inheritance

### Use Cases

1. **State Management**:
   - Creating immutable state copies in frameworks like Redux
   - Preventing unintended side effects when modifying objects

2. **Caching**:
   - Storing snapshots of objects that shouldn't be affected by later changes
   - Creating backup copies of data

3. **Object Manipulation**:
   - Creating modified versions of objects without affecting the original
   - Working with configuration objects that need to be customized

4. **Testing**:
   - Creating isolated test fixtures
   - Resetting state between tests

### Implementation Approaches

#### Recursive Approach

1. **Basic Implementation**:
   - Recursively copy each property
   - Handle arrays and objects differently
   - Simple but doesn't handle special cases

2. **Advanced Implementation**:
   - Track visited objects to handle circular references
   - Special handling for built-in types like Date, RegExp
   - Preserve property descriptors and prototype chain

#### JSON Serialization

1. **Using JSON.parse/stringify**:
   - Simple one-liner: `JSON.parse(JSON.stringify(obj))`
   - Limited to JSON-serializable data
   - Cannot handle circular references, functions, undefined, or special object types

#### Structured Clone Algorithm

1. **Using structuredClone() (Modern Browsers)**:
   - Native browser API for deep cloning
   - Handles circular references and many built-in types
   - Cannot clone functions or DOM nodes

#### Library-based Approaches

1. **Using Libraries**:
   - Lodash's `_.cloneDeep()`
   - Immer's immutable state management
   - Custom implementations with specific features

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the total number of properties in the object and all its nested objects
- **Space Complexity**: O(n) for the new copy plus O(d) for the recursion stack, where d is the maximum depth of nesting

### Comparison of Approaches

| Approach | Pros | Cons |
|----------|------|------|
| Basic Recursive | Simple to understand | Doesn't handle circular references or special types |
| Advanced Recursive | Comprehensive, handles edge cases | Complex implementation, potentially slower |
| JSON Method | Simple one-liner | Limited to JSON-serializable data |
| structuredClone() | Native, handles circular references | Not available in older browsers, can't clone functions |

### Common Interview Questions

1. How would you handle circular references in a deep clone implementation?
2. What are the limitations of using JSON.parse/JSON.stringify for deep cloning?
3. How would you preserve the prototype chain when deep cloning an object?
4. How would you handle special object types like Date, RegExp, Map, and Set?
5. Can you implement a deep clone function that also clones functions?

### Code Example: Testing Deep Clone

```javascript
// Create an object with circular reference
const original = { name: 'test', nested: { count: 42 } };
original.self = original; // Circular reference

// Test different cloning methods
try {
  // This will fail with circular reference
  const jsonClone = JSON.parse(JSON.stringify(original));
} catch (e) {
  console.log('JSON cloning failed:', e.message);
}

// Advanced clone should handle circular references
const advancedClone = advancedDeepClone(original);
console.log(advancedClone.nested.count === original.nested.count); // true
console.log(advancedClone.nested === original.nested); // false (deep copy)
console.log(advancedClone.self === advancedClone); // true (circular reference preserved)
