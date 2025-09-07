# Flatten Nested Object and Array

## Problem Understanding

### Definition

**Flattening** is the process of transforming a nested structure (objects or arrays) into a simpler, non-nested structure. This is a common operation in JavaScript when working with complex data structures.

- **Array Flattening**: Converting a multi-dimensional array into a single-dimensional array.
- **Object Flattening**: Converting a nested object into a flat object where keys represent the path to each value.

### Parameters

#### Flatten Array Function
- `arr`: The array to flatten
- `depth` (optional): The maximum recursion depth (default: Infinity)

#### Flatten Object Function
- `obj`: The object to flatten
- `prefix` (optional): A string prefix for keys (used in recursion)
- `delimiter` (optional): The character to use as a delimiter in the flattened keys (default: '.')

#### Flatten Mixed Structure Function
- `input`: The structure to flatten (object or array)
- `depth` (optional): The maximum recursion depth for arrays (default: Infinity)
- `delimiter` (optional): The character to use as a delimiter in flattened object keys (default: '.')

### Return Value

- **Flatten Array**: Returns a new single-dimensional array containing all elements of the original array.
- **Flatten Object**: Returns a new object with keys that represent the path to each value in the original object.
- **Flatten Mixed**: Returns either a flattened array, a flattened object, or the input itself if it's neither an array nor an object.

### Edge Cases to Handle

1. **Input Validation**:
   - Non-array input to flattenArray
   - Non-object input to flattenObject
   - Null or undefined inputs

2. **Depth Control**:
   - Zero or negative depth values
   - Very deep nesting (potential stack overflow)

3. **Special Object Types**:
   - Arrays within objects
   - Objects within arrays
   - Date objects, RegExp objects, etc.

4. **Key Handling**:
   - Empty keys
   - Keys containing the delimiter character
   - Symbol keys

5. **Circular References**:
   - Objects that reference themselves (directly or indirectly)

### Use Cases

1. **Data Transformation**:
   - Preparing nested API responses for storage in a flat database
   - Converting complex form data into a format suitable for submission

2. **Data Analysis**:
   - Simplifying nested data structures for easier processing
   - Creating dot-notation paths for accessing deeply nested values

3. **Configuration Management**:
   - Flattening hierarchical configuration objects
   - Merging configuration from multiple sources

4. **DOM Manipulation**:
   - Flattening nested DOM structures for easier traversal
   - Processing nested event data

### Implementation Approaches

#### Array Flattening Approaches

1. **Recursive Approach**:
   - Recursively process each element, concatenating arrays and preserving non-arrays
   - Simple to understand but can cause stack overflow for deeply nested arrays

2. **Iterative Approach**:
   - Use a stack or queue to process elements without recursion
   - More complex but avoids stack overflow issues

3. **Using Built-in Methods**:
   - ES2019 introduced `Array.prototype.flat()` which can be used as a reference
   - Can use `reduce()` with `concat()` for a concise implementation

#### Object Flattening Approaches

1. **Recursive Approach**:
   - Recursively process each property, building path strings for keys
   - Simple but can cause stack overflow for deeply nested objects

2. **Breadth-First Approach**:
   - Use a queue to process object properties level by level
   - Avoids stack overflow but more complex to implement

3. **Using Object Entries**:
   - Leverage `Object.entries()` to iterate through key-value pairs
   - Combine with recursion or iteration for nested objects

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the total number of elements/properties in the input structure
- **Space Complexity**: O(n) for the output structure plus O(d) for the recursion stack, where d is the maximum depth

### Common Interview Questions

1. How would you handle circular references in the input structure?
2. Can you implement flattening without recursion to avoid stack overflow?
3. How would you implement a function that can both flatten and unflatten a structure?
4. How would you optimize the flattening process for very large structures?
5. How would you handle special object types like Date, RegExp, or custom classes?
