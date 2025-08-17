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

if (!Function.prototype._call) {
  // Store the original call method if it exists
  Function.prototype._call = Function.prototype.call;
  
  Function.prototype.call = function(thisArg) {
    // If the original call method exists, use it
    if (typeof this._call === 'function') {
      return this._call.apply(this, arguments);
    }
    
    // If the function being called is not actually a function
    if (typeof this !== 'function') {
      throw new TypeError(this + ' is not a function');
    }
    
    // Handle null or undefined thisArg in non-strict mode
    thisArg = thisArg === null || thisArg === undefined ? 
              (typeof window !== 'undefined' ? window : global) : 
              Object(thisArg);
    
    // Create a unique property name to avoid overwriting existing properties
    const uniqueProp = '_' + Math.random().toString(36).substr(2, 9);
    
    // Store the function as a property of thisArg
    thisArg[uniqueProp] = this;
    
    // Get the arguments (excluding thisArg)
    const args = [];
    for (let i = 1; i < arguments.length; i++) {
      args.push('arguments[' + i + ']');
    }
    
    // Call the function and store the result
    // Using eval to dynamically create the function call with the arguments
    const result = eval('thisArg[uniqueProp](' + args.join(',') + ')');
    
    // Remove the temporary property
    delete thisArg[uniqueProp];
    
    // Return the result
    return result;
  };
}
