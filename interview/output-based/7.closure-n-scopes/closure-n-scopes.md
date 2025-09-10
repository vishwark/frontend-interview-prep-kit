# JavaScript Closures and Scopes

## What are Closures and Scopes?

### Closures
A closure is a function that has access to its own scope, the scope of the outer function, and the global scope. It "remembers" the environment in which it was created, even after the outer function has finished executing. This allows a function to retain access to variables from its parent scope.

### Scopes
Scope determines the accessibility of variables in JavaScript. There are several types of scope:
- **Global Scope**: Variables declared outside any function or block
- **Function Scope**: Variables declared within a function
- **Block Scope**: Variables declared within a block (introduced with `let` and `const`)
- **Module Scope**: Variables declared in a module
- **Lexical Scope**: The scope defined by the location where a function is declared

### Closely Related Concepts
- **Execution Context**: The environment in which JavaScript code is executed
- **Variable Hoisting**: How variable declarations are moved to the top of their scope
- **Temporal Dead Zone**: The period between entering a scope and the variable declaration
- **IIFE (Immediately Invoked Function Expression)**: A function that runs as soon as it is defined
- **Garbage Collection**: How memory is freed when variables are no longer accessible
- **Lexical Environment**: The internal mechanism that implements scope and closures
- **`this` Binding**: How the value of `this` is determined in different contexts

## Common Scenarios Where Developers Get Tricked

1. **Closures in Loops**: Variables captured in closures within loops can lead to unexpected behavior
2. **Block Scope vs. Function Scope**: Confusion between `var`, `let`, and `const` declarations
3. **Nested Scopes**: How inner functions access variables from outer functions
4. **Asynchronous Callbacks**: How closures affect variables in asynchronous code
5. **Memory Leaks**: Unintentional retention of references through closures
6. **Module Patterns**: How closures are used to create private variables
7. **`this` in Closures**: How `this` behaves differently in closures vs. regular functions
8. **Shadowing**: When a variable in an inner scope has the same name as a variable in an outer scope

---

## Code Snippets

### Simple Examples

#### Example 1: Basic Closure

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter());
console.log(counter());
console.log(counter());
```

**Output:**
```
1
2
3
```

**Explanation:** The inner function forms a closure over the `count` variable from its parent scope. Each time the inner function is called, it increments and returns the `count` variable, which persists between function calls because of the closure.

#### Example 2: Function Scope vs. Block Scope

```javascript
function scopeExample() {
  var functionScoped = "I am function-scoped";
  let blockScoped = "I am block-scoped";
  
  if (true) {
    var functionScoped = "I am reassigned";
    let blockScoped = "I am a new block-scoped variable";
    console.log("Inside block - functionScoped:", functionScoped);
    console.log("Inside block - blockScoped:", blockScoped);
  }
  
  console.log("Outside block - functionScoped:", functionScoped);
  console.log("Outside block - blockScoped:", blockScoped);
}

scopeExample();
```

**Output:**
```
Inside block - functionScoped: I am reassigned
Inside block - blockScoped: I am a new block-scoped variable
Outside block - functionScoped: I am reassigned
Outside block - blockScoped: I am block-scoped
```

**Explanation:** Variables declared with `var` have function scope, so the reassignment inside the block affects the variable outside the block. Variables declared with `let` have block scope, so the variable inside the block is a new variable that shadows the outer one, and changes to it don't affect the outer variable.

#### Example 3: Closures with Parameters

```javascript
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const greetHello = createGreeter("Hello");
const greetHi = createGreeter("Hi");

console.log(greetHello("John"));
console.log(greetHi("Jane"));
```

**Output:**
```
Hello, John!
Hi, Jane!
```

**Explanation:** The inner function forms a closure over the `greeting` parameter from the outer function. Each greeter function remembers its own `greeting` value, which is passed when the outer function is called.

#### Example 4: Immediate Access to Outer Variables

```javascript
function outer() {
  const outerVar = "I am from outer";
  
  function inner() {
    console.log(outerVar);
  }
  
  inner();
}

outer();
```

**Output:**
```
I am from outer
```

**Explanation:** The inner function has access to variables from its parent scope, even before the inner function is called. This is because of lexical scoping, which determines the scope of a variable by its location in the source code.

#### Example 5: Nested Scopes

```javascript
function level1() {
  const a = 1;
  
  function level2() {
    const b = 2;
    
    function level3() {
      const c = 3;
      console.log(a, b, c);
    }
    
    level3();
  }
  
  level2();
}

level1();
```

**Output:**
```
1 2 3
```

**Explanation:** Each nested function has access to variables from all its parent scopes. The innermost function `level3` can access variables `a`, `b`, and `c` from all three scopes.

#### Example 6: Global Scope

```javascript
var globalVar = "I am global";

