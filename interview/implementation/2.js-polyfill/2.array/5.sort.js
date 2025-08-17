/**
 * Array.prototype.sort() Polyfill
 * 
 * Description:
 * This is a polyfill for the native Array.prototype.sort() method.
 * The sort() method sorts the elements of an array in place and returns the sorted array.
 * The default sort order is ascending, built upon converting the elements into strings,
 * then comparing their sequences of UTF-16 code units values.
 * 
 * Parameters:
 * - compareFunction (optional): Function that defines the sort order. If omitted,
 *   the array elements are converted to strings, then sorted according to each character's Unicode code point value.
 *   The function takes two arguments:
 *   - firstEl: The first element for comparison
 *   - secondEl: The second element for comparison
 *   Return value should be:
 *   - Negative if firstEl should come before secondEl
 *   - Positive if firstEl should come after secondEl
 *   - Zero if they are equal and their order doesn't matter
 * 
 * Returns:
 * - The sorted array (the same array, sorted in-place)
 * 
 * Edge Cases:
 * - If compareFunction is not provided, elements are sorted by converting them to strings and comparing strings in UTF-16 code units order
 * - If compareFunction(a, b) returns 0, the order of a and b remains unchanged
 * - The sort method can be unpredictable if the compareFunction is inconsistent
 */

if (!Array.prototype._sort) {
  // Store the original sort method if it exists
  Array.prototype._sort = Array.prototype.sort;
  
  Array.prototype.sort = function(compareFunction) {
    // If no compare function is provided, use the default string comparison
    if (compareFunction === undefined) {
      compareFunction = function(a, b) {
        // Convert to strings for comparison
        const strA = String(a);
        const strB = String(b);
        
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
      };
    }
    
    // Implement a simple quicksort algorithm
    const quickSort = function(arr, left, right, compareFn) {
      if (left < right) {
        const pivotIndex = partition(arr, left, right, compareFn);
        quickSort(arr, left, pivotIndex - 1, compareFn);
        quickSort(arr, pivotIndex + 1, right, compareFn);
      }
      return arr;
    };
    
    const partition = function(arr, left, right, compareFn) {
      const pivot = arr[right];
      let i = left - 1;
      
      for (let j = left; j < right; j++) {
        if (compareFn(arr[j], pivot) <= 0) {
          i++;
          // Swap elements
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
      
      // Swap pivot to its final position
      const temp = arr[i + 1];
      arr[i + 1] = arr[right];
      arr[right] = temp;
      
      return i + 1;
    };
    
    // If the native sort is available, use it
    if (typeof this._sort === 'function') {
      return this._sort(compareFunction);
    }
    
    // Otherwise, use our quicksort implementation
    return quickSort(this, 0, this.length - 1, compareFunction);
  };
}
