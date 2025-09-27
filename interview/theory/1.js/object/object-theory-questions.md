# 📘 Theory Questions on Objects (Topic-wise)

## 1️⃣ Equality (deep/shallow)

### Easy

#### What's the difference between == and === in JavaScript?

**Answer:**
- `==` (loose equality) performs type coercion before comparison. It converts operands to the same type and then compares them.
- `===` (strict equality) compares both value and type without any type conversion.

**Example:**
```javascript
console.log(5 == "5");    // true (string "5" is coerced to number 5)
console.log(5 === "5");   // false (different types: number vs string)
console.log(null == undefined);  // true (special case in the spec)
console.log(null === undefined); // false (different types)
```

**Interview Insight:** Understanding this distinction is fundamental as it affects code behavior and can lead to subtle bugs. Always prefer `===` for predictable comparisons unless you specifically need type coercion.

#### Why does {} === {} evaluate to false?

**Answer:**
Objects in JavaScript are compared by reference, not by structure. When you create two object literals, they are stored in different memory locations, so they have different references.

**Example:**
```javascript
const obj1 = {};
const obj2 = {};
console.log(obj1 === obj2); // false (different references)

const obj3 = obj1;
console.log(obj1 === obj3); // true (same reference)
```

**Interview Insight:** This behavior is crucial to understand when working with complex data structures. It explains why direct object comparisons often don't work as expected and why you need specialized functions for structural equality checks.

#### What is shallow equality vs deep equality?

**Answer:**
- **Shallow equality:** Compares only the immediate properties of objects (first level). For nested objects, it compares references, not content.
- **Deep equality:** Recursively compares all nested properties and their values throughout the entire object structure.

**Example:**
```javascript
// Shallow equality check
function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

const a = { name: "John", address: { city: "New York" } };
const b = { name: "John", address: { city: "New York" } };
const c = { name: "John", address: a.address };

console.log(shallowEqual(a, b)); // false (address objects have different references)
console.log(shallowEqual(a, c)); // true (address objects have the same reference)
```

**Interview Insight:** Choosing between shallow and deep equality depends on your use case. Shallow equality is faster but may miss differences in nested structures, while deep equality is thorough but more computationally expensive.

### Medium

#### Why can't JSON.stringify always be used for deep equality checks?

**Answer:**
While `JSON.stringify` can be used for simple deep equality checks, it has several limitations:

1. It doesn't handle circular references (throws an error)
2. It ignores functions and undefined values
3. It converts special values like `NaN` and `Infinity` to `null`
4. It doesn't preserve object types like `Date`, `Map`, `Set` (converts them to strings or objects)
5. The order of properties in the resulting string can affect comparison results

**Example:**
```javascript
// Problematic cases for JSON.stringify comparison
const obj1 = { a: undefined, b: function() {}, c: Symbol(), d: NaN };
const obj2 = { b: function() {}, a: undefined, c: Symbol(), d: NaN };

// Both stringify to "{}" despite having properties
console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // true, but objects aren't empty!

// Order matters in JSON.stringify
const obj3 = { a: 1, b: 2 };
const obj4 = { b: 2, a: 1 };
console.log(JSON.stringify(obj3) === JSON.stringify(obj4)); // false, despite having same content

// Circular references
const circular = {};
circular.self = circular;
try {
  JSON.stringify(circular); // Throws: TypeError: Converting circular structure to JSON
} catch (e) {
  console.log("Circular references cause errors");
}
```

**Interview Insight:** Understanding these limitations shows your deep knowledge of JavaScript's object system and demonstrates awareness of edge cases in real-world applications.

#### How are NaN, null, undefined treated in object comparisons?

**Answer:**
- **NaN:** Not equal to anything, including itself (`NaN !== NaN`). In objects, two `NaN` properties won't be considered equal in direct comparisons.
- **null:** Only equal to itself and undefined when using `==`. With `===`, it's only equal to itself.
- **undefined:** Similar to null, but represents an uninitialized value. Properties set to undefined are still considered "owned" by the object.

