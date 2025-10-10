# Object.assign

`Object.assign()` is a built-in JavaScript method that copies all enumerable own properties from one or more source objects to a target object, and returns the modified target object.

## How It Works

1. The first parameter is the target object that will receive the properties.
2. Subsequent parameters are source objects whose properties will be copied.
3. Properties in the target object with the same key as in the source object will be overwritten.
4. Properties are copied in the order of the source objects - later sources overwrite earlier ones.
5. Only enumerable and own properties are copied.
6. It performs a shallow copy (not deep).

## Use Cases

1. **Object Cloning**: Create a shallow copy of an object.
   ```javascript
   const clone = Object.assign({}, original);
   ```

2. **Merging Objects**: Combine multiple objects into one.
   ```javascript
   const merged = Object.assign({}, obj1, obj2, obj3);
   ```

3. **Default Options**: Set default values that can be overridden.
   ```javascript
   function createWidget(options) {
     const defaults = { size: 'medium', color: 'blue', enabled: true };
     return Object.assign({}, defaults, options);
   }
   ```

4. **Immutable Updates**: Create a new object with updated properties.
   ```javascript
   const updatedUser = Object.assign({}, user, { age: user.age + 1 });
   ```

5. **Adding Properties to Objects**: Add new properties to an existing object.
   ```javascript
   Object.assign(target, { newProp1: 'value1', newProp2: 'value2' });
   ```

## Limitations

1. **Shallow Copy Only**: It only creates a shallow copy, meaning nested objects are copied by reference, not by value.
2. **No Prototype Chain**: Properties from the prototype chain are not copied.
3. **No Non-Enumerable Properties**: Non-enumerable properties are not copied.
4. **No Symbol Properties** (before ES2015): Symbol properties were not copied in earlier implementations.
5. **No Getters/Setters**: It copies property values, not getter/setter functions.

## Custom Implementation

Here's a custom implementation of `Object.assign`:

```javascript
function customAssign(target, ...sources) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  const to = Object(target);

  for (const source of sources) {
    if (source != null) {
      for (const key of Object.keys(source)) {
        to[key] = source[key];
      }
    }
  }

  return to;
}
```

## Explanation of Implementation

1. **Input Validation**: Check if the target is null or undefined, and throw a TypeError if it is.
2. **Target Conversion**: Convert the target to an object using `Object()` constructor.
3. **Source Processing**: Iterate through each source object.
4. **Null Check**: Skip null or undefined source objects.
5. **Property Copying**: For each source, copy all enumerable own properties to the target.
6. **Return**: Return the modified target object.

## Usage Example

```javascript
// Example 1: Cloning an object
const original = { a: 1, b: 2 };
const clone = customAssign({}, original);
console.log(clone); // { a: 1, b: 2 }

// Example 2: Merging objects
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: 3 };
const merged = customAssign({}, obj1, obj2, obj3);
console.log(merged); // { a: 1, b: 2, c: 3 }

// Example 3: Overriding properties
const defaults = { size: 'medium', color: 'blue', enabled: true };
const options = { size: 'large', theme: 'dark' };
const config = customAssign({}, defaults, options);
console.log(config); // { size: 'large', color: 'blue', enabled: true, theme: 'dark' }

// Example 4: Modifying the target object directly
const target = { a: 1, b: 2 };
customAssign(target, { b: 3, c: 4 });
console.log(target); // { a: 1, b: 3, c: 4 }
```

## Differences from Native Object.assign

The custom implementation closely mimics the native `Object.assign`, but there are some differences:

1. The native implementation also copies Symbol properties (in ES2015+).
2. The native implementation may have better performance optimizations.
3. The native implementation handles edge cases that might not be covered in the custom version.
