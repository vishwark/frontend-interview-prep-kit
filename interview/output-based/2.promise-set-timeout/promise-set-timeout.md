# Promises and setTimeout

## What are Promises and setTimeout?

### Promises
A Promise is a JavaScript object representing the eventual completion or failure of an asynchronous operation. It allows you to handle asynchronous operations in a more elegant way compared to callbacks. A Promise can be in one of three states:
- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: The operation completed successfully
- **Rejected**: The operation failed

Promises provide methods like `.then()`, `.catch()`, and `.finally()` to handle the results or errors of asynchronous operations.

### setTimeout
`setTimeout` is a Web API function that executes a specified function after a specified delay (in milliseconds). It's commonly used to delay execution of code or to create timers.

### Closely Related Concepts
- **Event Loop**: The mechanism that handles the execution of multiple chunks of code over time
- **Microtasks vs. Macrotasks**: Promises are microtasks, while setTimeout callbacks are macrotasks
- **Async/Await**: Syntactic sugar built on top of Promises
- **Promise chaining**: Using multiple `.then()` calls in sequence
- **Promise.all(), Promise.race(), Promise.allSettled()**: Methods for handling multiple promises

## Common Scenarios Where Developers Get Tricked

1. **Execution Order**: Misunderstanding the order of execution between Promises and setTimeout
2. **Microtask Queue vs. Task Queue**: Not knowing that Promise callbacks (microtasks) have higher priority than setTimeout callbacks (macrotasks)
3. **Promise Chaining**: Forgetting to return values in Promise chains
4. **Error Handling**: Not properly catching errors in Promise chains
5. **Zero Delay setTimeout**: Assuming setTimeout with 0ms delay executes immediately
6. **this Binding**: Losing the `this` context in callbacks
7. **Nested Promises**: Creating "Promise hell" similar to "callback hell"
8. **Forgetting await**: Not using await with async functions, causing unexpected behavior

---

## Code Snippets

### Simple Examples

#### Example 1: Basic Promise and setTimeout Order

```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

**Output:**
```
Start
End
Promise
setTimeout
```

**Explanation:** Even though both the Promise and setTimeout are scheduled to run asynchronously, the Promise callback (a microtask) runs before the setTimeout callback (a macrotask), even with a 0ms delay. This is because microtasks are processed after the current synchronous code but before the next macrotask.

#### Example 2: Promise Chain

```javascript
Promise.resolve(1)
  .then(value => {
    console.log(value); // 1
    return value + 1;
  })
  .then(value => {
    console.log(value); // 2
    return value + 1;
  })
  .then(value => {
    console.log(value); // 3
  });
```

**Output:**
```
1
2
3
```

**Explanation:** Each `.then()` receives the value returned by the previous Promise in the chain. This demonstrates how Promise chaining works, with each step building on the result of the previous step.

#### Example 3: Promise Error Handling

```javascript
Promise.resolve()
  .then(() => {
    throw new Error('Something went wrong');
    return 'This will never be reached';
  })
  .catch(error => {
    console.log('Caught error:', error.message);
    return 'Recovered';
  })
  .then(value => {
    console.log('Final value:', value);
  });
```

**Output:**
```
Caught error: Something went wrong
Final value: Recovered
```

**Explanation:** When an error is thrown in a Promise chain, it skips to the next `.catch()` handler. The `.catch()` handler can return a value, which is passed to the next `.then()` in the chain.

#### Example 4: Multiple Promises with setTimeout

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
});

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');
```

**Output:**
```
Start
End
Promise 1
Promise 2
Timeout 1
Timeout 2
```

**Explanation:** All synchronous code runs first, then all microtasks (Promises), and finally all macrotasks (setTimeout callbacks). This demonstrates the priority of different types of tasks in the event loop.

#### Example 5: Promise.all

```javascript
const promise1 = Promise.resolve('First');
const promise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('Second');
  }, 100);
});
const promise3 = Promise.resolve('Third');

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values);
  });
```

