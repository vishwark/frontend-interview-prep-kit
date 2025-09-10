# Parse Integer Without Built-in Functions

## Problem Understanding

### Definition

**Parsing integers** is the process of converting string representations of numbers into their actual numeric values. While JavaScript provides built-in functions like `parseInt()` and `Number()` for this purpose, implementing a custom parser helps understand the underlying conversion process and demonstrates algorithmic thinking.

This implementation focuses on creating functions that parse strings into integers without relying on JavaScript's built-in parsing functions.

## Number Base Systems

A **base system** (or **radix**) defines how many symbols (digits) are used to represent numbers.

### Available Base Systems

#### **Base-2 (Binary)**
- **Symbols**: 0, 1
- **Used in**: Computers, digital systems
- **Example**: 101 (binary) = 5 (decimal)

#### **Base-8 (Octal)**
- **Symbols**: 0-7
- **Used in**: Older computer systems
- **Example**: 12 (octal) = 10 (decimal)

#### **Base-10 (Decimal)**
- **Symbols**: 0-9
- **Used in**: Everyday arithmetic
- **Example**: 254 (decimal) = 254 (decimal)

#### **Base-16 (Hexadecimal)**
- **Symbols**: 0-9, a-f (a = 10, b = 11, ..., f = 15)
- **Used in**: Memory addresses, color codes
- **Example**: 2F (hex) = 47 (decimal)

#### **Base-36**
- **Symbols**: 0-9, a-z
- **Used in**: Compact representations (URLs, IDs)
- **Example**: z (base-36) = 35 (decimal)

### How Number Conversion Works

When converting a number from any base to decimal, each digit's value is multiplied by the base raised to the power of its position (counting from right to left, starting at 0).

For example, to convert the binary number `101` to decimal:
- 1 × 2² = 1 × 4 = 4
- 0 × 2¹ = 0 × 2 = 0
- 1 × 2⁰ = 1 × 1 = 1
- 1 × 2² + 0 × 2¹ + 1 × 2⁰ = 4 + 0 + 1 = 5
- Sum: 4 + 0 + 1 = 5

Similarly, to convert the hexadecimal number `2F` to decimal:
- 2 × 16¹ = 2 × 16 = 32
- F (15) × 16⁰ = 15 × 1 = 15
- 2 × 16¹ + F (15) × 16⁰ = 32 + 15 = 47
- Sum: 32 + 15 = 47

### Summary
- **Base-2 (Binary)** uses powers of 2: `2²`, `2¹`, `2⁰`
- **Base-8 (Octal)** uses powers of 8: `8¹`, `8⁰`
- **Base-10 (Decimal)** uses powers of 10: `10²`, `10¹`, `10⁰`
- **Base-16 (Hexadecimal)** uses powers of 16: `16¹`, `16⁰`
- **Base-36** uses powers of 36, with digits `0-9` and `a-z` for a total of 36 possible values.

### Parameters

#### Parse Integer Function
- `str`: The string to parse
- `radix` (optional): The base to use for conversion (default: 10)

#### Parse Binary Function
- `binaryStr`: The binary string to parse

#### Parse Hexadecimal Function
- `hexStr`: The hexadecimal string to parse

### Return Value

All parsing functions return:
- The parsed integer value if the string can be successfully parsed
- `NaN` (Not a Number) if the string cannot be parsed as an integer

### Edge Cases to Handle

1. **Input Validation**:
   - Empty strings
   - Non-string inputs
   - Strings with no valid digits

2. **Numeric Representation**:
   - Leading/trailing whitespace
   - Leading sign (+ or -)
   - Leading zeros
   - Non-numeric characters after valid digits

3. **Radix Handling**:
   - Invalid radix values (< 2 or > 36)
   - Digits that are invalid for the given radix

4. **Special Formats**:
   - Binary strings (containing only 0s and 1s)
   - Hexadecimal strings (with or without '0x' prefix)
   - Scientific notation (e.g., "1e3")

5. **Overflow/Underflow**:
   - Very large numbers that exceed JavaScript's number limits
   - Very small numbers that approach zero

### Use Cases

1. **Educational Purposes**:
   - Understanding how number parsing works
   - Learning about different number bases and conversion algorithms

2. **Custom Parsing Requirements**:
   - Implementing parsers with specific behavior different from built-in functions
   - Creating parsers for custom number formats

3. **Interview Preparation**:
   - Demonstrating understanding of string manipulation
   - Showing knowledge of number systems and conversions

4. **Performance Optimization**:
   - In specific scenarios, a custom parser might be more efficient than built-in functions
   - Tailoring the parser to specific known input formats

### Implementation Approaches

#### Character-by-Character Processing

1. **Basic Algorithm**:
   - Initialize result to 0
   - For each character in the string:
     - Convert the character to its numeric value
     - Multiply the current result by the radix
     - Add the numeric value of the character
   - Apply the sign to the final result

2. **Optimizations**:
   - Early validation of input
   - Handling special prefixes (like '0x' for hexadecimal)
   - Breaking early when invalid characters are encountered

#### Handling Different Bases

1. **Decimal (Base 10)**:
   - Characters '0' through '9' map to values 0-9

2. **Binary (Base 2)**:
   - Characters '0' and '1' map to values 0 and 1

3. **Hexadecimal (Base 16)**:
   - Characters '0' through '9' map to values 0-9
   - Characters 'a' through 'f' (or 'A' through 'F') map to values 10-15

4. **Other Bases**:
   - For bases up to 36, use digits and letters (case-insensitive)
   - For example, in base 36, 'z' or 'Z' represents the value 35

### Time and Space Complexity

- **Time Complexity**: O(n) where n is the length of the input string
- **Space Complexity**: O(1) as we only use a constant amount of extra space

### Comparison with Built-in Functions

| Aspect | Custom Implementation | Built-in parseInt() |
|--------|----------------------|-------------------|
| Flexibility | Can be tailored to specific needs | Fixed behavior |
| Error Handling | Can implement custom error handling | Returns NaN for invalid inputs |
| Performance | May be optimized for specific cases | Generally well-optimized |
| Features | Limited to what's implemented | Handles various edge cases |

### Common Interview Questions

1. How would you handle parsing very large integers that exceed JavaScript's number limits?
2. Can you implement a parser that handles scientific notation (e.g., "1.23e4")?
3. How would you modify your implementation to handle floating-point numbers?
4. What are the differences between your implementation and JavaScript's built-in parseInt()?
5. How would you optimize your parser for a specific use case where you know the input format in advance?
