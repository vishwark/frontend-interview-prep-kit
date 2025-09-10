// useIntersectionObserver hook
// Track when an element enters or exits the viewport
//
// Use cases:
// 1. Lazy loading images as they enter the viewport
// 2. Implementing infinite scroll functionality
// 3. Triggering animations when elements become visible
// 4. Tracking user engagement with content sections
// 5. Implementing sticky headers that appear on scroll
// 6. Building read progress indicators for articles

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that tracks when an element enters or exits the viewport
 * 
 * @param {Object} options - Configuration options
 * @param {number|number[]} [options.threshold=0] - A number or array of numbers between 0 and 1 indicating the percentage of the target's visibility needed to trigger a callback
 * @param {string} [options.root=null] - The element that is used as the viewport for checking visibility
 * @param {string} [options.rootMargin='0px'] - Margin around the root element
 * @param {boolean} [options.triggerOnce=false] - Whether to unobserve the element after it has been intersected once
 * @param {boolean} [options.skip=false] - Whether to skip observation
 * @param {function} [options.onEnter] - Callback function when element enters the viewport
 * @param {function} [options.onExit] - Callback function when element exits the viewport
 * @returns {Object} - Intersection observer state and ref
 */
function useIntersectionObserver(options = {}) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false,
    onEnter,
    onExit
  } = options;

  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const onEnterRef = useRef(onEnter);
  const onExitRef = useRef(onExit);

  // Update callback refs when callbacks change
  useEffect(() => {
    onEnterRef.current = onEnter;
    onExitRef.current = onExit;
  }, [onEnter, onExit]);

  // Cleanup function to disconnect the observer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Setup the intersection observer
  const observe = useCallback(() => {
    // Skip if no element or already observed
    if (!elementRef.current || observerRef.current || skip) {
      return;
    }

    // Skip if the element has been visible and triggerOnce is true
    if (triggerOnce && hasBeenVisible) {
      return;
    }

    // Create a new IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isElementIntersecting = entry.isIntersecting;

        // Update state
        setEntry(entry);
        setIsIntersecting(isElementIntersecting);

        // Call callbacks
        if (isElementIntersecting) {
          setHasBeenVisible(true);
          if (onEnterRef.current) {
            onEnterRef.current(entry);
          }
          
          // Unobserve if triggerOnce is true
          if (triggerOnce) {
            cleanup();
          }
        } else if (onExitRef.current) {
          onExitRef.current(entry);
        }
      },
      {
        threshold,
        root: root ? document.querySelector(root) : null,
        rootMargin
      }
    );

    // Start observing the element
    observer.observe(elementRef.current);
    observerRef.current = observer;

    return cleanup;
  }, [threshold, root, rootMargin, triggerOnce, skip, hasBeenVisible, cleanup]);

  // Setup and cleanup the observer
  useEffect(() => {
    // Skip if IntersectionObserver is not supported
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser.');
      return;
    }

    // Skip if we should not observe
    if (skip) {
      cleanup();
      return;
    }

    // Start observing
    const unobserve = observe();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (unobserve) {
        unobserve();
      }
    };
  }, [observe, cleanup, skip]);

  // Function to manually set the element to observe
  const setElement = useCallback((element) => {
    if (element !== elementRef.current) {
      cleanup();
      elementRef.current = element;
      observe();
    }
  }, [cleanup, observe]);

  return {
    ref: elementRef,
    setElement,
    entry,
    isIntersecting,
    hasBeenVisible
  };
}

/**
 * Custom hook for lazy loading images
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.src - The source URL of the image
 * @param {string} [options.placeholderSrc] - Placeholder image URL to show while loading
 * @param {number} [options.threshold=0] - Threshold for intersection observer
 * @param {string} [options.rootMargin='50px'] - Root margin for intersection observer
 * @returns {Object} - Image state and ref
 */
export function useLazyImage(options) {
  const { src, placeholderSrc, threshold = 0, rootMargin = '50px' } = options;
  
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  // Load the image when it comes into view
  useEffect(() => {
    if (!isIntersecting || loaded) {
      return;
    }

    const image = new Image();
    image.src = src;
    image.onload = () => {
      setCurrentSrc(src);
      setLoaded(true);
    };
    image.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
  }, [isIntersecting, src, loaded]);

  return { ref, loaded, currentSrc };
}

/**
 * Custom hook for implementing infinite scrolling
 * 
 * @param {Object} options - Configuration options
 * @param {function} options.onLoadMore - Function to call when more items should be loaded
 * @param {boolean} [options.hasMore=true] - Whether there are more items to load
 * @param {boolean} [options.loading=false] - Whether items are currently being loaded
 * @param {number} [options.threshold=0.5] - Threshold for intersection observer
 * @param {string} [options.rootMargin='100px'] - Root margin for intersection observer
 * @returns {Object} - Infinite scroll state and ref
 */
export function useInfiniteScroll(options) {
  const { 
    onLoadMore, 
    hasMore = true, 
    loading = false, 
    threshold = 0.5, 
    rootMargin = '100px' 
  } = options;

  const onLoadMoreRef = useRef(onLoadMore);

  // Update callback ref when onLoadMore changes
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Setup intersection observer for the sentinel element
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    skip: !hasMore || loading
  });

  // Call onLoadMore when the sentinel element is intersecting
  useEffect(() => {
    if (isIntersecting && hasMore && !loading && onLoadMoreRef.current) {
      onLoadMoreRef.current();
    }
  }, [isIntersecting, hasMore, loading]);

  return { ref, isIntersecting };
}

export default useIntersectionObserver;
