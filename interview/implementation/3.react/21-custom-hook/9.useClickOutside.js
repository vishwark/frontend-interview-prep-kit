// useClickOutside hook
// Detect clicks outside a specified element
//
// Use cases:
// 1. Closing modals when clicking outside
// 2. Dismissing dropdown menus on outside clicks
// 3. Hiding tooltips when clicking elsewhere
// 4. Collapsing navigation menus on mobile
// 5. Implementing custom select components
// 6. Managing popup or overlay dismissal

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that detects clicks outside of the specified element(s)
 * 
 * @param {function} onClickOutside - Callback function to execute when a click outside is detected
 * @param {Object} options - Configuration options
 * @param {boolean} [options.enabled=true] - Whether the hook is enabled
 * @param {Array<string>} [options.excludeRefs=[]] - Array of refs to exclude from outside click detection
 * @param {Array<string>} [options.excludeClasses=[]] - Array of class names to exclude from outside click detection
 * @param {Array<string>} [options.excludeIds=[]] - Array of element IDs to exclude from outside click detection
 * @param {boolean} [options.triggerOnEscape=false] - Whether to trigger the callback on Escape key press
 * @returns {Object} - Ref to attach to the element and control functions
 */
function useClickOutside(onClickOutside, options = {}) {
  const {
    enabled = true,
    excludeRefs = [],
    excludeClasses = [],
    excludeIds = [],
    triggerOnEscape = false
  } = options;

  // Create a ref for the element
  const ref = useRef(null);
  const onClickOutsideRef = useRef(onClickOutside);
  const excludeRefsRef = useRef(excludeRefs);

  // Update callback ref when it changes
  useEffect(() => {
    onClickOutsideRef.current = onClickOutside;
    excludeRefsRef.current = excludeRefs;
  }, [onClickOutside, excludeRefs]);

  // Check if an element should be excluded from outside click detection
  const isExcluded = useCallback((target) => {
    // Check if the target is the ref element or contained within it
    if (ref.current && ref.current.contains(target)) {
      return true;
    }
    
    // Check if the target is in one of the excluded refs or contained within them
    for (const excludeRef of excludeRefsRef.current) {
      if (excludeRef && excludeRef.current && excludeRef.current.contains(target)) {
        return true;
      }
    }
    
    // Check if the target has one of the excluded classes
    for (const className of excludeClasses) {
      if (target.classList && target.classList.contains(className)) {
        return true;
      }
    }
    
    // Check if the target has one of the excluded IDs
    for (const id of excludeIds) {
      if (target.id === id) {
        return true;
      }
    }
    
    return false;
  }, [excludeClasses, excludeIds]);

  // Handle click events
  const handleClickOutside = useCallback((event) => {
    // Skip if disabled or no callback
    if (!enabled || !onClickOutsideRef.current) {
      return;
    }
    
    // Skip if the click target should be excluded
    if (isExcluded(event.target)) {
      return;
    }
    
    // Call the callback
    onClickOutsideRef.current(event);
  }, [enabled, isExcluded]);

  // Handle key events (for Escape key)
  const handleKeyDown = useCallback((event) => {
    // Skip if disabled, no callback, or not Escape key
    if (!enabled || !triggerOnEscape || !onClickOutsideRef.current || event.key !== 'Escape') {
      return;
    }
    
    // Call the callback
    onClickOutsideRef.current(event);
  }, [enabled, triggerOnEscape]);

  // Set up event listeners
  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      return;
    }
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    if (triggerOnEscape) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      
      if (triggerOnEscape) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [enabled, handleClickOutside, handleKeyDown, triggerOnEscape]);

  // Function to manually enable/disable the hook
  const setEnabled = useCallback((isEnabled) => {
    options.enabled = isEnabled;
  }, [options]);

  return {
    ref,
    setEnabled
  };
}

/**
 * Custom hook that detects clicks outside of multiple elements
 * 
 * @param {function} onClickOutside - Callback function to execute when a click outside is detected
 * @param {Array<React.RefObject>} refs - Array of refs to check for outside clicks
 * @param {Object} options - Configuration options (same as useClickOutside)
 * @returns {Object} - Control functions
 */
export function useClickOutsideMultiple(onClickOutside, refs = [], options = {}) {
  const onClickOutsideRef = useRef(onClickOutside);
  const refsRef = useRef(refs);
  
  // Update refs when they change
  useEffect(() => {
    onClickOutsideRef.current = onClickOutside;
    refsRef.current = refs;
  }, [onClickOutside, refs]);
  
  // Use the base hook with a dummy ref
  const dummyRef = useRef(null);
  
  // Modify the isExcluded function to check all refs
  const isExcluded = useCallback((target) => {
    // Check if the target is in one of the refs or contained within them
    for (const ref of refsRef.current) {
      if (ref && ref.current && ref.current.contains(target)) {
        return true;
      }
    }
    
    // Check other exclusions from options
    const { excludeRefs = [], excludeClasses = [], excludeIds = [] } = options;
    
    // Check excluded refs
    for (const excludeRef of excludeRefs) {
      if (excludeRef && excludeRef.current && excludeRef.current.contains(target)) {
        return true;
      }
    }
    
    // Check excluded classes
    for (const className of excludeClasses) {
      if (target.classList && target.classList.contains(className)) {
        return true;
      }
    }
    
    // Check excluded IDs
    for (const id of excludeIds) {
      if (target.id === id) {
        return true;
      }
    }
    
    return false;
  }, [options]);
  
  // Handle click events
  const handleClickOutside = useCallback((event) => {
    const { enabled = true } = options;
    
    // Skip if disabled or no callback
    if (!enabled || !onClickOutsideRef.current) {
      return;
    }
    
    // Skip if the click target should be excluded
    if (isExcluded(event.target)) {
      return;
    }
    
    // Call the callback
    onClickOutsideRef.current(event);
  }, [options, isExcluded]);
  
  // Handle key events (for Escape key)
  const handleKeyDown = useCallback((event) => {
    const { enabled = true, triggerOnEscape = false } = options;
    
    // Skip if disabled, no callback, or not Escape key
    if (!enabled || !triggerOnEscape || !onClickOutsideRef.current || event.key !== 'Escape') {
      return;
    }
    
    // Call the callback
    onClickOutsideRef.current(event);
  }, [options]);
  
  // Set up event listeners
  useEffect(() => {
    const { enabled = true, triggerOnEscape = false } = options;
    
    // Skip if disabled
    if (!enabled) {
      return;
    }
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    if (triggerOnEscape) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      
      if (triggerOnEscape) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [options, handleClickOutside, handleKeyDown]);
  
  // Function to manually enable/disable the hook
  const setEnabled = useCallback((isEnabled) => {
    options.enabled = isEnabled;
  }, [options]);
  
  return {
    setEnabled
  };
}

export default useClickOutside;
