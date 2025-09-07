/**
 * Promise.any() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Promise.any() method.
 * Promise.any() takes an iterable of promises as input and returns a single Promise.
 * This returned promise fulfills when any of the input promises fulfills, with the fulfillment value of the first promise to fulfill.
 * It rejects when all of the input promises reject, with an AggregateError containing all rejection reasons.
 * 
 * Parameters:
 * - promises: An iterable (such as an array/set/generators etc) of promises
 * 
 * Returns:
 * - A Promise that fulfills with the value of the first promise to fulfill
 * - Or rejects with an AggregateError containing all rejection reasons if all promises reject
 * 
 * Edge Cases:
 * - If the iterable is empty, it returns a promise that rejects with an AggregateError
 * - Non-promise values in the iterable are automatically converted to resolved promises
 * - If any promise fulfills, the returned promise immediately fulfills with that value
 */

if (!Promise.any) {
  Promise.any = function(promises) {
    return new Promise((resolve, reject) => {
      // Handle non-iterable case
      if (!promises || typeof promises[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Promise.any accepts an iterable'));
      }

      const promiseArray = Array.from(promises);
      const errors = [];
      let remainingPromises = promiseArray.length;
      
      // Handle empty array case
      if (remainingPromises === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }

      // Process each promise
      promiseArray.forEach((promise, index) => {
        // Convert non-promise values to promises
        Promise.resolve(promise)
          .then(value => {
            // If any promise fulfills, immediately resolve with its value
            resolve(value);
          })
          .catch(error => {
            // Store the error
            errors[index] = error;
            remainingPromises--;

            // If all promises have rejected, reject with AggregateError
            if (remainingPromises === 0) {
              // Use AggregateError if available, otherwise create a similar error object
              
              // const AggregateErrorConstructor = 
              //   typeof AggregateError !== 'undefined' ? 
              //   AggregateError : 
              //   function(errors, message) {
              //     const error = new Error(message);
              //     error.name = 'AggregateError';
              //     error.errors = errors;
              //     return error;
              //   };
              
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          });
      });
    });
  };
}
