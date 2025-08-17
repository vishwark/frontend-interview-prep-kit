/**
 * Promise.race() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Promise.race() method.
 * Promise.race() takes an iterable of promises as input and returns a single Promise.
 * This returned promise settles with the eventual state of the first promise in the iterable to settle,
 * whether it's fulfilled or rejected.
 * 
 * Parameters:
 * - promises: An iterable (such as an array) of promises
 * 
 * Returns:
 * - A Promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects,
 *   with the value or reason from that promise
 * 
 * Edge Cases:
 * - If the iterable is empty, the returned promise never settles
 * - Non-promise values in the iterable are automatically converted to resolved promises
 * - The first promise to settle (either fulfill or reject) determines the outcome
 */

if (!Promise.race) {
  Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
      // Handle non-iterable case
      if (!promises || typeof promises[Symbol.iterator] !== 'function') {
        return reject(new TypeError('Promise.race accepts an iterable'));
      }

      // Handle empty array case - the promise will never settle
      
      // Process each promise
      for (const promise of promises) {
        // Convert non-promise values to promises and settle with the first one to settle
        Promise.resolve(promise).then(resolve, reject);
      }
    });
  };
}
