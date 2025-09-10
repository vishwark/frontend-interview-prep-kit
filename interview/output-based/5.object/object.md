# JavaScript Objects

## What are JavaScript Objects?

In JavaScript, an object is a collection of key-value pairs where keys are strings (or Symbols) and values can be any data type, including other objects. Objects are one of the fundamental data structures in JavaScript and are used to store and organize data.

### Closely Related Concepts
- **Object Literals**: Creating objects using the `{}` syntax
- **Constructor Functions**: Creating objects using functions with the `new` keyword
- **Prototypes and Inheritance**: Objects inherit properties and methods from their prototypes
- **Object Methods**: Built-in methods like `Object.keys()`, `Object.values()`, `Object.entries()`
- **Property Descriptors**: Configuring property attributes like writable, enumerable, configurable
- **Object Mutation**: Adding, modifying, or deleting properties
- **Object Comparison**: Comparing objects by reference vs. comparing their properties
- **Object Destructuring**: Extracting properties from objects into variables
- **Spread Operator**: Copying or merging objects
- **Object Freezing/Sealing**: Controlling object mutability with `Object.freeze()` and `Object.seal()`

## Common Scenarios Where Developers Get Tricked

1. **Reference vs. Value**: Objects are passed by reference, not by value, leading to unexpected mutations.

2. **Property Access**: Accessing non-existent properties returns `undefined` rather than throwing an error.

3. **Property Deletion**: The `delete` operator removes a property but doesn't affect the prototype chain.

4. **Object Comparison**: Objects are compared by reference, not by their content.

5. **Object Copying**: Shallow copying vs. deep copying of nested objects.

6. **Property Enumeration**: Not all properties are enumerable, and the order of enumeration can be tricky.

7. **Prototype Chain**: Properties from the prototype chain can be accessed but not always visible in iterations.

8. **Object Methods**: Methods like `Object.keys()` only return own enumerable properties.

9. **Object Mutation**: Unexpected side effects when modifying objects passed to functions.

10. **Property Descriptors**: Default property attributes can lead to unexpected behavior.

---

## Code Snippets

### Simple Examples

#### Example 1: Object Creation and Property Access

```javascript
const user = {
  name: "John",
  age: 30,
  isAdmin: false
};

console.log(user.name);
console.log(user["age"]);
console.log(user.job);
```

**Output:**
```
John
30
undefined
```

**Explanation:** Objects can be created using object literals `{}`. Properties can be accessed using dot notation (`object.property`) or bracket notation (`object["property"]`). Accessing a non-existent property returns `undefined`.

#### Example 2: Object Mutation

```javascript
const user = {
  name: "John",
  age: 30
};

user.age = 31;
user.job = "Developer";
delete user.name;

console.log(user);
```

**Output:**
```
{ age: 31, job: 'Developer' }
```

**Explanation:** Objects in JavaScript are mutable. You can add new properties, modify existing ones, and delete properties using the `delete` operator.

#### Example 3: Object Reference

```javascript
const obj1 = { value: 10 };
const obj2 = obj1;

obj2.value = 20;

console.log(obj1.value);
console.log(obj2.value);
```

**Output:**
```
20
20
```

**Explanation:** Objects are passed by reference. When you assign an object to a new variable, both variables reference the same object in memory. Changes made through one reference affect the object accessed through all references.

#### Example 4: Object Comparison

```javascript
const obj1 = { value: 10 };
const obj2 = { value: 10 };
const obj3 = obj1;

console.log(obj1 === obj2);
console.log(obj1 === obj3);
```

**Output:**
```
false
true
```

**Explanation:** Objects are compared by reference, not by their content. Even though `obj1` and `obj2` have the same properties and values, they are different objects in memory. `obj1` and `obj3` reference the same object, so they are equal.

#### Example 5: Object Methods

```javascript
const user = {
  name: "John",
  greet: function() {
    return `Hello, my name is ${this.name}`;
  }
};

console.log(user.greet());
```

