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
  Function.prototype.bind = function (thisArg, ...boundArgs) {
    if (typeof this !== "function") {
      throw new TypeError(this + " is not callable");
    }

    const originalFn = this;

    function boundFn(...args) {
      // If called with 'new', ignore thisArg and use the new instance
      if (this instanceof boundFn) {
        return new originalFn(...boundArgs, ...args);
      }
      // Otherwise, call with given thisArg
      return originalFn.apply(thisArg, [...boundArgs, ...args]);
    }

    // Preserve prototype chain for 'new' usage
    boundFn.prototype = Object.create(originalFn.prototype);

    return boundFn;
  };
}