**Output:**
```
["First", "Second", "Third"]
```

**Explanation:** `Promise.all()` takes an array of promises and returns a new promise that resolves when all input promises have resolved. The resolved values are returned as an array in the same order as the input promises.

#### Example 6: Promise.race

```javascript
const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('First');
  }, 200);
});

const promise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('Second');
  }, 100);
});

Promise.race([promise1, promise2])
  .then(value => {
    console.log('Winner:', value);
  });
```

**Output:**
```
Winner: Second
```

**Explanation:** `Promise.race()` returns a promise that resolves or rejects as soon as one of the input promises resolves or rejects. In this case, `promise2` resolves first after 100ms, so its value is used.

#### Example 7: Async/Await Basics

```javascript
async function example() {
  console.log('Inside async function');
  const result = await Promise.resolve('Async result');
  console.log(result);
  return 'Done';
}

console.log('Before calling async function');
example().then(result => console.log('Final result:', result));
console.log('After calling async function');
```

**Output:**
```
Before calling async function
Inside async function
After calling async function
Async result
Final result: Done
```

**Explanation:** The `async` function runs synchronously until it hits an `await`, then it pauses and returns control to the caller. Once the awaited Promise resolves, the function continues execution. The `async` function itself returns a Promise that resolves with the function's return value.

---

### Intermediate Examples

#### Example 1: Mixing Promises and setTimeout

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
  Promise.resolve().then(() => {
    console.log("Promise inside Timeout");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
  setTimeout(() => {
    console.log("Timeout inside Promise");
  }, 0);
});

console.log("End");
```

**Output:**
```
Start
End
Promise 1
Timeout 1
Promise inside Timeout
Timeout inside Promise
```

**Explanation:** 
1. Synchronous code runs first ("Start" and "End")
2. After synchronous code, microtasks run ("Promise 1")
3. Then macrotasks run ("Timeout 1")
4. After "Timeout 1" executes, it schedules a microtask which runs immediately ("Promise inside Timeout")
5. Finally, the setTimeout inside the Promise callback runs ("Timeout inside Promise")

#### Example 2: Promise.all() with setTimeout

```javascript
const promise1 = new Promise(resolve => {
  setTimeout(() => {
    resolve("Promise 1 resolved");
  }, 2000);
});

const promise2 = new Promise(resolve => {
  setTimeout(() => {
    resolve("Promise 2 resolved");
  }, 1000);
});

console.log("Start");

Promise.all([promise1, promise2])
  .then(results => {
    console.log(results);
  });

console.log("End");
```

**Output:**
```
Start
End
["Promise 1 resolved", "Promise 2 resolved"]  // After 2 seconds
```

**Explanation:** `Promise.all()` waits for all promises in the array to resolve before its `.then()` callback is executed. Even though promise2 resolves after 1 second, the result is only logged after promise1 also resolves (after 2 seconds).

#### Example 3: Error Handling in Promises

```javascript
Promise.resolve()
  .then(() => {
    throw new Error("Something went wrong");
    return "This will never be reached";
  })
  .then(
    value => {
      console.log("Success:", value);
    },
    error => {
      console.log("Error handler in then:", error.message);
      return "Recovered";
    }
  )
  .then(value => {
    console.log("Next then:", value);
  })
  .catch(error => {
    console.log("Catch:", error.message);
  });
```

**Output:**
```
Error handler in then: Something went wrong
Next then: Recovered
```

**Explanation:** When an error is thrown in a Promise chain, it skips to the next error handler, which can be either a `.catch()` or the second function in a `.then()`. In this case, the error is caught by the error handler in the second `.then()`, which returns "Recovered". This value is then passed to the next `.then()` in the chain.

---

### Hard/Tricky Examples

#### Example 1: Promise Resolution and Multiple Microtasks

```javascript
console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    setTimeout(() => console.log("Timeout 2"), 0);
    return Promise.resolve("Promise 2");
  })
  .then(result => {
    console.log(result);
    Promise.resolve().then(() => {
      console.log("Promise 3");
      Promise.resolve().then(() => console.log("Promise 4"));
    });
  });

