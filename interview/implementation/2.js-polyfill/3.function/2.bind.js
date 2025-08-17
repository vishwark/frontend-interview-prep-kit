/**
 * Function.prototype.bind() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Function.prototype.bind() method.
 * The bind() method creates a new function that, when called, has its 'this' keyword
 * set to the provided value, with a given sequence of arguments preceding any
 * provided when the new function is called.
 * 
 * Parameters:
 * - thisArg: The value to be passed as the 'this' parameter to the target function when the bound function is called
 * - arg1, arg2, ... (optional): Arguments to prepend to arguments provided to the bound function when invoking the target function
 * 
 * Returns:
 * - A new function with the same body and scope as the original function, but with 'this' bound to the specified value
 * 
 * Edge Cases:
 * - If thisArg is null or undefined, the global object will be used as 'this' in non-strict mode
 * - The bound function will maintain the prototype chain of the original function
 * - When used as a constructor with 'new', the provided 'this' is ignored, but prepended arguments are still passed
 */

if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    // If the function being bound is not actually a function
    if (typeof this !== 'function') {
      throw new TypeError(this + ' is not a function');
    }
    
    // Store the original function
    const originalFunction = this;
    
    // Get the arguments to be prepended (excluding thisArg)
    const boundArgs = Array.prototype.slice.call(arguments, 1);
    
    // Create a new function that will be returned
    const boundFunction = function() {
      // Get the arguments passed to the bound function
      const args = Array.prototype.slice.call(arguments);
      
      // Combine the bound arguments with the new arguments
      const allArgs = boundArgs.concat(args);
      
      // If the bound function is being used as a constructor (with 'new')
      if (this instanceof boundFunction) {
        // Create a new instance of the original function
        // and pass the combined arguments
        return originalFunction.apply(this, allArgs);
      }
      
      // Otherwise, call the original function with the bound 'this' value
      // and the combined arguments
      return originalFunction.apply(thisArg, allArgs);
    };
    
    // Create a new prototype object that inherits from the original function's prototype
    if (originalFunction.prototype) {
      // Use Object.create to create a new object with the original function's prototype
      const Empty = function() {};
      Empty.prototype = originalFunction.prototype;
      boundFunction.prototype = new Empty();
      // Restore the constructor property
      boundFunction.prototype.constructor = boundFunction;
    }
    
    return boundFunction;
  };
}
