# Object Introspection / Checks in JavaScript

This document covers implementations of various object introspection and check utility functions in JavaScript.

## 1. Is Empty

Check if an object has no own enumerable properties.

```javascript
/**
 * Checks if an object has no own enumerable properties
 * 
 * @param {Object} obj - The object to check
 * @returns {boolean} - True if the object is empty, false otherwise
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Arrays
 * - Objects with non-enumerable properties
 * - Objects with prototype properties
 * - Objects with Symbol keys
 */
function isEmpty(obj) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return true;
  }
  
  // Check for enumerable string keys
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  
  // Check for Symbol keys (not included in for...in)
  if (Object.getOwnPropertySymbols(obj).length > 0) {
    return false;
  }
  
  return true;
}

/**
 * Alternative implementation using Object.keys()
 * 
 * @param {Object} obj - The object to check
 * @returns {boolean} - True if the object is empty, false otherwise
 */
function isEmptyUsingKeys(obj) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return true;
  }
  
  // Check for enumerable keys
  if (Object.keys(obj).length > 0) {
    return false;
  }
  
  // Check for Symbol keys
  if (Object.getOwnPropertySymbols(obj).length > 0) {
    return false;
  }
  
  return true;
}
```

### Examples

```javascript
// Basic usage
console.log(isEmpty({})); // true
console.log(isEmpty({ a: 1 })); // false
console.log(isEmpty([])); // true (for arrays, checks if length is 0)
console.log(isEmpty([1, 2])); // false

// Edge cases
console.log(isEmpty(null)); // true
console.log(isEmpty(undefined)); // true
console.log(isEmpty(42)); // true
console.log(isEmpty('')); // true

// Non-enumerable properties
const objWithNonEnumerable = {};
Object.defineProperty(objWithNonEnumerable, 'hidden', {
  value: 'secret',
  enumerable: false
});
console.log(isEmpty(objWithNonEnumerable)); // true (non-enumerable properties don't count)

// Symbol keys
const sym = Symbol('key');
const objWithSymbol = { [sym]: 'value' };
console.log(isEmpty(objWithSymbol)); // false (Symbol keys are detected)

// Inherited properties
function Parent() {}
Parent.prototype.inherited = 'value';
const child = new Parent();
console.log(isEmpty(child)); // true (inherited properties don't count)
```

## 2. Is Object

Check if a value is a plain object (not null, not array, not a built-in object type).

```javascript
/**
 * Checks if a value is a plain object (not null, not array, not a built-in object type)
 * 
 * @param {any} value - The value to check
 * @returns {boolean} - True if the value is a plain object, false otherwise
 * 
 * Edge cases handled:
 * - null
 * - Arrays
 * - Built-in object types (Date, RegExp, Map, Set, etc.)
 * - Functions
 * - Primitive values
 */
function isObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  
  // Check if it's an array
  if (Array.isArray(value)) {
    return false;
  }
  
  // Check for plain object (created via object literal or Object.create(null))
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Alternative implementation using Object.prototype.toString
 * 
 * @param {any} value - The value to check
 * @returns {boolean} - True if the value is a plain object, false otherwise
 */
function isObjectUsingToString(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  
  return Object.prototype.toString.call(value) === '[object Object]';
}
```

### Examples

```javascript
// Basic usage
console.log(isObject({})); // true
console.log(isObject({ a: 1 })); // true
console.log(isObject(Object.create(null))); // true (object with null prototype)

// Non-objects
console.log(isObject(null)); // false
console.log(isObject(undefined)); // false
console.log(isObject(42)); // false
console.log(isObject('string')); // false
console.log(isObject(true)); // false
console.log(isObject(Symbol())); // false

// Arrays
console.log(isObject([])); // false
console.log(isObject([1, 2, 3])); // false

// Built-in object types
console.log(isObject(new Date())); // false
console.log(isObject(/regex/)); // false
console.log(isObject(new Map())); // false
console.log(isObject(new Set())); // false
console.log(isObject(new WeakMap())); // false
console.log(isObject(new WeakSet())); // false
console.log(isObject(new String('string'))); // false
console.log(isObject(new Number(42))); // false
console.log(isObject(new Boolean(true))); // false

// Functions
console.log(isObject(function() {})); // false
console.log(isObject(() => {})); // false
console.log(isObject(class {})); // false

// Custom class instances
class MyClass {}
console.log(isObject(new MyClass())); // false (instance of a custom class)
```

## 3. Has Key

Implement a safe version of hasOwnProperty to check if an object has a specific property.

```javascript
/**
 * Safely checks if an object has a specific own property
 * 
 * @param {Object} obj - The object to check
 * @param {string|symbol} key - The property key to check for
 * @returns {boolean} - True if the object has the property, false otherwise
 * 
 * Edge cases handled:
 * - Non-object inputs
 * - Objects with no prototype
 * - Objects with overridden hasOwnProperty
 * - Symbol keys
 */
function hasKey(obj, key) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  // Use Object.prototype.hasOwnProperty.call for safety
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Alternative implementation using Object.hasOwn (ES2022)
 * 
 * @param {Object} obj - The object to check
 * @param {string|symbol} key - The property key to check for
 * @returns {boolean} - True if the object has the property, false otherwise
 */
function hasKeyUsingHasOwn(obj, key) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  // Use Object.hasOwn (more modern approach)
  return Object.hasOwn(obj, key);
}

/**
 * Alternative implementation using Object.getOwnPropertyDescriptor
 * 
 * @param {Object} obj - The object to check
 * @param {string|symbol} key - The property key to check for
 * @returns {boolean} - True if the object has the property, false otherwise
 */
function hasKeyUsingDescriptor(obj, key) {
  // Handle non-object inputs
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  // Check if the property has a descriptor
  return Object.getOwnPropertyDescriptor(obj, key) !== undefined;
}
```

