/**
 * Object.create() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Object.create() method.
 * The Object.create() method creates a new object with the specified prototype object and properties.
 * It allows you to create an object without having to use a constructor function,
 * providing a cleaner way to implement inheritance.
 * 
 * Parameters:
 * - proto: The object which should be the prototype of the newly-created object
 * - propertiesObject (optional): An object whose enumerable own properties specify property descriptors
 *   to be added to the newly-created object
 * 
 * Returns:
 * - A new object with the specified prototype object and properties
 * 
 * Edge Cases:
 * - If proto is not an object or null, a TypeError is thrown
 * - If propertiesObject is specified, it works like Object.defineProperties()
 * - If propertiesObject contains non-object property descriptors, a TypeError is thrown
 */

if (!Object.create) {
  Object.create = function(proto, propertiesObject) {
    // Check if proto is an object or null
    if (typeof proto !== 'object' && proto !== null) {
      throw new TypeError('Object prototype may only be an Object or null: ' + proto);
    }
    
    // Create a temporary constructor function
    function F() {}
    
    // Set its prototype to the provided proto
    F.prototype = proto;
    
    // Create a new instance of F
    const obj = new F();
    
    // If propertiesObject is provided, define properties on the new object
    if (propertiesObject !== undefined) {
      // Check if propertiesObject is an object
      if (typeof propertiesObject !== 'object') {
        throw new TypeError('Property descriptor list must be an Object.');
      }
      
      // Use Object.defineProperties if available
      if (Object.defineProperties) {
        Object.defineProperties(obj, propertiesObject);
      } else {
        // Fallback for environments without Object.defineProperties
        for (const prop in propertiesObject) {
          if (propertiesObject.hasOwnProperty(prop)) {
            const descriptor = propertiesObject[prop];
            
            // Check if descriptor is an object
            if (typeof descriptor !== 'object' || descriptor === null) {
              throw new TypeError('Property descriptors must be objects: ' + descriptor);
            }
            
            // Define the property using Object.defineProperty if available
            if (Object.defineProperty) {
              Object.defineProperty(obj, prop, descriptor);
            } else {
              // Fallback for very old browsers without Object.defineProperty
              // Note: This doesn't support all descriptor features
              if ('value' in descriptor) {
                obj[prop] = descriptor.value;
              }
            }
          }
        }
      }
    }
    
    return obj;
  };
}