**Example:**
```javascript
// NaN behavior
const obj1 = { value: NaN };
const obj2 = { value: NaN };
console.log(obj1.value === obj2.value); // false
console.log(Object.is(obj1.value, obj2.value)); // true (Object.is handles NaN correctly)

// null and undefined
const obj3 = { a: null };
const obj4 = { a: undefined };
const obj5 = {};
console.log(obj3.a == obj4.a);  // true (with loose equality)
console.log(obj3.a === obj4.a); // false (with strict equality)
console.log(obj4.a === obj5.a); // true (accessing non-existent property returns undefined)
console.log('a' in obj4);       // true (property exists but is undefined)
console.log('a' in obj5);       // false (property doesn't exist)
```

**Interview Insight:** Handling these special values correctly demonstrates attention to detail and understanding of JavaScript's equality quirks, which is essential for writing robust code.

### Hard

#### How would you design a deepEqual function that handles arrays, dates, and circular references?

**Answer:**
A robust `deepEqual` function needs to:
1. Handle primitive types directly
2. Compare objects by structure, not reference
3. Handle special cases like `Date`, `RegExp`, arrays
4. Detect and handle circular references
5. Compare `NaN` values correctly

**Implementation:**
```javascript
function deepEqual(a, b, visited = new Map()) {
  // Handle primitive types and simple cases
  if (Object.is(a, b)) return true;
  
  // If either isn't an object or is null
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  
  // Handle circular references
  if (visited.has(a)) {
    return visited.get(a) === b;
  }
  visited.set(a, b);
  
  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  // Handle regular expressions
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }
  
  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], visited)) return false;
    }
    return true;
  }
  
  // Handle Maps
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !deepEqual(value, b.get(key), visited)) return false;
    }
    return true;
  }
  
  // Handle Sets
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }
  
  // Handle plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key], visited)) return false;
  }
  
  return true;
}
```

**Interview Insight:** This implementation showcases advanced JavaScript knowledge, including handling of edge cases, understanding of different object types, and efficient algorithm design with circular reference detection.

#### What's the difference between structural equality and referential equality?

**Answer:**
- **Referential equality:** Checks if two variables reference the exact same object in memory. In JavaScript, this is checked with `===` for objects.
- **Structural equality:** Checks if two objects have the same structure (same properties with the same values), regardless of whether they're the same object in memory.

**Example:**
```javascript
// Referential equality
const obj1 = { name: "Alice" };
const obj2 = obj1;
const obj3 = { name: "Alice" };

console.log(obj1 === obj2); // true (referential equality - same object)
console.log(obj1 === obj3); // false (different objects in memory)

// Structural equality (using our deepEqual function)
console.log(deepEqual(obj1, obj3)); // true (structurally identical)

// Real-world example: React's memo and useMemo rely on referential equality
// for performance optimizations, which is why immutable updates are important
```

**Interview Insight:** Understanding this distinction is crucial for optimizing React applications (where referential equality is used for memoization) and for implementing proper state management in frameworks like Redux that rely on immutability patterns.

## 2️⃣ Copying (deep/shallow)

### Easy

#### What's the difference between reference copy, shallow copy, and deep copy?

**Answer:**
- **Reference copy:** Creates a new variable that points to the same object in memory. Changes to either variable affect the same object.
- **Shallow copy:** Creates a new object with copies of the top-level properties, but nested objects are still shared references.
- **Deep copy:** Creates a completely independent clone with all nested objects and properties copied recursively.

**Example:**
```javascript
// Reference copy
const original = { name: "John", address: { city: "New York" } };
const referenceCopy = original;
referenceCopy.name = "Jane";
console.log(original.name); // "Jane" (original is affected)

// Shallow copy
const shallowCopy = { ...original };
shallowCopy.name = "Alice";
shallowCopy.address.city = "Boston";
console.log(original.name); // "Jane" (top-level property unaffected)
console.log(original.address.city); // "Boston" (nested object affected)

// Deep copy
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.address.city = "Chicago";
console.log(original.address.city); // "Boston" (nested object unaffected)
```

**Interview Insight:** Understanding these copying mechanisms is essential for avoiding unintended side effects, especially in state management where immutability is important.

