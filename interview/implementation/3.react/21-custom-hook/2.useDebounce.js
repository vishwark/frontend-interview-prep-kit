// useDebounce hook
// Delay execution of a function until after a specified wait time
//
// Use cases:
// 1. Search input to reduce API calls while typing
// 2. Form validation after user stops typing
// 3. Window resize event handling to prevent excessive calculations
// 4. Autocomplete/typeahead suggestions
// 5. Preventing double form submissions
// 6. Delaying expensive UI updates until user interaction pauses

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that debounces a value
 * 
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} [options.immediate=false] - Whether to execute on the leading edge instead of trailing
 * @returns {T} - The debounced value
 */
function useDebounce(value, delay, options = {}) {
  const { immediate = false } = options;
  const [debouncedValue, setDebouncedValue] = useState(value);
  const previousValueRef = useRef(value);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Set mounted ref to true on mount
    mountedRef.current = true;
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // If value hasn't changed, don't do anything
    if (value === previousValueRef.current) {
      return;
    }

    // Update the previous value
    previousValueRef.current = value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If immediate is true and this is the first call, update immediately
    if (immediate && timeoutRef.current === null) {
      setDebouncedValue(value);
    } else {
      // Otherwise, set a timeout to update the value after the delay
      timeoutRef.current = setTimeout(() => {
        // Only update if the component is still mounted
        if (mountedRef.current) {
          setDebouncedValue(value);
        }
      }, delay);
    }

    // Clean up the timeout on unmount or when value changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, immediate]);

  return debouncedValue;
}

/**
 * Custom hook that debounces a function
 * 
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} [options.immediate=false] - Whether to execute on the leading edge instead of trailing
 * @param {any[]} [options.deps=[]] - Dependencies array that will trigger a new debounced function
 * @returns {T} - The debounced function
 */
export function useDebouncedCallback(fn, delay, options = {}) {
  const { immediate = false, deps = [] } = options;
  const fnRef = useRef(fn);
  const timeoutRef = useRef(null);

  // Update the function ref when the function changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Create a memoized callback that will be stable across renders
  const debouncedFn = useRef((...args) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If immediate is true and this is the first call, execute immediately
    if (immediate && timeoutRef.current === null) {
      fnRef.current(...args);
    } else {
      // Otherwise, set a timeout to execute after the delay
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        fnRef.current(...args);
      }, delay);
    }
  }).current;

  // Clean up the timeout on unmount or when dependencies change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, immediate, ...deps]);

  return debouncedFn;
}

export default useDebounce;
