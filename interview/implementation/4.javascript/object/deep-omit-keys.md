# Deep Omit Keys

The `deepOmit` function is used to create a deep clone of an object while omitting specific keys at any level of nesting.

## Implementation

```javascript
const deepOmit = (obj, keys) => {
    if (typeof obj != 'object' || obj == null) return obj;
    const clone = Array.isArray(obj) ? [] : {};
    
    Object.keys(obj).forEach(key => {
        if (!keys.includes(key))
            clone[key] = deepOmit(obj[key], keys);
    });
    
    return clone;
}
```

## Explanation

1. **Base Case**: If the input is not an object or is null, return it as is.
2. **Clone Initialization**: Create an empty array or object based on the input type.
3. **Recursive Cloning**: For each key in the original object:
   - Check if the key is in the list of keys to omit
   - If not, recursively apply `deepOmit` to the value and add it to the clone
4. **Return**: Return the cloned object with specified keys omitted at all levels.

## Relation to Deep Clone

This function is a modification of the `deepClone` function. The main differences are:

1. **Key Filtering**: `deepOmit` adds logic to skip keys that should be omitted.
2. **Selective Copying**: Instead of copying all properties, it only copies those not in the exclusion list.

## Potential Modifications

Interviewers might ask for these modifications:

1. **Selective Depth Omission**: Add a parameter to specify at which depth levels the keys should be omitted.
   ```javascript
   const deepOmit = (obj, keys, depth = Infinity, currentDepth = 0) => {
       // Implementation with depth control
   }
   ```

2. **Path-Based Omission**: Allow specifying nested paths to omit (e.g., `user.address.street`).
   ```javascript
   const deepOmit = (obj, paths) => {
       // Implementation with path parsing
   }
   ```

3. **Type-Based Omission**: Omit keys only if their values are of specific types.
   ```javascript
   const deepOmit = (obj, keys, types) => {
       // Implementation with type checking
   }
   ```

4. **Callback Filter**: Use a callback function to determine whether to omit a key.
   ```javascript
   const deepOmit = (obj, filterFn) => {
       // Implementation using filter function
   }
   ```

5. **Handling Circular References**: Add logic to handle circular references in the object.
   ```javascript
   const deepOmit = (obj, keys, seen = new WeakMap()) => {
       // Implementation with circular reference detection
   }
   ```

## Usage Example

```javascript
const user = {
    id: 1,
    name: 'John',
    password: 'secret123',
    address: {
        street: '123 Main St',
        city: 'Boston',
        zip: '02108',
        coordinates: {
            lat: 42.3601,
            lng: -71.0589,
            _id: 'coord-1'
        }
    },
    _id: 'user-1'
};

// Omit sensitive or internal fields
const sanitizedUser = deepOmit(user, ['password', '_id']);
console.log(sanitizedUser);
/*
{
    id: 1,
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'Boston',
        zip: '02108',
        coordinates: {
            lat: 42.3601,
            lng: -71.0589
        }
    }
}
*/