**Output:**
```
Hello, my name is John
```

**Explanation:** Objects can contain methods (functions as properties). Inside a method, `this` refers to the object the method was called on.

#### Example 6: Object Property Shorthand

```javascript
const name = "John";
const age = 30;

const user = {
  name,
  age,
  isAdmin: false
};

console.log(user);
```

**Output:**
```
{ name: 'John', age: 30, isAdmin: false }
```

**Explanation:** When creating an object, if a property name is the same as a variable name, you can use the shorthand syntax. `name` is equivalent to `name: name`.

#### Example 7: Computed Property Names

```javascript
const propName = "age";
const user = {
  name: "John",
  [propName]: 30,
  ["is" + "Admin"]: false
};

console.log(user);
```

**Output:**
```
{ name: 'John', age: 30, isAdmin: false }
```

**Explanation:** You can use square brackets `[]` to compute property names dynamically. The expression inside the brackets is evaluated, and the result is used as the property name.

---

### Intermediate Examples

#### Example 1: Object Destructuring

```javascript
const user = {
  name: "John",
  age: 30,
  job: "Developer",
  address: {
    city: "New York",
    country: "USA"
  }
};

const { name, age, address: { city } } = user;
console.log(name, age, city);

// Default values and renaming
const { job: profession, salary = "Not specified" } = user;
console.log(profession, salary);
```

**Output:**
```
John 30 New York
Developer Not specified
```

**Explanation:** Object destructuring allows you to extract properties from objects into variables. You can destructure nested objects, rename variables, and provide default values for properties that don't exist.

#### Example 2: Spread Operator with Objects

```javascript
const user = {
  name: "John",
  age: 30
};

const userWithJob = {
  ...user,
  job: "Developer"
};

const userWithNewAge = {
  ...user,
  age: 31
};

console.log(userWithJob);
console.log(userWithNewAge);
console.log(user); // Original object remains unchanged
```

**Output:**
```
{ name: 'John', age: 30, job: 'Developer' }
{ name: 'John', age: 31 }
{ name: 'John', age: 30 }
```

**Explanation:** The spread operator (`...`) creates a shallow copy of an object and allows you to add or override properties. The original object remains unchanged.

#### Example 3: Object Methods

```javascript
const user = {
  name: "John",
  age: 30,
  job: "Developer"
};

console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.entries(user));

const entries = [
  ["name", "Jane"],
  ["age", 25]
];
console.log(Object.fromEntries(entries));
```

**Output:**
```
[ 'name', 'age', 'job' ]
[ 'John', 30, 'Developer' ]
[ [ 'name', 'John' ], [ 'age', 30 ], [ 'job', 'Developer' ] ]
{ name: 'Jane', age: 25 }
```

**Explanation:** `Object.keys()` returns an array of property names, `Object.values()` returns an array of property values, and `Object.entries()` returns an array of [key, value] pairs. `Object.fromEntries()` creates an object from an array of [key, value] pairs.

#### Example 4: Object Property Descriptors

```javascript
const user = {
  name: "John"
};

Object.defineProperty(user, "age", {
  value: 30,
  writable: false,
  enumerable: true,
  configurable: true
});

user.age = 31; // This will not change the value because writable is false
console.log(user.age);

console.log(Object.getOwnPropertyDescriptor(user, "age"));
```

**Output:**
```
30
{
  value: 30,
  writable: false,
  enumerable: true,
  configurable: true
}
```

**Explanation:** Property descriptors allow you to define how a property behaves. `writable` controls whether the property can be changed, `enumerable` controls whether the property appears in iterations, and `configurable` controls whether the property can be deleted or have its descriptor changed.

#### Example 5: Object Freezing and Sealing

