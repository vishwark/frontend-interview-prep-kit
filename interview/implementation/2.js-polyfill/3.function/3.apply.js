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

if (!Function.prototype._apply) {
  // Store the original apply method if it exists
  Function.prototype._apply = Function.prototype.apply;
  
  Function.prototype.apply = function(thisArg, argsArray) {
    // If the original apply method exists, use it
    if (typeof this._apply === 'function') {
      return this._apply.call(this, thisArg, argsArray);
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
    
    // Handle the case where argsArray is not provided or is null/undefined
    let result;
    if (argsArray === undefined || argsArray === null) {
      result = thisArg[uniqueProp]();
    } else {
      // Check if argsArray is array-like
      if (typeof argsArray !== 'object' && typeof argsArray !== 'function') {
        throw new TypeError('CreateListFromArrayLike called on non-object');
      }
      
      const args = [];
      const length = argsArray.length || 0;
      
      // Convert argsArray to a real array of arguments
      for (let i = 0; i < length; i++) {
        args.push('argsArray[' + i + ']');
      }
      
      // Call the function with the arguments
      // Using eval to dynamically create the function call with the arguments
      result = eval('thisArg[uniqueProp](' + args.join(',') + ')');
    }
    
    // Remove the temporary property
    delete thisArg[uniqueProp];
    
    // Return the result
    return result;
  };
}