setTimeout(() => console.log("Timeout 3"), 0);

console.log("End");
```

**Output:**
```
Start
End
Promise 1
Promise 2
Promise 3
Promise 4
Timeout 1
Timeout 2
Timeout 3
```

**Explanation:** 
1. Synchronous code runs first ("Start" and "End")
2. All microtasks run before any macrotasks, and new microtasks are added to the end of the current microtask queue
3. After "Promise 1", a new setTimeout is scheduled
4. "Promise 2" is logged, then "Promise 3" and "Promise 4" are logged as they're all part of the microtask queue
5. Only after all microtasks are done, the macrotasks run in order ("Timeout 1", "Timeout 2", "Timeout 3")

#### Example 2: Nested Promises and setTimeout

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
}, 0);

new Promise((resolve, reject) => {
  console.log("Promise constructor");
  resolve();
})
  .then(() => {
    console.log("Promise 1");
    new Promise((resolve, reject) => {
      console.log("Inner promise constructor");
      resolve();
    })
      .then(() => {
        console.log("Inner promise 1");
      })
      .then(() => {
        console.log("Inner promise 2");
        setTimeout(() => {
          console.log("Inner timeout");
        }, 0);
      });
  })
  .then(() => {
    console.log("Promise 2");
  });

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

console.log("End");
```

**Output:**
```
Start
Promise constructor
End
Promise 1
Inner promise constructor
Inner promise 1
Promise 2
Inner promise 2
Timeout 1
Timeout 2
Inner timeout
```

**Explanation:** 
1. Synchronous code runs first ("Start", "Promise constructor", "End")
2. Microtasks run before macrotasks: "Promise 1", "Inner promise constructor", "Inner promise 1", "Promise 2", "Inner promise 2"
3. Then macrotasks run: "Timeout 1", "Timeout 2", "Inner timeout"
4. Note that "Promise 2" runs before "Inner promise 2" because the inner promise chain is a separate chain that doesn't block the outer chain

#### Example 3: Race Condition with setTimeout and Promises

```javascript
let value = 0;

setTimeout(() => {
  value = 1;
  console.log("Timeout value:", value);
}, 0);

Promise.resolve()
  .then(() => {
    value = 2;
    console.log("Promise value:", value);
  });

console.log("Initial value:", value);
```

**Output:**
```
Initial value: 0
Promise value: 2
Timeout value: 2
```

**Explanation:** 
1. The initial value is logged as 0
2. The Promise microtask runs before the setTimeout macrotask, setting the value to 2
3. When the setTimeout callback finally runs, it sets the value to 1, but then logs the current value, which is now 2 (because the Promise already changed it)
4. This demonstrates a race condition where the order of execution affects the final state

#### Example 4: Async/Await with setTimeout

```javascript
async function test() {
  console.log("Start of async function");
  
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  console.log("Before first await");
  await wait(1000);
  console.log("After 1 second");
  
  console.log("Before second await");
  await Promise.resolve("Immediate promise");
  console.log("After immediate promise");
  
  return "Done";
}

console.log("Before calling async function");
test().then(result => console.log("Result:", result));
console.log("After calling async function");
```

**Output:**
```
Before calling async function
Start of async function
Before first await
After calling async function
After 1 second
Before second await
After immediate promise
Result: Done
```

**Explanation:** 
1. Synchronous code runs first: "Before calling async function", then the function starts executing
2. Inside the function, synchronous code runs until the first await: "Start of async function", "Before first await"
3. The function is paused at the first await, and control returns to the caller: "After calling async function"
4. After 1 second, the Promise resolves and the function continues: "After 1 second", "Before second await"
5. The second await is for an immediately resolved Promise, so "After immediate promise" follows immediately
6. Finally, the function returns "Done" which is logged by the .then() handler
