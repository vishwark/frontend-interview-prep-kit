# Curry Function

## Problem Understanding

### Definition

**Currying** is a functional programming technique that transforms a function of multiple arguments into a sequence of functions, each taking a single argument. The name "currying" is derived from mathematician Haskell Curry, who developed this concept.

In JavaScript, currying allows you to create specialized functions by partially applying arguments to a more general function. This technique enhances code reusability, improves readability for certain operations, and enables advanced functional programming patterns.

### Parameters

#### Basic Curry Function
- `fn`: The function to curry

#### Advanced Curry Function with Placeholder Support
- `fn`: The function to curry
- `arity` (optional): The number of arguments to expect (defaults to fn.length)
- `placeholder` (optional): The placeholder value (defaults to curryWithPlaceholders.placeholder)

#### Partial Application Function
- `fn`: The function to partially apply
- `...args`: Arguments to pre-fill

#### Right Curry Function
- `fn`: The function to curry

#### Auto-Curry Function
- `fn`: The function to curry
- `arity` (optional): The number of arguments to expect (defaults to fn.length)

### Return Value

All curry functions return a new function that:
- Collects arguments across multiple function calls
- Returns another function if not enough arguments have been provided
- Invokes the original function with all collected arguments once sufficient arguments are provided

### Edge Cases to Handle

1. **Function Arity**:
   - Functions with no arguments
   - Functions with variable arguments (rest parameters)
   - Functions where `fn.length` doesn't reflect actual required arguments

2. **Argument Handling**:
   - Handling undefined or null arguments
   - Preserving the correct order of arguments
   - Handling placeholders for skipping arguments

3. **Context Preservation**:
   - Maintaining the correct `this` context
   - Handling bound functions

4. **Special Cases**:
   - Functions that require specific argument types
   - Functions with side effects
   - Functions that rely on argument objects

### Use Cases

1. **Function Specialization**:
   - Creating more specific functions from general ones
   - Building utility libraries with customizable behavior

2. **Partial Application**:
   - Pre-filling configuration parameters
   - Creating functions with default arguments

3. **Point-Free Programming**:
   - Composing functions without explicitly mentioning arguments
   - Creating cleaner data transformation pipelines

4. **Event Handling**:
   - Creating specialized event handlers with pre-bound data
   - Simplifying callback patterns

### Implementation Approaches

#### Basic Currying

1. **Fixed Arity Currying**:
   - Curry a function with a known number of arguments
   - Return a new function for each missing argument
   - Simple implementation but less flexible

2. **Variable Arity Currying**:
   - Support functions with any number of arguments
   - Collect arguments until the original function is called
   - More flexible but potentially more complex

#### Advanced Currying Features

1. **Placeholder Support**:
   - Allow arguments to be skipped using placeholders
   - Fill in placeholders when more arguments are provided
   - Enables more flexible argument application

2. **Right Currying**:
   - Apply arguments from right to left
   - Useful for certain functional programming patterns

3. **Auto-Currying**:
   - Automatically determine when to execute the function
   - Provide a more natural API for both partial and full application

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the number of arguments
- **Space Complexity**: O(n) for storing the arguments

### Common Interview Questions

1. What is the difference between currying and partial application?
2. How would you implement a curry function that supports placeholders?
3. How would you handle the `this` context in a curried function?
4. Can you implement a curry function that works with functions of unknown arity?
5. How would you implement right currying (applying arguments from right to left)?

### Code Example: Using Curry Functions

```javascript
// Basic currying
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6

// Currying with placeholders
const _ = curryWithPlaceholders.placeholder;
const curriedFormat = curryWithPlaceholders((a, b, c) => `${a}/${b}/${c}`);

curriedFormat(_, 2, 3)(1); // "1/2/3"
curriedFormat(_, _, 3)(1)(2); // "1/2/3"

// Partial application
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = partial(greet, "Hello");

sayHello("World"); // "Hello, World!"

// Auto-currying
const divide = (a, b) => a / b;
const autoCurriedDivide = autoCurry(divide);

autoCurriedDivide(10)(2); // 5
autoCurriedDivide(10, 2); // 5
```

### Comparison with Other Functional Techniques

| Technique | Description | When to Use |
|-----------|-------------|------------|
| Currying | Transforms a function of N arguments into N functions of 1 argument | When you need to create specialized functions |
| Partial Application | Pre-fills some arguments of a function | When you have some arguments known in advance |
| Function Composition | Combines multiple functions into a single function | When you need to create data transformation pipelines |
| Point-Free Style | Writing functions without mentioning arguments | When you want to focus on operations rather than data flow |

### Libraries with Curry Support

Many functional programming libraries in JavaScript provide curry functionality:

1. **Lodash/Underscore**: `_.curry()` for basic currying
2. **Ramda**: `R.curry()` with placeholder support
3. **Functional.js**: Various currying utilities

These libraries often provide optimized implementations with additional features beyond basic currying.