#### What happens when you copy an object with =?

**Answer:**
When you use the assignment operator (`=`) with objects, you create a reference copy, not a new object. Both variables will point to the same object in memory, so changes made through either variable will affect the same underlying object.

**Example:**
```javascript
const user = { name: "John", age: 30 };
const userCopy = user; // Reference copy

// Modifying through the copy affects the original
userCopy.age = 31;
console.log(user.age); // 31

// Adding properties through either variable affects both
user.location = "New York";
console.log(userCopy.location); // "New York"

// Reassigning the entire object doesn't affect the other variable
userCopy = { name: "Jane", age: 25 }; // This would cause an error with const
// If userCopy was declared with let:
// console.log(user.name); // Still "John"
```

**Interview Insight:** This behavior is a common source of bugs for developers new to JavaScript. Understanding reference vs. value semantics is crucial for writing predictable code, especially when working with complex state management.

### Medium

#### Explain how {...obj} or Object.assign({}, obj) performs a shallow copy.

**Answer:**
Both the spread operator (`{...obj}`) and `Object.assign({}, obj)` create a new object and copy all enumerable own properties from the source object to the new object. However, they only copy property references for nested objects, not the objects themselves.

**Example:**
```javascript
const original = {
  name: "John",
  age: 30,
  address: { city: "New York", zip: "10001" },
  hobbies: ["reading", "swimming"]
};

// Using spread operator
const spreadCopy = { ...original };

// Using Object.assign
const assignCopy = Object.assign({}, original);

// Both create shallow copies
spreadCopy.name = "Jane"; // Doesn't affect original
spreadCopy.address.city = "Boston"; // Affects original!
console.log(original.name); // "John"
console.log(original.address.city); // "Boston"

// Same behavior with Object.assign
assignCopy.age = 25; // Doesn't affect original
assignCopy.hobbies.push("running"); // Affects original!
console.log(original.age); // 30
console.log(original.hobbies); // ["reading", "swimming", "running"]
```

**Key points:**
1. Both methods create a new object at the top level
2. Primitive values are copied by value
3. Object references (including arrays) are copied by reference
4. Only enumerable own properties are copied
5. Both have similar performance characteristics

**Interview Insight:** Understanding the limitations of shallow copying is crucial for state management in applications. This knowledge helps prevent bugs related to unintentional mutations of nested data structures.

#### Why does JSON.parse(JSON.stringify(obj)) fail for certain object types (like Date, Map, Set)?

**Answer:**
`JSON.parse(JSON.stringify(obj))` is a common technique for deep copying, but it has significant limitations because the JSON format only supports a subset of JavaScript data types:

1. **Date objects** are converted to strings and lose their methods and type
2. **Maps and Sets** are not supported in JSON and become empty objects (`{}`)
3. **Functions** are completely lost (converted to `undefined` and then omitted)
4. **Symbol properties** are ignored
5. **Undefined values** are converted to `null` or omitted from objects
6. **Circular references** cause errors
7. **RegExp objects** become empty objects
8. **Infinity, NaN** become `null`
9. **Typed arrays** (like `Uint8Array`) lose their type information

**Example:**
```javascript
const original = {
  date: new Date(),
  map: new Map([["key", "value"]]),
  set: new Set([1, 2, 3]),
  func: function() { return "hello"; },
  symbol: Symbol("test"),
  regex: /test/g,
  undef: undefined,
  nan: NaN,
  inf: Infinity,
  typedArray: new Uint8Array([1, 2, 3])
};

const copy = JSON.parse(JSON.stringify(original));

console.log(copy.date); // String like "2023-09-27T09:30:00.000Z" (not a Date object)
console.log(copy.map); // {} (empty object)
console.log(copy.set); // {} (empty object)
console.log(copy.func); // undefined
console.log(copy.symbol); // undefined
console.log(copy.regex); // {} (empty object)
console.log(copy.undef); // undefined (property is missing)
console.log(copy.nan); // null
console.log(copy.inf); // null
console.log(copy.typedArray); // {} (empty object)

// Trying to use methods on the copied date will fail
try {
  copy.date.getFullYear();
} catch (e) {
  console.log("Error: copy.date is a string, not a Date object");
}
```

