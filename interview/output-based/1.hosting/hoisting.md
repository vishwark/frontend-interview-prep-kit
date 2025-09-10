# JavaScript Hoisting

## What is Hoisting?

Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their containing scope during the compilation phase, before the code is executed. This means that regardless of where functions and variables are declared, they are moved to the top of their scope. However, only the declarations are hoisted, not the initializations.

Hoisting is closely related to:
- Variable declarations (`var`, `let`, `const`)
- Function declarations vs. function expressions
- Temporal Dead Zone (TDZ)
- Scope (global, function, block)

## Common Scenarios Where Developers Get Tricked

1. **Confusing `var` with `let` and `const`**: Unlike `var`, `let` and `const` declarations are hoisted but not initialized. They exist in a "temporal dead zone" from the start of the block until the declaration is processed.

2. **Function declarations vs. expressions**: Function declarations are fully hoisted, while function expressions are not.

3. **Accessing variables before declaration**: With `var`, you can access the variable before it's declared (it will be `undefined`), but with `let` and `const`, you'll get a ReferenceError.

4. **Redeclaration of variables**: `var` allows redeclaration, while `let` and `const` do not.

5. **Hoisting in loops**: Using `var` in loops can lead to unexpected behavior due to hoisting and closure issues.

---

## Code Snippets

### Simple Examples

#### Example 1: Basic Hoisting with `var`

```javascript
console.log(x);
var x = 5;
console.log(x);
```

**Output:**
```
undefined
5
```

**Explanation:** The variable `x` is hoisted to the top of its scope, but only its declaration, not its initialization. So the first `console.log` outputs `undefined`. After the assignment, `x` has the value `5`.

#### Example 2: Function Declaration Hoisting

```javascript
sayHello();

function sayHello() {
  console.log("Hello!");
}
```

**Output:**
```
Hello!
```

**Explanation:** Function declarations are completely hoisted, including their body. This means you can call the function before it appears in the code.

#### Example 3: Function Expression vs. Declaration

```javascript
// Function declaration - hoisted completely
declaration();

function declaration() {
  console.log("I am a function declaration");
}

// Function expression - only variable declaration is hoisted
// expression(); // This would cause an error

var expression = function() {
  console.log("I am a function expression");
};

expression(); // Works fine here
```

**Output:**
```
I am a function declaration
I am a function expression
```

**Explanation:** Function declarations are hoisted completely with their implementation. Function expressions are treated like variable declarations - only the variable name is hoisted, not the function implementation.

#### Example 4: Variable Redeclaration with var

```javascript
var x = 10;
console.log(x);

var x = 20;
console.log(x);
```

**Output:**
```
10
20
```

**Explanation:** With `var`, you can redeclare variables without errors. The second declaration simply overwrites the first one.

#### Example 5: let and const Hoisting

```javascript
// This would cause a ReferenceError
// console.log(y);

let y = 10;
console.log(y);

// This would also cause a ReferenceError
// console.log(z);

const z = 20;
console.log(z);
```

**Output:**
```
10
20
```

**Explanation:** Variables declared with `let` and `const` are hoisted but not initialized. They remain in the "temporal dead zone" until the declaration line is reached, making them inaccessible before declaration.

---

### Intermediate Examples

#### Example 1: `let` and Temporal Dead Zone

```javascript
console.log(x);
let x = 5;
```

**Output:**
```
ReferenceError: Cannot access 'x' before initialization
```

**Explanation:** While `let` declarations are hoisted, they are not initialized and remain in a "temporal dead zone" until the actual declaration line is reached. Accessing them before the declaration results in a ReferenceError.

#### Example 2: Function Expressions vs. Declarations

```javascript
sayHello();
sayHi();

function sayHello() {
  console.log("Hello!");
}

var sayHi = function() {
  console.log("Hi!");
};
```

**Output:**
```
Hello!
TypeError: sayHi is not a function
```

**Explanation:** `sayHello` is a function declaration that is fully hoisted. `sayHi` is a function expression assigned to a variable. The variable `sayHi` is hoisted, but it's initialized as `undefined`, not as a function, so calling it results in a TypeError.

#### Example 3: Hoisting in Conditional Blocks

```javascript
if (true) {
  console.log(x);
  var x = 10;
}
console.log(x);
```

**Output:**
```
undefined
10
```

**Explanation:** `var` declarations are hoisted to the function scope, not block scope. So `x` is hoisted to the top of the function (or global scope in this case), making it accessible both inside and outside the `if` block.

---

### Hard/Tricky Examples

#### Example 1: Nested Function Scopes

```javascript
var x = 1;

function outer() {
  console.log(x);
  var x = 2;
  function inner() {
    console.log(x);
    var x = 3;
    console.log(x);
  }
  inner();
  console.log(x);
}

outer();
console.log(x);
```

**Output:**
```
undefined
undefined
3
2
1
```

**Explanation:** 
1. In `outer()`, `x` is hoisted locally, so the first `console.log(x)` outputs `undefined` (not the global `x`).
2. In `inner()`, `x` is again hoisted locally, so the first `console.log(x)` in `inner()` outputs `undefined`.
3. After `x = 3` in `inner()`, `console.log(x)` outputs `3`.
4. Back in `outer()`, `console.log(x)` outputs `2` (the local `x` in `outer`).
5. Finally, the global `console.log(x)` outputs `1` (the global `x`).

#### Example 2: Function Declarations in Blocks

```javascript
function foo() {
  return 1;
}

{
  function foo() {
    return 2;
  }
}

console.log(foo());
```

**Output:**
```
// In strict mode: 1
// In non-strict mode: 2 (in most browsers, but behavior can vary)
```

**Explanation:** Function declarations in blocks are hoisted differently in strict mode vs. non-strict mode. In strict mode, they are block-scoped, while in non-strict mode, they might affect the outer scope (though this behavior is not standardized across all browsers).

#### Example 3: `let`, `const`, and the Temporal Dead Zone in Loops

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 1000);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 1000);
}
```

**Output:**
```
var i: 3
var i: 3
var i: 3
let j: 0
let j: 1
let j: 2
```

**Explanation:** 
- With `var`, there's only one `i` variable that's shared across all iterations of the loop. By the time the timeouts execute, the loop has completed and `i` is 3.
- With `let`, a new `j` variable is created for each iteration of the loop, each with its own scope. So each timeout captures a different value of `j`.

#### Example 4: Class Hoisting

```javascript
const p = new Person();
console.log(p);

class Person {
  constructor() {
    this.name = "John";
  }
}
```

**Output:**
```
ReferenceError: Cannot access 'Person' before initialization
```

**Explanation:** Unlike function declarations, class declarations are not hoisted. They also remain in the temporal dead zone until the declaration is processed.