function accessGlobal() {
  console.log(globalVar);
}

function shadowGlobal() {
  var globalVar = "I am local";
  console.log(globalVar);
}

accessGlobal();
shadowGlobal();
console.log(globalVar);
```

**Output:**
```
I am global
I am local
I am global
```

**Explanation:** Variables declared in the global scope are accessible from any function. However, if a function declares a variable with the same name, it shadows the global variable within that function's scope.

#### Example 7: Closures in Event Handlers

```javascript
function setupButton(buttonId, message) {
  // In a browser environment, this would attach a click handler
  // Here we'll simulate it
  function handleClick() {
    console.log(`Button ${buttonId} clicked: ${message}`);
  }
  
  // Simulate a click
  handleClick();
}

setupButton("btn1", "Hello");
setupButton("btn2", "World");
```

**Output:**
```
Button btn1 clicked: Hello
Button btn2 clicked: World
```

**Explanation:** The `handleClick` function forms a closure over the `buttonId` and `message` parameters from the `setupButton` function. Each click handler remembers its own values for these parameters.

---

### Intermediate Examples

#### Example 1: Closures in Loops

```javascript
// Problem: Using var in a loop with closures
function createFunctionsWithVar() {
  var functions = [];
  
  for (var i = 0; i < 3; i++) {
    functions.push(function() {
      return i;
    });
  }
  
  return functions;
}

// Solution 1: Using let in a loop with closures
function createFunctionsWithLet() {
  var functions = [];
  
  for (let i = 0; i < 3; i++) {
    functions.push(function() {
      return i;
    });
  }
  
  return functions;
}

// Solution 2: Using an IIFE to create a new scope
function createFunctionsWithIIFE() {
  var functions = [];
  
  for (var i = 0; i < 3; i++) {
    (function(index) {
      functions.push(function() {
        return index;
      });
    })(i);
  }
  
  return functions;
}

const functionsWithVar = createFunctionsWithVar();
const functionsWithLet = createFunctionsWithLet();
const functionsWithIIFE = createFunctionsWithIIFE();

console.log(functionsWithVar[0](), functionsWithVar[1](), functionsWithVar[2]());
console.log(functionsWithLet[0](), functionsWithLet[1](), functionsWithLet[2]());
console.log(functionsWithIIFE[0](), functionsWithIIFE[1](), functionsWithIIFE[2]());
```

**Output:**
```
3 3 3
0 1 2
0 1 2
```

**Explanation:** 
1. With `var`, all functions share the same `i` variable, which has a final value of 3 after the loop completes.
2. With `let`, each iteration creates a new binding for `i`, so each function captures a different value.
3. With an IIFE, a new scope is created for each iteration, capturing the current value of `i` as `index`.

#### Example 2: Module Pattern

```javascript
const calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private function
  function validate(n) {
    return typeof n === 'number';
  }
  
  // Public API
  return {
    add: function(n) {
      if (validate(n)) {
        result += n;
      }
      return this;
    },
    subtract: function(n) {
      if (validate(n)) {
        result -= n;
      }
      return this;
    },
    getResult: function() {
      return result;
    }
  };
})();

console.log(calculator.getResult());
calculator.add(5).subtract(2);
console.log(calculator.getResult());
console.log(calculator.result); // Trying to access private variable
console.log(calculator.validate); // Trying to access private function
```

**Output:**
```
0
3
undefined
undefined
```

**Explanation:** The module pattern uses an IIFE to create a closure that encapsulates private variables and functions. Only the functions returned in the object are accessible from outside, providing a form of encapsulation. The private variables and functions are not accessible directly.

#### Example 3: Closures with Asynchronous Code

```javascript
function delayedGreeting(name) {
  setTimeout(function() {
    console.log(`Hello, ${name}!`);
  }, 1000);
}

delayedGreeting("John");
console.log("After calling delayedGreeting");
```

**Output:**
```
After calling delayedGreeting
Hello, John! (after approximately 1 second)
```

**Explanation:** The callback function passed to `setTimeout` forms a closure over the `name` parameter. Even though `delayedGreeting` has finished executing by the time the callback runs, the callback still has access to the `name` parameter because of the closure.

#### Example 4: Closures and `this` Binding

```javascript
const user = {
  name: "John",
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  },
  greetLater: function() {
    setTimeout(function() {
      console.log(`Hello, my name is ${this.name}`);
    }, 1000);
  },
  greetLaterFixed: function() {
    const self = this;
    setTimeout(function() {
      console.log(`Hello, my name is ${self.name}`);
    }, 1000);
  },
  greetLaterArrow: function() {
    setTimeout(() => {
      console.log(`Hello, my name is ${this.name}`);
    }, 1000);
  }
};

