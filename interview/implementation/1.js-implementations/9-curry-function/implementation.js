/**
 * Curry Function
 * 
 * Description:
 * This file implements various curry function implementations that transform
 * a function of multiple arguments into a sequence of functions that each take a single argument.
 */

/**
 * Basic Curry Function
 * 
 * Description:
 * Transforms a function of N arguments into a sequence of N functions each taking a single argument.
 * 
 * Parameters:
 * - fn: The function to curry
 * 
 * Returns:
 * - A curried version of the original function
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles functions with any number of arguments
 * - Preserves the 'this' context of the original function
 */
function curry(fn) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Get the number of arguments the function expects
  const arity = fn.length;
  
  // Return a curried function
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

/**
 * Advanced Curry Function with Placeholder Support
 * 
 * Description:
 * Transforms a function of N arguments into a sequence of functions with placeholder support.
 * 
 * Parameters:
 * - fn: The function to curry
 * - arity (optional): The number of arguments to expect (defaults to fn.length)
 * - placeholder (optional): The placeholder value (defaults to curry.placeholder)
 * 
 * Returns:
 * - A curried version of the original function with placeholder support
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles functions with any number of arguments
 * - Supports placeholders for skipping arguments
 * - Preserves the 'this' context of the original function
 */
function curryWithPlaceholders(fn, arity = fn.length, placeholder = curryWithPlaceholders.placeholder) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Return a curried function
  return function curried(...args) {
    // Check if we have enough non-placeholder arguments
    const nonPlaceholderCount = args.filter(arg => arg !== placeholder).length;
    const hasPlaceholders = args.some(arg => arg === placeholder);
    
    // If we have enough arguments and no placeholders, call the original function
    if (nonPlaceholderCount >= arity && !hasPlaceholders) {
      return fn.apply(this, args.slice(0, arity));
    }
    
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      // Replace placeholders with corresponding arguments from moreArgs
      const newArgs = [...args];
      let moreArgsIndex = 0;
      
      for (let i = 0; i < newArgs.length && moreArgsIndex < moreArgs.length; i++) {
        if (newArgs[i] === placeholder) {
          newArgs[i] = moreArgs[moreArgsIndex++];
        }
      }
      
      // Append any remaining arguments
      const combinedArgs = [...newArgs, ...moreArgs.slice(moreArgsIndex)];
      
      // Recursively call the curried function with the new arguments
      return curried.apply(this, combinedArgs);
    };
  };
}

// Define the placeholder symbol
curryWithPlaceholders.placeholder = Symbol('placeholder');

/**
 * Partial Application Function
 * 
 * Description:
 * Creates a function that invokes the original function with some arguments pre-filled.
 * 
 * Parameters:
 * - fn: The function to partially apply
 * - ...args: Arguments to pre-fill
 * 
 * Returns:
 * - A new function with some arguments pre-filled
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Preserves the 'this' context of the original function
 */
function partial(fn, ...args) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Return a function with pre-filled arguments
  return function(...moreArgs) {
    return fn.apply(this, [...args, ...moreArgs]);
  };
}

/**
 * Right Curry Function
 * 
 * Description:
 * Transforms a function of N arguments into a sequence of N functions,
 * but fills arguments from right to left.
 * 
 * Parameters:
 * - fn: The function to curry
 * 
 * Returns:
 * - A right-curried version of the original function
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles functions with any number of arguments
 * - Preserves the 'this' context of the original function
 */
function curryRight(fn) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Get the number of arguments the function expects
  const arity = fn.length;
  
  // Return a curried function
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= arity) {
      // Reverse the arguments to fill from right to left
      return fn.apply(this, args.slice(0, arity).reverse());
    }
    
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

/**
 * Auto-Curry Function
 * 
 * Description:
 * Automatically curries a function based on the number of arguments provided.
 * 
 * Parameters:
 * - fn: The function to curry
 * - arity (optional): The number of arguments to expect (defaults to fn.length)
 * 
 * Returns:
 * - A curried version of the original function that automatically evaluates
 *   when all arguments are provided
 * 
 * Edge Cases:
 * - If fn is not a function, throws a TypeError
 * - Handles functions with any number of arguments
 * - Preserves the 'this' context of the original function
 */
function autoCurry(fn, arity = fn.length) {
  // Validate input
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  // Helper function to curry with a specific arity
  function curryWithArity(fn, arity, args = []) {
    return function(...moreArgs) {
      const combinedArgs = [...args, ...moreArgs];
      
      if (combinedArgs.length >= arity) {
        return fn.apply(this, combinedArgs.slice(0, arity));
      }
      
      return curryWithArity(fn, arity, combinedArgs);
    };
  }
  
  return curryWithArity(fn, arity);
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    curry,
    curryWithPlaceholders,
    partial,
    curryRight,
    autoCurry
  };
}
