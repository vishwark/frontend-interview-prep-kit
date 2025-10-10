// useMediaQuery hook
// Track if a media query matches the current viewport
//
// Use cases:
// 1. Responsive component rendering based on screen size
// 2. Adapting layouts for different device orientations
// 3. Implementing dark mode with prefers-color-scheme
// 4. Optimizing for reduced motion preferences
// 5. Detecting touch vs mouse input devices
// 6. Adjusting UI for print media

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that tracks if a media query matches the current viewport
 * 
 * @param {string} query - The media query to track
 * @param {Object} options - Configuration options
 * @param {boolean} [options.defaultValue=false] - Default value to use when SSR or media queries not supported
 * @param {boolean} [options.initializeWithValue=true] - Whether to initialize with the current match value
 * @returns {boolean} - Whether the media query matches
 */
function useMediaQuery(query, options = {}) {
  const {
    defaultValue = false,
    initializeWithValue = true
  } = options;

  // Check if window is available (for SSR)
  const isClient = typeof window !== 'undefined';
  
  // Function to get the current match value
  const getMatches = useCallback(() => {
    if (!isClient) {
      return defaultValue;
    }
    
    if (!window.matchMedia) {
      console.warn('matchMedia is not supported in this browser');
      return defaultValue;
    }
    
    return window.matchMedia(query).matches;
  }, [isClient, query, defaultValue]);

  // Initialize state with current value if requested, otherwise use default value
  const [matches, setMatches] = useState(initializeWithValue ? getMatches() : defaultValue);

  // Update matches when the media query changes
  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    if (!window.matchMedia) {
      console.warn('matchMedia is not supported in this browser');
      return;
    }
    
    // Set initial value
    setMatches(getMatches());
    
    // Create media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Define listener
    const listener = (event) => {
      setMatches(event.matches);
    };
    
    // Add listener
    if (mediaQueryList.addEventListener) {
      // Modern browsers
      mediaQueryList.addEventListener('change', listener);
    } else {
      // Older browsers (Safari)
      mediaQueryList.addListener(listener);
    }
    
    // Clean up listener
    return () => {
      if (mediaQueryList.removeEventListener) {
        // Modern browsers
        mediaQueryList.removeEventListener('change', listener);
      } else {
        // Older browsers (Safari)
        mediaQueryList.removeListener(listener);
      }
    };
  }, [isClient, query, getMatches]);

  return matches;
}

/**
 * Predefined media queries for common breakpoints
 */
export const breakpoints = {
  // Desktop-first (min-width) breakpoints
  sm: '(min-width: 640px)', 
  md: '(min-width: 768px)', 
  lg: '(min-width: 1024px)', 
  xl: '(min-width: 1280px)', 
  '2xl': '(min-width: 1536px)',
  
  // Mobile-first (max-width) breakpoints
  maxSm: '(max-width: 639px)',
  maxMd: '(max-width: 767px)',
  maxLg: '(max-width: 1023px)',
  maxXl: '(max-width: 1279px)',
  max2xl: '(max-width: 1535px)',
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Display features
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  darkMode: '(prefers-color-scheme: dark)', // '(prefers-color-scheme: dark)'
  lightMode: '(prefers-color-scheme: light)',//  '(prefers-color-scheme: light)'
  reducedMotion: '(prefers-reduced-motion: reduce)', // '(prefers-reduced-motion: reduce)'
  
  // Interaction
  hover: '(hover: hover)',
  touchscreen: '(hover: none) and (pointer: coarse)',
  
  // Print
  print: 'print'
};

/**
 * Custom hooks for common breakpoints
 */
export const useIsMobile = (options) => useMediaQuery(breakpoints.maxMd, options);
export const useIsTablet = (options) => useMediaQuery(`${breakpoints.md} and ${breakpoints.maxLg}`, options);
export const useIsDesktop = (options) => useMediaQuery(breakpoints.lg, options);
export const useIsPortrait = (options) => useMediaQuery(breakpoints.portrait, options);
export const useIsLandscape = (options) => useMediaQuery(breakpoints.landscape, options);
export const useIsDarkMode = (options) => useMediaQuery(breakpoints.darkMode, options);
export const useIsReducedMotion = (options) => useMediaQuery(breakpoints.reducedMotion, options);
export const useIsTouchscreen = (options) => useMediaQuery(breakpoints.touchscreen, options);
export const useIsPrint = (options) => useMediaQuery(breakpoints.print, options);

export default useMediaQuery;
