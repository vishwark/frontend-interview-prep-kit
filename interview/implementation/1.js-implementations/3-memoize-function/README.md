# Memoize Function

## Problem Understanding

### Definition

**Memoization** is an optimization technique that speeds up function execution by storing the results of expensive function calls and returning the cached result when the same inputs occur again. It's a specific form of caching that is particularly useful for pure functions (functions that always return the same output for the same input).

### Parameters

#### Basic Memoize Function
- `func`: The function to memoize

#### Advanced Memoize Function
- `func`: The function to memoize
- `resolver` (optional): A function that determines the cache key for storing the result

#### Memoize with LRU Cache
- `func`: The function to memoize
- `maxSize` (optional): The maximum size of the cache (default: 100)
- `resolver` (optional): A function that determines the cache key for storing the result

### Return Value

All memoize functions return a new function that:
1. Checks if the result for the given arguments is already in the cache
2. If found, returns the cached result
3. If not found, calls the original function, stores the result in the cache, and returns it

### Edge Cases to Handle

1. **Input Validation**:
   - Non-function input for `func`
   - Invalid `maxSize` for LRU cache (non-positive number)

2. **Cache Key Generation**:
   - Multiple arguments
   - Non-primitive arguments (objects, arrays)
   - Functions as arguments
   - Circular references

3. **Cache Management**:
   - Memory leaks from unbounded cache growth
   - Cache eviction strategies (LRU, LFU, time-based)
   - Cache invalidation

4. **Context Handling**:
   - Preserving `this` context when the memoized function is called

5. **Special Cases**:
   - Functions with side effects
   - Non-deterministic functions
   - Functions that rely on external state

### Use Cases

1. **Expensive Computations**:
   - Fibonacci sequence calculation
   - Factorial calculation
   - Prime number checking
   - Dynamic programming problems

2. **API Calls**:
   - Caching responses to reduce network requests
   - Implementing client-side data stores

3. **DOM Operations**:
   - Caching computed styles
   - Storing element references
   - Optimizing layout calculations

4. **React Applications**:
   - Memoizing component props
   - Optimizing selectors in Redux
   - Preventing unnecessary re-renders

### Implementation Approaches

#### Simple Memoization
- Uses a basic cache (object or Map)
- Works well for functions with a single argument
- Limited in handling complex arguments

#### Advanced Memoization
- Uses serialization (like JSON.stringify) for complex arguments
- Supports custom resolver functions for key generation
- Handles multiple arguments

#### LRU Cache Memoization
- Limits cache size to prevent memory issues
- Implements Least Recently Used eviction strategy
- Balances performance with memory usage

### Time and Space Complexity

- **Time Complexity**:
  - Cache hit: O(1) for simple keys, O(log n) for complex keys with Map
  - Cache miss: O(1) + original function complexity
  - LRU update: O(n) where n is the cache size

- **Space Complexity**:
  - O(n) where n is the number of unique inputs (or maxSize for LRU)

### Common Interview Questions

1. How would you implement memoization for a recursive function like Fibonacci?
2. How would you handle memoization for functions with object arguments?
3. What strategies would you use to prevent memory leaks in a memoized function?
4. How would you implement a time-based cache expiration in a memoize function?
5. How would you memoize a function that depends on external state?

### Code Example: Fibonacci with Memoization

```javascript
// Without memoization - O(2^n)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// With memoization - O(n)
function fibonacciMemoized(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
  return memo[n];
}
```

### Performance Comparison

| Function | n=10 | n=30 | n=40 |
|----------|------|------|------|
| fibonacci | ~1ms | ~20s | ~30min |
| fibonacciMemoized | <1ms | <1ms | <1ms |

This demonstrates the dramatic performance improvement that memoization can provide for functions with overlapping subproblems.
