/**
 * Function.prototype.apply() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Function.prototype.apply() method.
 * The apply() method calls a function with a given 'this' value and arguments provided as an array
 * (or an array-like object).
 * 
 * Parameters:
 * - thisArg: The value to use as 'this' when calling the function
 * - argsArray (optional): An array-like object containing the arguments to pass to the function
 * 
 * Returns:
 * - The result of calling the function with the specified 'this' value and arguments
 * 
 * Edge Cases:
 * - If thisArg is null or undefined in non-strict mode, it will default to the global object
 * - If the function is called in strict mode, the value of thisArg is not converted to an object
 * - If argsArray is not provided or is null/undefined, no arguments are passed to the function
 * - Primitive values are converted to objects when passed as thisArg in non-strict mode
 */

if (!Function.prototype.apply) {
  Function.prototype.apply = function (thisArg, argsArray) {
    // 1. Ensure 'this' is a function
    if (typeof this !== "function") {
      throw new TypeError(this + " is not callable");
    }

    // 2. Handle null/undefined -> default to global object
    thisArg = thisArg ?? (typeof window !== "undefined" ? window : global);

    // 3. Convert to object (in case of primitives)
    thisArg = Object(thisArg);

    // 4. Create a temporary property on thisArg to hold the function
    const fnKey = Symbol("fn");
    thisArg[fnKey] = this;

    // 5. Call the function with spread arguments
    const result = argsArray ? thisArg[fnKey](...argsArray) : thisArg[fnKey]();

    // 6. Remove the temporary property
    delete thisArg[fnKey];

    // 7. Return the result
    return result;
  };
}

