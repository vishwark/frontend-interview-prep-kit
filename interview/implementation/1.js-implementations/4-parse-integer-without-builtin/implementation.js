/**
 * Parse Integer Without Built-in Functions
 * 
 * Description:
 * This file implements functions to parse strings into integers without using built-in
 * parsing functions like parseInt() or Number().
 */

/**
 * Parse Integer
 * 
 * Description:
 * Converts a string representation of an integer to its numeric value without using
 * built-in parsing functions.
 * 
 * Parameters:
 * - str: The string to parse
 * - radix (optional): The base to use for conversion (default: 10)
 * 
 * Returns:
 * - The parsed integer value
 * - NaN if the string cannot be parsed as an integer
 * 
 * Edge Cases:
 * - Empty strings return NaN
 * - Leading/trailing whitespace is ignored
 * - Leading sign (+ or -) is handled
 * - Non-numeric characters after the first valid digit are ignored (like parseInt)
 * - Invalid radix values (< 2 or > 36) return NaN
 */
function parseIntCustom(str, radix = 10) {
  // Validate radix
  if (radix < 2 || radix > 36 || !Number.isInteger(radix)) {
    return NaN;
  }
  
  // Handle empty or non-string input
  if (typeof str !== 'string' || str.trim() === '') {
    return NaN;
  }
  
  // Trim whitespace and get the sign
  str = str.trim();
  let sign = 1;
  let startIndex = 0;
  
  if (str[0] === '+') {
    startIndex = 1;
  } else if (str[0] === '-') {
    sign = -1;
    startIndex = 1;
  }
  
  // Process each character
  let result = 0;
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  
  for (let i = startIndex; i < str.length; i++) {
    const char = str[i].toLowerCase();
    const digit = digits.indexOf(char);
    
    // If character is not a valid digit in the given radix, stop parsing
    if (digit === -1 || digit >= radix) {
      break;
    }
    
    // Update result
    result = result * radix + digit;
  }
  
  return sign * result;
}

/**
 * Parse Binary String
 * 
 * Description:
 * Converts a binary string to its decimal integer value.
 * 
 * Parameters:
 * - binaryStr: The binary string to parse
 * 
 * Returns:
 * - The decimal integer value
 * - NaN if the string is not a valid binary number
 * 
 * Edge Cases:
 * - Empty strings return NaN
 * - Strings with characters other than 0 and 1 return NaN
 * - Leading/trailing whitespace is ignored
 * - Leading sign (+ or -) is handled
 */
function parseBinary(binaryStr) {
  // Validate input
  if (typeof binaryStr !== 'string' || binaryStr.trim() === '') {
    return NaN;
  }
  
  // Trim whitespace and get the sign
  binaryStr = binaryStr.trim();
  let sign = 1;
  let startIndex = 0;
  
  if (binaryStr[0] === '+') {
    startIndex = 1;
  } else if (binaryStr[0] === '-') {
    sign = -1;
    startIndex = 1;
  }
  
  // Validate binary string
  for (let i = startIndex; i < binaryStr.length; i++) {
    if (binaryStr[i] !== '0' && binaryStr[i] !== '1') {
      return NaN;
    }
  }
  
  // Convert binary to decimal
  let result = 0;
  for (let i = startIndex; i < binaryStr.length; i++) {
    result = result * 2 + (binaryStr[i] === '1' ? 1 : 0);
  }
  
  return sign * result;
}

/**
 * Parse Hexadecimal String
 * 
 * Description:
 * Converts a hexadecimal string to its decimal integer value.
 * 
 * Parameters:
 * - hexStr: The hexadecimal string to parse
 * 
 * Returns:
 * - The decimal integer value
 * - NaN if the string is not a valid hexadecimal number
 * 
 * Edge Cases:
 * - Empty strings return NaN
 * - Strings with invalid hexadecimal characters return NaN
 * - Leading/trailing whitespace is ignored
 * - Leading sign (+ or -) is handled
 * - Handles both '0x' prefix and no prefix
 */
function parseHex(hexStr) {
  // Validate input
  if (typeof hexStr !== 'string' || hexStr.trim() === '') {
    return NaN;
  }
  
  // Trim whitespace and get the sign
  hexStr = hexStr.trim();
  let sign = 1;
  let startIndex = 0;
  
  if (hexStr[0] === '+') {
    startIndex = 1;
  } else if (hexStr[0] === '-') {
    sign = -1;
    startIndex = 1;
  }
  
  // Handle '0x' prefix
  if (hexStr.substring(startIndex, startIndex + 2).toLowerCase() === '0x') {
    startIndex += 2;
  }
  
  // Convert hex to decimal
  let result = 0;
  const hexDigits = '0123456789abcdef';
  
  for (let i = startIndex; i < hexStr.length; i++) {
    const char = hexStr[i].toLowerCase();
    const digit = hexDigits.indexOf(char);
    
    // If character is not a valid hex digit, return NaN
    if (digit === -1) {
      return NaN;
    }
    
    // Update result
    result = result * 16 + digit;
  }
  
  return sign * result;
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseIntCustom,
    parseBinary,
    parseHex
  };
}