**Interview Insight:** Understanding these limitations demonstrates deep knowledge of JavaScript's type system and serialization. It shows you know when to use specialized deep cloning libraries or custom solutions for complex objects.

### Hard

#### How would you implement a safe deep copy that supports functions, Dates, Maps, Sets, and circular references?

**Answer:**
A robust deep copy implementation needs to handle various JavaScript types and edge cases:

```javascript
function deepCopy(obj, visited = new Map()) {
  // Handle primitive types and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Arrays
  if (Array.isArray(obj)) {
    const copy = [];
    visited.set(obj, copy);
    
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i], visited);
    }
    
    return copy;
  }
  
  // Handle Maps
  if (obj instanceof Map) {
    const copy = new Map();
    visited.set(obj, copy);
    
    obj.forEach((value, key) => {
      copy.set(deepCopy(key, visited), deepCopy(value, visited));
    });
    
    return copy;
  }
  
  // Handle Sets
  if (obj instanceof Set) {
    const copy = new Set();
    visited.set(obj, copy);
    
    obj.forEach(value => {
      copy.add(deepCopy(value, visited));
    });
    
    return copy;
  }
  
  // Handle typed arrays
  if (ArrayBuffer.isView(obj) && !(obj instanceof DataView)) {
    const copy = new obj.constructor(obj.length);
    visited.set(obj, copy);
    copy.set(new Uint8Array(obj.buffer));
    return copy;
  }
  
  // Handle plain objects
  const copy = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, copy);
  
  // Copy all properties, including non-enumerable ones
  const props = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
  
  for (const prop of props) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    
    // Handle getters/setters
    if (descriptor.get || descriptor.set) {
      Object.defineProperty(copy, prop, descriptor);
    } else {
      // Deep copy the property value
      descriptor.value = deepCopy(descriptor.value, visited);
      Object.defineProperty(copy, prop, descriptor);
    }
  }
  
  return copy;
}
```

**Key features:**
1. Handles circular references using a Map to track visited objects
2. Preserves object types (Date, RegExp, Map, Set, etc.)
3. Copies non-enumerable properties and Symbol keys
4. Preserves property descriptors and getters/setters
5. Handles typed arrays correctly

**Interview Insight:** This implementation demonstrates advanced JavaScript knowledge, including understanding of the object model, descriptors, various built-in types, and efficient handling of edge cases. It shows you can build robust utilities that go beyond the limitations of built-in methods.

#### What are some real-world cases where shallow copy is sufficient vs deep copy is required?

**Answer:**

**Shallow Copy Sufficient:**
1. **Simple data structures:** When objects contain only primitive values at the top level.
2. **Performance-critical code:** When deep copying would be too expensive and you can ensure no nested mutations.
3. **Immutable data patterns:** When following immutable update patterns where you only modify the parts that change.
4. **UI state updates:** For simple UI state changes where you only need to update top-level properties.
5. **Caching:** When you need a quick snapshot of an object's current state but don't need to track future changes.

**Example:**
```javascript
// Redux-style immutable update (shallow copy is sufficient)
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_USER_NAME':
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload
        }
      };
    default:
      return state;
  }
}
```

**Deep Copy Required:**
1. **Storing object history:** When you need to preserve the exact state of an object at different points in time.
2. **Isolating shared data:** When multiple components need their own independent copy of data.
3. **Undo/redo functionality:** When implementing features that require reverting to previous states.
4. **Avoiding side effects:** When passing objects to untrusted code that might modify them.
5. **Complex form state:** When dealing with deeply nested form data that users can modify.