```javascript
const user1 = {
  name: "John",
  age: 30,
  address: {
    city: "New York"
  }
};

Object.freeze(user1);
user1.age = 31; // This will not change the value
user1.job = "Developer"; // This will not add a new property
user1.address.city = "Boston"; // This will work because freeze is shallow
console.log(user1);
console.log(user1.address);

const user2 = {
  name: "Jane",
  age: 25
};

Object.seal(user2);
user2.age = 26; // This will work
user2.job = "Designer"; // This will not add a new property
delete user2.age; // This will not delete the property
console.log(user2);
```

**Output:**
```
{ name: 'John', age: 30, address: { city: 'Boston' } }
{ city: 'Boston' }
{ name: 'Jane', age: 26 }
```

**Explanation:** `Object.freeze()` makes an object immutable (properties cannot be added, deleted, or changed), but it's shallow, so nested objects can still be modified. `Object.seal()` prevents adding or deleting properties, but existing properties can still be modified.

#### Example 6: Object Merging

```javascript
const defaults = {
  theme: "light",
  fontSize: 16,
  showSidebar: true
};

const userPreferences = {
  theme: "dark",
  showSidebar: false
};

// Method 1: Using Object.assign
const settings1 = Object.assign({}, defaults, userPreferences);
console.log(settings1);

// Method 2: Using spread operator
const settings2 = { ...defaults, ...userPreferences };
console.log(settings2);
```

**Output:**
```
{ theme: 'dark', fontSize: 16, showSidebar: false }
{ theme: 'dark', fontSize: 16, showSidebar: false }
```

**Explanation:** Both `Object.assign()` and the spread operator can be used to merge objects. Properties from later objects override properties from earlier objects if they have the same name.

#### Example 7: Object Iteration

```javascript
const user = {
  name: "John",
  age: 30,
  job: "Developer"
};

// Method 1: for...in loop
console.log("Using for...in:");
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Method 2: Object.keys()
console.log("\nUsing Object.keys():");
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});

// Method 3: Object.entries()
console.log("\nUsing Object.entries():");
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

**Output:**
```
Using for...in:
name: John
age: 30
job: Developer

Using Object.keys():
name: John
age: 30
job: Developer

Using Object.entries():
name: John
age: 30
job: Developer
```

**Explanation:** There are multiple ways to iterate over object properties. `for...in` iterates over all enumerable properties (including those in the prototype chain), while `Object.keys()` and `Object.entries()` only iterate over own enumerable properties.

---

### Hard/Tricky Examples

#### Example 1: Deep Cloning Objects

```javascript
const original = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "coding"]
};

// Shallow copy
const shallowCopy = { ...original };
shallowCopy.age = 31;
shallowCopy.address.city = "Boston";
shallowCopy.hobbies.push("gaming");

// Deep copy using JSON
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.age = 32;
deepCopy.address.city = "Chicago";
deepCopy.hobbies.push("swimming");

console.log("Original:", original);
console.log("Shallow Copy:", shallowCopy);
console.log("Deep Copy:", deepCopy);
```

**Output:**
```
Original: {
  name: 'John',
  age: 30,
  address: { city: 'Boston', country: 'USA' },
  hobbies: [ 'reading', 'coding', 'gaming' ]
}
Shallow Copy: {
  name: 'John',
  age: 31,
  address: { city: 'Boston', country: 'USA' },
  hobbies: [ 'reading', 'coding', 'gaming' ]
}
Deep Copy: {
  name: 'John',
  age: 32,
  address: { city: 'Chicago', country: 'USA' },
  hobbies: [ 'reading', 'coding', 'swimming' ]
}
```

**Explanation:** Shallow copying (using spread or `Object.assign()`) only copies the top-level properties. Nested objects and arrays are still referenced, so changes to them affect both the original and the copy. Deep copying (using `JSON.parse(JSON.stringify())`) creates a completely independent copy, but it has limitations (doesn't handle functions, undefined, symbols, etc.).

#### Example 2: Property Descriptors and Enumeration

```javascript
const user = {
  name: "John",
  age: 30
};