### Examples

```javascript
// Basic usage
const obj = { a: 1, b: 2, c: undefined };
console.log(hasKey(obj, 'a')); // true
console.log(hasKey(obj, 'b')); // true
console.log(hasKey(obj, 'c')); // true (property exists with undefined value)
console.log(hasKey(obj, 'd')); // false

// Edge cases
console.log(hasKey(null, 'a')); // false
console.log(hasKey(undefined, 'a')); // false
console.log(hasKey(42, 'a')); // false
console.log(hasKey('string', 'a')); // false

// Object with no prototype
const noProto = Object.create(null);
noProto.a = 1;
console.log(hasKey(noProto, 'a')); // true
console.log(hasKey(noProto, 'toString')); // false

// Object with overridden hasOwnProperty
const evil = {
  hasOwnProperty: function() { return true; },
  a: 1
};
console.log(hasKey(evil, 'b')); // false (our function is safe)
console.log(evil.hasOwnProperty('b')); // true (would give incorrect result)

// Symbol keys
const sym = Symbol('key');
const objWithSymbol = { [sym]: 'value' };
console.log(hasKey(objWithSymbol, sym)); // true

// Inherited properties
function Parent() {}
Parent.prototype.inherited = 'value';
const child = new Parent();
child.own = 'own value';
console.log(hasKey(child, 'own')); // true
console.log(hasKey(child, 'inherited')); // false (inherited properties don't count)
console.log('inherited' in child); // true (in operator would return true)
```

## Bonus: Type Checking Utilities

Here are some additional utility functions for more specific type checking:

```javascript
/**
 * Comprehensive type checking utilities
 */
const typeChecks = {
  /**
   * Checks if a value is undefined
   */
  isUndefined: value => typeof value === 'undefined',
  
  /**
   * Checks if a value is null
   */
  isNull: value => value === null,
  
  /**
   * Checks if a value is null or undefined
   */
  isNullOrUndefined: value => value === null || typeof value === 'undefined',
  
  /**
   * Checks if a value is a boolean
   */
  isBoolean: value => typeof value === 'boolean',
  
  /**
   * Checks if a value is a number (but not NaN)
   */
  isNumber: value => typeof value === 'number' && !Number.isNaN(value),
  
  /**
   * Checks if a value is a string
   */
  isString: value => typeof value === 'string',
  
  /**
   * Checks if a value is a symbol
   */
  isSymbol: value => typeof value === 'symbol',
  
  /**
   * Checks if a value is a function
   */
  isFunction: value => typeof value === 'function',
  
  /**
   * Checks if a value is an array
   */
  isArray: value => Array.isArray(value),
  
  /**
   * Checks if a value is a date
   */
  isDate: value => value instanceof Date && !isNaN(value),
  
  /**
   * Checks if a value is a regular expression
   */
  isRegExp: value => value instanceof RegExp,
  
  /**
   * Checks if a value is a Map
   */
  isMap: value => value instanceof Map,
  
  /**
   * Checks if a value is a Set
   */
  isSet: value => value instanceof Set,
  
  /**
   * Checks if a value is a WeakMap
   */
  isWeakMap: value => value instanceof WeakMap,
  
  /**
   * Checks if a value is a WeakSet
   */
  isWeakSet: value => value instanceof WeakSet,
  
  /**
   * Checks if a value is a primitive
   */
  isPrimitive: value => {
    const type = typeof value;
    return value === null || 
           type === 'undefined' || 
           type === 'string' || 
           type === 'number' || 
           type === 'boolean' || 
           type === 'symbol';
  },
  
  /**
   * Checks if a value is a plain object
   */
  isPlainObject: value => {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  },
  
  /**
   * Gets the detailed type of a value
   */
  getType: value => {
    if (value === null) return 'null';
    if (typeof value !== 'object') return typeof value;
    
    const typeString = Object.prototype.toString.call(value);
    return typeString.slice(8, -1).toLowerCase();
  }
};
```

### Examples

```javascript
// Using the type checking utilities
console.log(typeChecks.isUndefined(undefined)); // true
console.log(typeChecks.isNull(null)); // true
console.log(typeChecks.isNullOrUndefined(null)); // true
console.log(typeChecks.isNullOrUndefined(undefined)); // true
console.log(typeChecks.isBoolean(true)); // true
console.log(typeChecks.isNumber(42)); // true
console.log(typeChecks.isNumber(NaN)); // false
console.log(typeChecks.isString('hello')); // true
console.log(typeChecks.isSymbol(Symbol())); // true
console.log(typeChecks.isFunction(() => {})); // true
console.log(typeChecks.isArray([1, 2, 3])); // true
console.log(typeChecks.isDate(new Date())); // true
console.log(typeChecks.isRegExp(/test/)); // true
console.log(typeChecks.isMap(new Map())); // true
console.log(typeChecks.isSet(new Set())); // true
console.log(typeChecks.isPrimitive(42)); // true
console.log(typeChecks.isPrimitive({})); // false
console.log(typeChecks.isPlainObject({})); // true
console.log(typeChecks.isPlainObject(new Date())); // false

// Get detailed type
console.log(typeChecks.getType({})); // 'object'
console.log(typeChecks.getType([])); // 'array'
console.log(typeChecks.getType(new Date())); // 'date'
console.log(typeChecks.getType(null)); // 'null'
console.log(typeChecks.getType(undefined)); // 'undefined'
console.log(typeChecks.getType(() => {})); // 'function'
console.log(typeChecks.getType(new Map())); // 'map'