user.greet();
user.greetLater();
user.greetLaterFixed();
user.greetLaterArrow();
```

**Output:**
```
Hello, my name is John
Hello, my name is undefined (or the value of name in the global scope)
Hello, my name is John
Hello, my name is John
```

**Explanation:** 
1. In `greet`, `this` refers to the `user` object.
2. In `greetLater`, the callback function has its own `this` binding, which defaults to the global object.
3. In `greetLaterFixed`, the `self` variable captures the `this` value from the outer function, allowing the callback to access it.
4. In `greetLaterArrow`, the arrow function inherits the `this` value from its surrounding scope, which is the `greetLaterArrow` method.

#### Example 5: Closures and Memory Management

```javascript
function createLargeArray() {
  // Create a large array
  const largeArray = new Array(1000000).fill("data");
  
  return function() {
    return largeArray.length;
  };
}

const getArrayLength = createLargeArray();
console.log(getArrayLength());

// The largeArray is still in memory because getArrayLength forms a closure over it
```

**Output:**
```
1000000
```

**Explanation:** The inner function forms a closure over the `largeArray` variable. Even though `createLargeArray` has finished executing, the `largeArray` is not garbage collected because the returned function still has a reference to it. This can lead to memory leaks if not managed properly.

#### Example 6: Block Scoping with `let` and `const`

```javascript
function blockScopeExample() {
  if (true) {
    var varVariable = "var";
    let letVariable = "let";
    const constVariable = "const";
  }
  
  console.log(varVariable);
  
  try {
    console.log(letVariable);
  } catch (e) {
    console.log("letVariable is not defined");
  }
  
  try {
    console.log(constVariable);
  } catch (e) {
    console.log("constVariable is not defined");
  }
}

blockScopeExample();
```

**Output:**
```
var
letVariable is not defined
constVariable is not defined
```

**Explanation:** Variables declared with `var` have function scope, so they are accessible outside the block. Variables declared with `let` and `const` have block scope, so they are not accessible outside the block where they are declared.

#### Example 7: Temporal Dead Zone

```javascript
function temporalDeadZoneExample() {
  try {
    console.log(varVariable);
  } catch (e) {
    console.log("Error accessing varVariable:", e.message);
  }
  
  try {
    console.log(letVariable);
  } catch (e) {
    console.log("Error accessing letVariable:", e.message);
  }
  
  var varVariable = "var";
  let letVariable = "let";
}

temporalDeadZoneExample();
```

**Output:**
```
undefined
Error accessing letVariable: Cannot access 'letVariable' before initialization
```

**Explanation:** Variables declared with `var` are hoisted and initialized with `undefined`. Variables declared with `let` and `const` are hoisted but not initialized, creating a "temporal dead zone" where accessing them before the declaration results in a ReferenceError.

---

### Hard/Tricky Examples

#### Example 1: Closure in a Loop with Async/Await

```javascript
async function createAsyncFunctions() {
  const functions = [];
  
  for (var i = 0; i < 3; i++) {
    functions.push(async function() {
      await new Promise(resolve => setTimeout(resolve, 100));
      return i;
    });
  }
  
  return functions;
}

async function runAsyncExample() {
  const functions = await createAsyncFunctions();
  
  for (const fn of functions) {
    console.log(await fn());
  }
}

runAsyncExample();
```

**Output:**
```
3
3
3
```

**Explanation:** Even with async/await, the closure issue with `var` in loops persists. All functions share the same `i` variable, which has a final value of 3 after the loop completes. The `await` doesn't change this behavior because the closure has already captured the variable.

#### Example 2: Nested Closures and Scope Chain

```javascript
function outer() {
  const x = 1;
  
  function middle() {
    const y = 2;
    
    function inner() {
      const z = 3;
      console.log(x + y + z);
      
      function innermost() {
        const w = 4;
        console.log(x + y + z + w);
      }
      
      return innermost;
    }
    
    return inner;
  }
  
  return middle;
}

const middleFn = outer();
const innerFn = middleFn();
const innermostFn = innerFn();
innermostFn();
```

**Output:**
```
6
10
```

**Explanation:** Each function forms a closure over its parent scope. The innermost function has access to variables from all outer scopes through the scope chain. This example demonstrates how nested closures work and how variables are resolved through the scope chain.

#### Example 3: Closures and Function Parameters

```javascript
function multiplier(factor) {
  return function(number) {
    return function(another) {
      return factor * number * another;
    };
  };
}

const double = multiplier(2);
const triple = multiplier(3);

const doubleTimes5 = double(5);
const tripleTimes5 = triple(5);

