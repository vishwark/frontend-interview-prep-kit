/**
 * Promise.allSettled() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Promise.allSettled() method.
 * Promise.allSettled() takes an iterable of promises as input and returns a single Promise.
 * This returned promise always fulfills after all of the input promises have settled
 * (either fulfilled or rejected), with an array of objects describing the outcome of each promise.
 * 
 * Parameters:
 * - promises: An iterable (such as an array) of promises
 * 
 * Returns:
 * - A Promise that fulfills with an array of objects, each describing the outcome of each promise:
 *   - For fulfilled promises: { status: 'fulfilled', value: <fulfillment value> }
 *   - For rejected promises: { status: 'rejected', reason: <rejection reason> }
 * 
 * Edge Cases:
 * - If the iterable is empty, it returns a promise that resolves to an empty array
 * - Unlike Promise.all(), Promise.allSettled() never rejects
 * - Non-promise values in the iterable are automatically converted to resolved promises
 */

if (!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return new Promise((resolve) => {
      // Handle non-iterable case
      if (!promises || typeof promises[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Promise.allSettled accepts an iterable'));
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
            // Store the fulfilled result
            results[index] = { status: 'fulfilled', value };
            checkIfDone();
          })
          .catch(reason => {
            // Store the rejected result
            results[index] = { status: 'rejected', reason };
            checkIfDone();
          });
      });

      // Helper function to check if all promises have settled
      function checkIfDone() {
        remainingPromises--;
        if (remainingPromises === 0) {
          resolve(results);
        }
      }
    });
  };
}
