// useThrottle hook
// Limit the execution rate of a function
//
// Use cases:
// 1. Scroll event handling to improve performance
// 2. Mouse move events for drag operations
// 3. Game input handling for consistent frame rates
// 4. Real-time data visualization updates
// 5. Limiting API requests during continuous user interaction
// 6. Preventing UI jank during intensive operations

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that throttles a value
 * 
 * @template T
 * @param {T} value - The value to throttle
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} [options.leading=true] - Whether to execute on the leading edge
 * @param {boolean} [options.trailing=true] - Whether to execute on the trailing edge
 * @returns {T} - The throttled value
 */
function useThrottle(value, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecutedRef = useRef(0);
  const timeoutRef = useRef(null);
  const valueRef = useRef(value);
  const waitingRef = useRef(false);

  // Update the value ref when the value changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecutedRef.current;
    
    // If this is the first call or enough time has passed since the last execution
    if (elapsed >= delay) {
      if (leading || lastExecutedRef.current !== 0) {
        lastExecutedRef.current = now;
        setThrottledValue(value);
      }
      waitingRef.current = false;
    } else if (!waitingRef.current && trailing) {
      // Schedule a trailing execution
      waitingRef.current = true;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a timeout to execute after the remaining delay
      timeoutRef.current = setTimeout(() => {
        lastExecutedRef.current = Date.now();
        waitingRef.current = false;
        setThrottledValue(valueRef.current);
      }, delay - elapsed);
    }
  }, [value, delay, leading, trailing]);

  return throttledValue;
}

/**
 * Custom hook that throttles a function
 * 
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} [options.leading=true] - Whether to execute on the leading edge
 * @param {boolean} [options.trailing=true] - Whether to execute on the trailing edge
 * @param {any[]} [options.deps=[]] - Dependencies array that will trigger a new throttled function
 * @returns {T} - The throttled function
 */
export function useThrottledCallback(fn, delay, options = {}) {
  const { leading = true, trailing = true, deps = [] } = options;
  const fnRef = useRef(fn);
  const lastExecutedRef = useRef(0);
  const timeoutRef = useRef(null);
  const argsRef = useRef([]);
  const waitingRef = useRef(false);

  // Update the function ref when the function changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Clean up on unmount or when dependencies change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, leading, trailing, ...deps]);

  // Create a memoized callback that will be stable across renders
  const throttledFn = useCallback((...args) => {
    const now = Date.now();
    const elapsed = now - lastExecutedRef.current;
    
    // Save the latest arguments
    argsRef.current = args;
    
    // If this is the first call or enough time has passed since the last execution
    if (elapsed >= delay) {
      if (leading || lastExecutedRef.current !== 0) {
        lastExecutedRef.current = now;
        fnRef.current(...args);
      }
      waitingRef.current = false;
    } else if (!waitingRef.current && trailing) {
      // Schedule a trailing execution
      waitingRef.current = true;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a timeout to execute after the remaining delay
      timeoutRef.current = setTimeout(() => {
        lastExecutedRef.current = Date.now();
        waitingRef.current = false;
        fnRef.current(...argsRef.current);
      }, delay - elapsed);
    }
  }, [delay, leading, trailing]);

  return throttledFn;
}

export default useThrottle;
