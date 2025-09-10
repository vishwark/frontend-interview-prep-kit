// useWindowSize hook
// Track window dimensions and respond to resize events
//
// Use cases:
// 1. Responsive layouts that adapt to window size changes
// 2. Conditional rendering based on screen dimensions
// 3. Dynamic positioning of tooltips and popovers
// 4. Optimizing canvas or SVG rendering for current viewport
// 5. Implementing custom breakpoints for component behavior
// 6. Adjusting font sizes or spacing based on screen size

import { useState, useEffect, useCallback } from 'react';
import { useThrottledCallback } from './3.useThrottle';

/**
 * Custom hook that tracks window dimensions and responds to resize events
 * 
 * @param {Object} options - Configuration options
 * @param {number} [options.throttleMs=200] - Throttle delay in milliseconds for resize events
 * @param {boolean} [options.initialWidth=0] - Initial width to use before window is available
 * @param {boolean} [options.initialHeight=0] - Initial height to use before window is available
 * @returns {Object} - Window dimensions and related utilities
 */
function useWindowSize(options = {}) {
  const {
    throttleMs = 200,
    initialWidth = 0,
    initialHeight = 0
  } = options;

  // Initialize state with initial dimensions or window dimensions if available
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : initialWidth,
    height: typeof window !== 'undefined' ? window.innerHeight : initialHeight
  });

  // Determine if we're on the client side
  const isClient = typeof window !== 'undefined';

  // Function to update window size
  const updateSize = useCallback(() => {
    if (!isClient) return;
    
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, [isClient]);

  // Throttle the resize handler to improve performance
  const handleResize = useThrottledCallback(updateSize, throttleMs);

  // Set up event listener for window resize
  useEffect(() => {
    if (!isClient) {
      return;
    }

    // Update size immediately to ensure we have the correct initial size
    updateSize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient, updateSize, handleResize]);

  // Helper functions to determine screen size based on common breakpoints
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // Helper function to determine orientation
  const orientation = windowSize.width > windowSize.height ? 'landscape' : 'portrait';

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    orientation
  };
}

export default useWindowSize;