Object.defineProperty(user, "job", {
  value: "Developer",
  enumerable: false
});

console.log(user.job); // Accessible
console.log(Object.keys(user)); // Not enumerable
console.log(Object.getOwnPropertyNames(user)); // Includes non-enumerable

for (const key in user) {
  console.log(key); // Only enumerable properties
}
```

**Output:**
```
Developer
[ 'name', 'age' ]
[ 'name', 'age', 'job' ]
name
age
```

**Explanation:** Non-enumerable properties are not included in iterations like `for...in` or `Object.keys()`, but they are still accessible directly. `Object.getOwnPropertyNames()` returns all own property names, including non-enumerable ones.

#### Example 3: Prototype Chain and Property Lookup

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, my name is ${this.name}`;
};

const john = new Person("John");
console.log(john.greet());
console.log(john.hasOwnProperty("name"));
console.log(john.hasOwnProperty("greet"));
console.log("greet" in john);

console.log(Object.keys(john));
console.log(Object.getOwnPropertyNames(john));

for (const key in john) {
  console.log(`${key}: ${john[key]}`);
}
```

**Output:**
```
Hello, my name is John
true
false
true
[ 'name' ]
[ 'name' ]
name: John
greet: function() {
  return `Hello, my name is ${this.name}`;
}
```

**Explanation:** Properties can be defined on the object itself or on its prototype. `hasOwnProperty()` checks if a property is directly on the object, while the `in` operator checks the entire prototype chain. `Object.keys()` and `Object.getOwnPropertyNames()` only return own properties, but `for...in` iterates over all enumerable properties in the prototype chain.

#### Example 4: Object Property Order

```javascript
const obj = {
  2: "Two",
  1: "One",
  c: "Charlie",
  b: "Bravo",
  a: "Alpha",
  [Symbol("first")]: "Symbol"
};

console.log(Object.keys(obj));
console.log(Object.getOwnPropertyNames(obj));
console.log(Object.getOwnPropertySymbols(obj));
console.log(Reflect.ownKeys(obj));

for (const key in obj) {
  console.log(key);
}
```

**Output:**
```
[ '1', '2', 'c', 'b', 'a' ]
[ '1', '2', 'c', 'b', 'a' ]
[ Symbol(first) ]
[ '1', '2', 'c', 'b', 'a', Symbol(first) ]
1
2
c
b
a
```

**Explanation:** The order of properties in an object follows a specific rule: first numeric keys in ascending order, then string keys in insertion order, and finally Symbol keys in insertion order. `Object.getOwnPropertySymbols()` returns only Symbol properties, while `Reflect.ownKeys()` returns all own property keys, including Symbols.

#### Example 5: Object Methods and `this` Binding

```javascript
const user = {
  name: "John",
  greet: function() {
    return `Hello, my name is ${this.name}`;
  },
  greetArrow: () => {
    return `Hello, my name is ${this.name}`;
  }
};

console.log(user.greet());
console.log(user.greetArrow());

const greet = user.greet;
console.log(greet());

const boundGreet = user.greet.bind(user);
console.log(boundGreet());
```

**Output:**
```
Hello, my name is John
Hello, my name is undefined (or the value of name in the global scope)
Hello, my name is undefined (or the value of name in the global scope)
Hello, my name is John
```

**Explanation:** Regular methods use `this` to refer to the object they're called on, but arrow functions capture `this` from their surrounding scope. When a method is extracted and called as a standalone function, it loses its `this` binding. The `bind()` method creates a new function with `this` permanently bound to the specified object.

#### Example 6: Object Property Getters and Setters

```javascript
const user = {
  firstName: "John",
  lastName: "Doe",
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
};

