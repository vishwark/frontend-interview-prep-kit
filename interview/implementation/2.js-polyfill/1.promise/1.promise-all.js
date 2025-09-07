/**
 * Promise.all() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Promise.all() method.
 * Promise.all() takes an iterable(array, set, generator, etc.) of promises as input and returns a single Promise.
 * This returned promise fulfills when all the input promises have fulfilled, with an array of the fulfillment values.
 * It rejects when any of the input promises rejects, with the first rejection reason.
 * 
 * Parameters:
 * - promises: An iterable (such as an array/set/generators etc) of promises
 * 
 * Returns:
 * - A Promise that fulfills with an array of all the fulfillment values
 * - Or rejects with the reason of the first promise that rejects
 * 
 * Edge Cases:
 * - If the iterable is empty, it returns a promise that resolves to an empty array
 * - If any promise rejects, the entire Promise.all() rejects
 * - Non-promise values in the iterable are automatically converted to resolved promises
 */

if (!Promise.all) {
  Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
      // Handle non-iterable case
      if (!promises || typeof promises[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Promise.all accepts an iterable'));
      }

      const promiseArray = Array.from(promises);
      const results = [];
      let remainingPromises = promiseArray.length;
      
      // Handle empty array case
      if (remainingPromises === 0) {
        return resolve(results);
      }

      // Process each promise
      promiseArray.forEach((promise, index) => {
        // Convert non-promise values to promises
        Promise.resolve(promise)
          .then(value => {
            // Store the result at the correct index to maintain order
            results[index] = value;
            remainingPromises--;

            // If all promises have resolved, resolve the main promise
            if (remainingPromises === 0) {
              resolve(results);
            }
          })
          .catch(error => {
            // If any promise rejects, reject the main promise immediately
            reject(error);
          });
      });
    });
  };
}
