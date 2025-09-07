/**
 * Function.prototype.call() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Function.prototype.call() method.
 * The call() method calls a function with a given 'this' value and arguments provided individually.
 * 
 * Parameters:
 * - thisArg: The value to use as 'this' when calling the function
 * - arg1, arg2, ... (optional): Arguments for the function
 * 
 * Returns:
 * - The result of calling the function with the specified 'this' value and arguments
 * 
 * Edge Cases:
 * - If thisArg is null or undefined in non-strict mode, it will default to the global object
 * - If the function is called in strict mode, the value of thisArg is not converted to an object
 * - Primitive values are converted to objects when passed as thisArg in non-strict mode
 */

if (!Function.prototype.call) {
  Function.prototype.call = function (thisArg, ...args) {
    if (typeof this !== "function") {
      throw new TypeError(this + " is not callable");
    }

    // Handle null/undefined → global object(node:global,browser:window,globalThis)
    thisArg = thisArg ?? (typeof window !== "undefined" ? window : global);

    // Convert to object (to support primitives like string/number)
    thisArg = Object(thisArg);

    // Create a temporary property to hold the function
    const fnKey = Symbol("fn");
    thisArg[fnKey] = this;

    // Call the function
    const result = thisArg[fnKey](...args);

    // Remove temporary property
    delete thisArg[fnKey];

    return result;
  };
}