console.log(doubleTimes5(3));
console.log(tripleTimes5(3));
```

**Output:**
```
30
45
```

**Explanation:** This example demonstrates currying with closures. Each function in the chain forms a closure over its parameters and the variables from its parent scope. The final function has access to all three values: `factor`, `number`, and `another`.

#### Example 4: Closures and Variable Mutation

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1.increment());
console.log(counter1.increment());
console.log(counter2.increment());
console.log(counter1.decrement());
console.log(counter2.getCount());
```

**Output:**
```
1
2
1
1
1
```

**Explanation:** Each call to `createCounter` creates a new closure with its own `count` variable. The functions returned by `createCounter` share access to the same `count` variable within their closure, but each counter has its own separate `count`.

#### Example 5: Closures and Function Redefinition

```javascript
function setupCounter() {
  let count = 0;
  
  function updateCounter() {
    count++;
    console.log(count);
    
    if (count === 2) {
      updateCounter = function() {
        count += 2;
        console.log(count);
      };
    }
  }
  
  return updateCounter;
}

const counter = setupCounter();
counter(); // 1
counter(); // 2
counter(); // 4
counter(); // 6
```

**Output:**
```
1
2
4
6
```

**Explanation:** The `updateCounter` function is redefined when `count` reaches 2. However, the redefined function still has access to the same `count` variable through closure. This demonstrates that closures are tied to the scope, not to the function definition.

#### Example 6: Closures and Object Methods

```javascript
function createPerson(name) {
  return {
    getName: function() {
      return name;
    },
    setName: function(newName) {
      name = newName;
    }
  };
}

const person = createPerson("John");
console.log(person.getName());

person.setName("Jane");
console.log(person.getName());

const getName = person.getName;
console.log(getName());
```

**Output:**
```
John
Jane
Jane
```

**Explanation:** The `getName` and `setName` methods form closures over the `name` parameter. Even when `getName` is extracted from the object and called as a standalone function, it still has access to the `name` variable through closure.

#### Example 7: Closures and Private State

```javascript
function SecretKeeper(secret) {
  this.getSecret = function() {
    return secret;
  };
  
  this.setSecret = function(newSecret) {
    if (typeof newSecret === 'string' && newSecret.length > 0) {
      secret = newSecret;
    }
  };
}

const keeper = new SecretKeeper("initial secret");
console.log(keeper.getSecret());

keeper.setSecret("new secret");
console.log(keeper.getSecret());

keeper.setSecret("");
console.log(keeper.getSecret());

console.log(keeper.secret);
```

**Output:**
```
initial secret
new secret
new secret
undefined
```

**Explanation:** The `getSecret` and `setSecret` methods form closures over the `secret` parameter, providing controlled access to it. The `secret` is not accessible directly as a property of the `keeper` object, demonstrating how closures can be used to create private state in JavaScript.

#### Example 8: Closures and Event Loops

```javascript
function eventLoopExample() {
  for (var i = 0; i < 3; i++) {
    setTimeout(function() {
      console.log("var i:", i);
    }, 0);
  }
  
  for (let j = 0; j < 3; j++) {
    setTimeout(function() {
      console.log("let j:", j);
    }, 0);
  }
}

eventLoopExample();
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

**Explanation:** This example demonstrates the interaction between closures and the event loop. With `var`, all timeouts share the same `i` variable, which has a final value of 3 when the timeouts execute. With `let`, each iteration creates a new binding for `j`, so each timeout captures a different value.

#### Example 9: Closures and Function Composition

```javascript
function compose(...functions) {
  return function(x) {
    return functions.reduceRight((acc, fn) => fn(acc), x);
  };
}

function addOne(x) {
  return x + 1;
}

function double(x) {
  return x * 2;
}

function square(x) {
  return x * x;
}

const calculate = compose(square, double, addOne);
console.log(calculate(3));
```

**Output:**
```
64
```

**Explanation:** The `compose` function returns a new function that forms a closure over the `functions` array. When called with an argument, it applies each function in the array from right to left. The calculation is: square(double(addOne(3))) = square(double(4)) = square(8) = 64.

#### Example 10: Closures and Recursive Functions

```javascript
function makeFactorial() {
  const cache = {};
  
  function factorial(n) {
    if (n in cache) {
      return cache[n];
    }
    
    if (n <= 1) {
      return 1;
    }
    
    cache[n] = n * factorial(n - 1);
    return cache[n];
  }
  
  return factorial;
}

const factorial = makeFactorial();
console.log(factorial(5));
console.log(factorial(10));
```

**Output:**
```
120
3628800
```

**Explanation:** The `factorial` function forms a closure over the `cache` object, allowing it to memoize results of previous calculations. Each recursive call to `factorial` has access to the same `cache` object, demonstrating how closures can be used with recursive functions to improve performance.
