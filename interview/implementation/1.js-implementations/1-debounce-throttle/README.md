# Debounce and Throttle Functions

## Problem Understanding

### Definition

**Debounce** and **Throttle** are two techniques used to control how many times a function is executed over time.

- **Debounce**: A debounced function will only execute after a specified amount of time has passed without it being called again. This effectively delays the function execution until the calls have "settled down".

- **Throttle**: A throttled function will execute at most once per specified time period, regardless of how many times it's called. This effectively limits the rate at which the function can execute.

### Parameters

#### Debounce Function
- `func`: The function to debounce
- `wait`: The number of milliseconds to delay
- `immediate` (optional): If true, trigger the function on the leading edge instead of the trailing edge

#### Throttle Function
- `func`: The function to throttle
- `wait`: The number of milliseconds to throttle invocations to
- `options` (optional): An object with configuration options:
  - `leading`: If false, suppress the function call on the leading edge
  - `trailing`: If false, suppress the function call on the trailing edge

### Return Value

Both functions return a new function that wraps the original function with the debounce or throttle behavior.

### Edge Cases to Handle

#### Debounce
- If `wait` is 0 or negative, the function should behave like a regular function call
- If `func` is not a function, throw a TypeError
- Proper handling of `this` context and arguments
- Handling of immediate execution option

#### Throttle
- If `wait` is 0 or negative, the function should behave like a regular function call
- If `func` is not a function, throw a TypeError
- If both `leading` and `trailing` options are false, the function will never be called
- Proper handling of `this` context and arguments
- Handling of the first call (leading edge) and last call (trailing edge)

### Use Cases

#### Debounce
1. **Search Input**: Wait until the user stops typing before making API calls
2. **Window Resize**: Recalculate layout only after the user has finished resizing the window
3. **Form Validation**: Validate form fields after the user has stopped typing
4. **Button Clicks**: Prevent double submissions by debouncing the click handler

#### Throttle
1. **Scroll Events**: Update UI elements during scrolling without overwhelming the browser
2. **Game Input**: Process user input at a consistent rate in games
3. **API Rate Limiting**: Ensure API calls don't exceed rate limits
4. **Mousemove Events**: Track mouse position without excessive function calls

### Differences Between Debounce and Throttle

| Aspect | Debounce | Throttle |
|--------|----------|----------|
| Timing | Waits for a quiet period | Executes at a regular interval |
| Execution | Only after the quiet period | At most once per time period |
| Use Case | When you care about the final state | When you need regular updates |
| Example | Search as you type | Scroll position updates |

### Implementation Considerations

1. **Memory Usage**: Both functions create closures that maintain state between calls
2. **Performance Impact**: Improper implementation can lead to memory leaks or unexpected behavior
3. **Cancellation**: Consider implementing a way to cancel pending executions
4. **Leading/Trailing Options**: Flexibility in when the function executes (beginning or end of the wait period)

## Visual Explanation

### Debounce
```
Calls:      X     XX    X           X
            │     ││    │           │
            │     ││    │           │
Time: ──────┼─────┼┼────┼───────────┼────────>
            │     ││    │           │
Execution:  │     │     │           X
            └─wait┘└─wait┘└────wait─┘
```

### Throttle
```
Calls:      X  X  X  X  X  X  X  X  X
            │  │  │  │  │  │  │  │  │
            │  │  │  │  │  │  │  │  │
Time: ──────┼──┼──┼──┼──┼──┼──┼──┼──┼────>
            │  │  │  │  │  │  │  │  │
Execution:  X     X     X     X     X
            └─wait┘└─wait┘└─wait┘└─wait┘