console.log(user.fullName);
user.fullName = "Jane Smith";
console.log(user.firstName);
console.log(user.lastName);
console.log(user.fullName);
```

**Output:**
```
John Doe
Jane
Smith
Jane Smith
```

**Explanation:** Getters and setters allow you to define computed properties. A getter is called when you access the property, and a setter is called when you assign a value to the property. They look like regular properties to the code that uses them.

#### Example 7: Object Property Inheritance and Shadowing

```javascript
const parent = {
  name: "Parent",
  greet: function() {
    return `Hello from ${this.name}`;
  }
};

const child = Object.create(parent);
child.name = "Child";

console.log(parent.greet());
console.log(child.greet());
console.log(child.hasOwnProperty("name"));
console.log(child.hasOwnProperty("greet"));

delete child.name;
console.log(child.name);
console.log(child.greet());
```

**Output:**
```
Hello from Parent
Hello from Child
true
false
Parent
Hello from Parent
```

**Explanation:** `Object.create()` creates a new object with the specified prototype. The child object inherits properties and methods from its prototype, but it can also define its own properties that shadow (override) the inherited ones. When a property is deleted from the child, the inherited property becomes visible again.

#### Example 8: Object Property Descriptors and Inheritance

```javascript
const parent = {};
Object.defineProperty(parent, "name", {
  value: "Parent",
  writable: true,
  enumerable: true,
  configurable: true
});

const child = Object.create(parent);
Object.defineProperty(child, "name", {
  value: "Child"
});

console.log(child.name);
console.log(Object.getOwnPropertyDescriptor(child, "name"));

delete child.name;
console.log(child.name);
```

**Output:**
```
Child
{ value: 'Child', writable: false, enumerable: false, configurable: false }
Child
```

**Explanation:** When you define a property using `Object.defineProperty()` without specifying all descriptor attributes, the missing attributes default to `false`. In this case, the `name` property on the child object is not configurable, so it cannot be deleted. Even after attempting to delete it, it still exists and shadows the parent's property.

#### Example 9: Object Property Proxies

```javascript
const target = {
  name: "John",
  age: 30
};

const handler = {
  get: function(obj, prop) {
    console.log(`Getting ${prop}`);
    return prop in obj ? obj[prop] : `Property "${prop}" does not exist`;
  },
  set: function(obj, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    obj[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name);
console.log(proxy.job);
proxy.age = 31;
try {
  proxy.age = "thirty-two";
} catch (e) {
  console.log(e.message);
}
```

**Output:**
```
Getting name
John
Getting job
Property "job" does not exist
Setting age to 31
Setting age to thirty-two
Age must be a number
```

**Explanation:** Proxies allow you to intercept and customize operations on objects. The `get` trap is called when a property is accessed, and the `set` trap is called when a property is assigned. This enables you to add validation, logging, or other custom behavior to object operations.

#### Example 10: Object Property Symbols

```javascript
const nameSymbol = Symbol("name");
const ageSymbol = Symbol("age");

const user = {
  [nameSymbol]: "John",
  [ageSymbol]: 30,
  job: "Developer"
};

console.log(user[nameSymbol]);
console.log(user[ageSymbol]);
console.log(Object.keys(user));
console.log(Object.getOwnPropertySymbols(user));

// Symbol.for creates a global symbol
const globalSymbol1 = Symbol.for("global");
const globalSymbol2 = Symbol.for("global");
console.log(globalSymbol1 === globalSymbol2);

const regularSymbol1 = Symbol("regular");
const regularSymbol2 = Symbol("regular");
console.log(regularSymbol1 === regularSymbol2);
```

**Output:**
```
John
30
[ 'job' ]
[ Symbol(name), Symbol(age) ]
true
false
```

**Explanation:** Symbols are unique identifiers that can be used as property keys. They are not enumerable by default, so they don't appear in `Object.keys()` or `for...in` loops. `Symbol.for()` creates a symbol in the global symbol registry, allowing you to create shared symbols that are equal when created with the same key. Regular symbols are always unique, even if created with the same description.
