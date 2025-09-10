// useLocalStorage hook
// Persists state in localStorage
//
// Use cases:
// 1. Saving user preferences (theme, language, etc.)
// 2. Persisting form data to prevent loss on page refresh
// 3. Storing authentication tokens for session management
// 4. Saving shopping cart items in e-commerce applications
// 5. Remembering UI state (expanded/collapsed sections, selected tabs)
// 6. Caching API responses to reduce network requests

import { useState, useEffect } from 'react';

/**
 * Custom hook that persists state in localStorage
 * 
 * @template T
 * @param {string} key - The key to store the value under in localStorage
 * @param {T} initialValue - The initial value to use if no value is found in localStorage
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>, () => void]} - A tuple containing the current value, a setter function, and a function to remove the value from localStorage
 */
function useLocalStorage(key, initialValue) {
  // Get from localStorage then parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove from localStorage
  const removeValue = () => {
    try {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset state
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    // Remove event listener on cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
