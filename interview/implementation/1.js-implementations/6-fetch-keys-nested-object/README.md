# Fetch Keys from Nested Object

## Problem Understanding

### Definition

**Fetching keys from nested objects** involves extracting all property names from an object, including those that are nested within child objects. This is a common operation when working with complex data structures, especially in scenarios where you need to analyze, validate, or manipulate deeply nested objects.

### Parameters

#### Get All Keys Function
- `obj`: The object to extract keys from

#### Get Flattened Keys Function
- `obj`: The object to extract keys from
- `prefix` (optional): A string prefix for keys (used in recursion)
- `delimiter` (optional): The character to use as a delimiter in the flattened keys (default: '.')

#### Get Keys By Level Function
- `obj`: The object to extract keys from

#### Get Keys with Path Function
- `obj`: The object to extract keys from
- `delimiter` (optional): The character to use as a delimiter in the paths (default: '.')

### Return Value

- **Get All Keys**: Returns an array containing all keys from the object and its nested objects.
- **Get Flattened Keys**: Returns an array containing all flattened keys from the object using dot notation.
- **Get Keys By Level**: Returns an array of arrays, where each inner array contains keys from a specific nesting level.
- **Get Keys with Path**: Returns an array of objects, each containing a key and its full path.

### Edge Cases to Handle

1. **Input Validation**:
   - Null or undefined inputs
   - Non-object inputs (strings, numbers, etc.)
   - Empty objects

2. **Object Structure**:
   - Deeply nested objects
   - Arrays within objects
   - Objects within arrays
   - Mixed data types

3. **Special Cases**:
   - Circular references
   - Prototype chain properties
   - Non-enumerable properties
   - Symbol keys

4. **Path Generation**:
   - Handling special characters in keys
   - Keys that contain the delimiter character
   - Numeric keys (from arrays)

### Use Cases

1. **Object Analysis**:
   - Inspecting the structure of complex objects
   - Validating object schemas
   - Finding specific properties in nested structures

2. **Data Transformation**:
   - Converting nested objects to flat structures
   - Creating path-based access to nested properties
   - Building property maps for data binding

3. **Form Handling**:
   - Generating form fields from object schemas
   - Validating form data against expected structure
   - Mapping form values to nested object structures

4. **Configuration Management**:
   - Accessing nested configuration properties
   - Validating configuration objects
   - Merging configuration from multiple sources

### Implementation Approaches

#### Recursive Approach

1. **Depth-First Traversal**:
   - Start with the root object
   - For each property, if it's an object, recursively process it
   - Collect keys as you go

2. **Breadth-First Traversal**:
   - Process objects level by level
   - Use a queue to keep track of objects to process
   - Collect keys by level

#### Path Building Approaches

1. **Dot Notation**:
   - Use periods to separate nested keys (e.g., "user.address.city")
   - Simple and widely used in many libraries

2. **Bracket Notation**:
   - Use brackets to represent nested keys (e.g., "user['address']['city']")
   - Handles keys with special characters better

3. **Array Notation for Levels**:
   - Group keys by their nesting level
   - Useful for understanding object depth

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the total number of properties in the object and all its nested objects
- **Space Complexity**: O(n) for storing all the keys, plus O(d) for the recursion stack, where d is the maximum depth of nesting

### Common Interview Questions

1. How would you handle circular references when extracting keys from nested objects?
2. What's the difference between extracting all keys and extracting flattened keys?
3. How would you modify your implementation to include non-enumerable properties?
4. Can you implement a function that not only extracts keys but also their corresponding values?
5. How would you optimize key extraction for very large and deeply nested objects?

### Code Example: Using Different Key Extraction Methods

```javascript
const user = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  hobbies: ['reading', 'coding', 'hiking']
};

// Get all keys
console.log(getAllKeys(user));
// Output: ['name', 'age', 'address', 'street', 'city', 'zip', 'coordinates', 'lat', 'lng', 'hobbies', '0', '1', '2']

// Get flattened keys
console.log(getFlattenedKeys(user));
// Output: ['name', 'age', 'address', 'address.street', 'address.city', 'address.zip', 'address.coordinates', 'address.coordinates.lat', 'address.coordinates.lng', 'hobbies', 'hobbies.0', 'hobbies.1', 'hobbies.2']

// Get keys by level
console.log(getKeysByLevel(user));
// Output: [['name', 'age', 'address', 'hobbies'], ['street', 'city', 'zip', 'coordinates', '0', '1', '2'], ['lat', 'lng']]