**Example:**
```javascript
// Form editor with undo history (needs deep copy)
class FormEditor {
  constructor(initialData) {
    this.currentData = initialData;
    this.history = [deepCopy(initialData)];
    this.position = 0;
  }
  
  updateField(path, value) {
    // Create a deep copy to avoid modifying history
    const newData = deepCopy(this.currentData);
    
    // Update the field at the specified path
    let current = newData;
    const parts = path.split('.');
    const last = parts.pop();
    
    for (const part of parts) {
      current = current[part];
    }
    
    current[last] = value;
    this.currentData = newData;
    
    // Add to history (truncating any forward history)
    this.history = this.history.slice(0, this.position + 1);
    this.history.push(deepCopy(newData));
    this.position++;
  }
  
  undo() {
    if (this.position > 0) {
      this.position--;
      this.currentData = deepCopy(this.history[this.position]);
      return this.currentData;
    }
    return null;
  }
  
  redo() {
    if (this.position < this.history.length - 1) {
      this.position++;
      this.currentData = deepCopy(this.history[this.position]);
      return this.currentData;
    }
    return null;
  }
}
```

**Interview Insight:** Understanding when each copying strategy is appropriate demonstrates practical experience with real-world applications. It shows you can make performance vs. correctness tradeoffs and understand the implications of your choices in different scenarios.

## 3️⃣ Descriptors / Freezing

### Easy

#### What is the difference between data descriptors and accessor descriptors?

**Answer:**
Property descriptors in JavaScript define how properties behave and can be of two types:

1. **Data descriptors:** Define a property with a value that can be read and optionally written.
   - Key attributes: `value`, `writable`, `enumerable`, `configurable`

2. **Accessor descriptors:** Define a property with getter/setter functions.
   - Key attributes: `get`, `set`, `enumerable`, `configurable`
   - Cannot have `value` or `writable` attributes

**Example:**
```javascript
const person = {};

// Data descriptor
Object.defineProperty(person, 'name', {
  value: 'John',
  writable: true,      // Can be changed
  enumerable: true,    // Shows up in for...in loops
  configurable: true   // Can be deleted or modified
});

// Accessor descriptor
Object.defineProperty(person, 'fullName', {
  get() {
    return `${this.name} ${this.lastName || ''}`;
  },
  set(value) {
    [this.name, this.lastName] = value.split(' ');
  },
  enumerable: true,
  configurable: true
});

person.fullName = 'Jane Doe';
console.log(person.name); // "Jane"
console.log(person.lastName); // "Doe"
console.log(person.fullName); // "Jane Doe"
```

**Interview Insight:** Understanding property descriptors demonstrates knowledge of JavaScript's object model beyond just basic property access. It's essential for creating robust APIs, implementing encapsulation patterns, and understanding how JavaScript libraries implement features like computed properties.

#### What does enumerable: false mean?

**Answer:**
The `enumerable` attribute controls whether a property appears in certain enumeration operations:

- When `enumerable: false`, the property:
  1. Won't appear in `for...in` loops
  2. Won't be included in `Object.keys()` results
  3. Won't be copied by `Object.assign()` or spread operators
  4. Won't show up in JSON.stringify() output

- However, the property is still accessible directly by name and will appear in `Object.getOwnPropertyNames()` results.

**Example:**
```javascript
const user = {};

Object.defineProperty(user, 'name', {
  value: 'John',
  enumerable: true
});

Object.defineProperty(user, 'password', {
  value: 'secret123',
  enumerable: false // Hidden from enumeration
});

console.log(user.password); // "secret123" (still accessible directly)
console.log(Object.keys(user)); // ["name"] (password is hidden)

for (const key in user) {
  console.log(key); // Only logs "name"
}

console.log(JSON.stringify(user)); // {"name":"John"} (password is hidden)
console.log(Object.getOwnPropertyNames(user)); // ["name", "password"] (includes non-enumerable)
```

**Interview Insight:** Understanding enumerable properties is important for creating secure objects, implementing "private" properties (pre-ES2022), and understanding how built-in objects work (many native methods are non-enumerable). It's a key concept for library authors and for working with JavaScript's object model effectively.

### Medium

#### Difference between Object.freeze, Object.seal, and Object.preventExtensions.

**Answer:**
These methods provide different levels of object immutability:

1. **Object.preventExtensions(obj)**
   - Prevents adding new properties
   - Existing properties can still be modified or deleted
   - `Object.isExtensible(obj)` returns `false`

2. **Object.seal(obj)**
   - Prevents adding new properties
   - Prevents deleting existing properties (sets `configurable: false` on all properties)
   - Existing property values can still be changed
   - `Object.isSealed(obj)` returns `true`

3. **Object.freeze(obj)**
   - Does everything `Object.seal()` does
   - Also prevents modifying values of existing properties (sets `writable: false` on all properties)
   - Most restrictive option - creates a truly immutable object (at the top level)
   - `Object.isFrozen(obj)` returns `true`

**Example:**
```javascript
// preventExtensions
const user1 = { name: 'John' };
Object.preventExtensions(user1);
user1.name = 'Jane'; // ✓ Can modify existing properties
delete user1.name;   // ✓ Can delete properties
user1.age = 30;      // ✗ Cannot add new properties (silently fails in non-strict mode)
console.log(user1);  // { name: 'Jane' }

// seal
const user2 = { name: 'John' };
Object.seal(user2);
user2.name = 'Jane'; // ✓ Can modify existing properties
delete user2.name;   // ✗ Cannot delete properties (silently fails in non-strict mode)
user2.age = 30;      // ✗ Cannot add new properties
console.log(user2);  // { name: 'Jane' }

// freeze
const user3 = { name: 'John' };
Object.freeze(user3);
user3.name = 'Jane'; // ✗ Cannot modify properties (silently fails in non-strict mode)
delete user3.name;   // ✗ Cannot delete properties
user3.age = 30;      // ✗ Cannot add new properties
console.log(user3);  // { name: 'John' }
```

**Important note:** All three methods are shallow - they only affect the top-level properties of the object. Nested objects can still be modified unless they are also frozen/sealed.

**Interview Insight:** Understanding these immutability methods demonstrates knowledge of JavaScript's object security features. It's particularly relevant for creating constants, preventing API objects from being tampered with, and implementing defensive programming techniques.

#### How to check if an object is extensible?

**Answer:**
JavaScript provides built-in methods to check the extensibility status of objects:

1. **Object.isExtensible(obj)**: Returns `true` if new properties can be added to the object, `false` otherwise.
2. **Object.isSealed(obj)**: Returns `true` if the object is sealed (non-extensible and properties non-configurable).
3. **Object.isFrozen(obj)**: Returns `true` if the object is frozen (sealed and properties non-writable).

**Example:**
```javascript
const normalObj = { a: 1 };
console.log(Object.isExtensible(normalObj)); // true
console.log(Object.isSealed(normalObj));     // false
console.log(Object.isFrozen(normalObj));     // false

const preventedObj = { b: 2 };
Object.preventExtensions(preventedObj);
console.log(Object.isExtensible(preventedObj)); // false
console.log(Object.isSealed(preventedObj));     // false (properties still configurable)
console.log(Object.isFrozen(preventedObj));     // false (properties still writable)

const sealedObj = { c: 3 };
Object.seal(sealedObj);
console.log(Object.isExtensible(sealedObj)); // false
console.log(Object.isSealed(sealedObj));     // true
console.log(Object.isFrozen(sealedObj));     // false (properties still writable)

const frozenObj = { d: 4 };
Object.freeze(frozenObj);
console.log(Object.isExtensible(frozenObj)); // false
console.log(Object.isSealed(frozenObj));     // true
console.log(Object.isFrozen(frozenObj));     // true
```

**Interview Insight:** These methods are useful for defensive programming, especially when working with objects from untrusted sources or when implementing libraries that need to ensure object integrity. Understanding them shows you're familiar with JavaScript's object security model.

### Hard

#### What happens if you try to freeze an object that contains nested objects?

**Answer:**
`Object.freeze()` is shallow - it only freezes the top-level properties of an object. Nested objects remain mutable unless explicitly frozen as well.

**Example:**
```javascript
const user = {
  name: 'John',
  address: {
    city: 'New York',
    zip: '10001'
  },
  hobbies: ['reading', 'swimming']
};

Object.freeze(user);

// Top-level properties are frozen
user.name = 'Jane'; // Fails silently (or throws in strict mode)
console.log(user.name); // Still "John"

// But nested objects can still be modified
user.address.city = 'Boston'; // Works!
console.log(user.address.city); //
