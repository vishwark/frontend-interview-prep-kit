# JavaScript Type Coercion

## What is Type Coercion?

Type coercion is the automatic or implicit conversion of values from one data type to another in JavaScript. It happens when operations are performed between different types, and JavaScript attempts to convert one or both values to a common type to perform the operation.

There are two types of type coercion:
- **Implicit Coercion**: Happens automatically when JavaScript converts types behind the scenes
- **Explicit Coercion**: When you intentionally convert types using functions like `Number()`, `String()`, or `Boolean()`

### Closely Related Concepts
- **Type Conversion**: The general process of changing one data type to another
- **Primitive Types**: String, Number, Boolean, Undefined, Null, Symbol, and BigInt
- **Truthy and Falsy Values**: Values that evaluate to true or false in boolean contexts
- **Equality Operators**: `==` (loose equality) vs. `===` (strict equality)
- **Comparison Operators**: `<`, `>`, `<=`, `>=`
- **Arithmetic Operators**: `+`, `-`, `*`, `/`, etc.
- **Logical Operators**: `&&`, `||`, `!`
- **The + Operator**: Special behavior when used with strings and other types

## Common Scenarios Where Developers Get Tricked

1. **Loose Equality (`==`)**: Performs type coercion before comparison, leading to unexpected results
2. **String Concatenation vs. Addition**: The `+` operator behaves differently with strings vs. numbers
3. **Truthy and Falsy Values**: Not all values that seem "empty" are falsy
4. **Numeric Conversion**: Rules for converting strings, objects, arrays, etc. to numbers
5. **Boolean Conversion**: Rules for converting different values to booleans
6. **Object to Primitive Conversion**: How objects are converted to primitives
7. **Comparison with `null` and `undefined`**: Special rules apply
8. **Implicit Coercion in Conditional Statements**: How values are coerced in `if` statements, ternary operators, etc.

---

## Code Snippets

### Simple Examples

#### Example 1: Loose Equality (`==`) vs. Strict Equality (`===`)

```javascript
console.log(5 == "5");
console.log(5 === "5");
console.log(0 == false);
console.log(0 === false);
console.log("" == false);
console.log("" === false);
```

**Output:**
```
true
false
true
false
true
false
```

**Explanation:** The loose equality operator (`==`) performs type coercion, converting values to a common type before comparison. The strict equality operator (`===`) does not perform type coercion and requires both value and type to be the same.

#### Example 2: String Concatenation vs. Addition

```javascript
console.log(1 + 2);
console.log("1" + "2");
console.log(1 + "2");
console.log("1" + 2);
console.log(1 + 2 + "3");
console.log("1" + 2 + 3);
```

**Output:**
```
3
12
12
12
33
123
```

**Explanation:** When the `+` operator is used with numbers, it performs addition. When used with strings, it performs concatenation. If one operand is a string and the other is a number, the number is converted to a string and concatenation is performed. Operations are evaluated from left to right.

#### Example 3: Truthy and Falsy Values

```javascript
console.log(Boolean(0));
console.log(Boolean(""));
console.log(Boolean(null));
console.log(Boolean(undefined));
console.log(Boolean(NaN));
console.log(Boolean(false));

console.log(Boolean(1));
console.log(Boolean("hello"));
console.log(Boolean([]));
console.log(Boolean({}));
console.log(Boolean(function() {}));
```

**Output:**
```
false
false
false
false
false
false

true
true
true
true
true
```

**Explanation:** In JavaScript, the following values are falsy: `0`, `""` (empty string), `null`, `undefined`, `NaN`, and `false`. All other values, including empty arrays and objects, are truthy.

#### Example 4: Implicit Coercion in Conditional Statements

```javascript
if (1) {
  console.log("1 is truthy");
}

if ("0") {
  console.log("'0' is truthy");
}

if ([]) {
  console.log("[] is truthy");
}

if (0) {
  console.log("This won't be logged");
} else {
  console.log("0 is falsy");
}

if ("") {
  console.log("This won't be logged");
} else {
  console.log("Empty string is falsy");
}
```

**Output:**
```
1 is truthy
'0' is truthy
[] is truthy
0 is falsy
Empty string is falsy
```

**Explanation:** In conditional statements like `if`, the condition is implicitly coerced to a boolean. Values that are truthy evaluate to `true`, while falsy values evaluate to `false`.

#### Example 5: Numeric Conversion

```javascript
console.log(Number("123"));
console.log(Number("12.3"));
console.log(Number(""));
console.log(Number("hello"));
console.log(Number(true));
console.log(Number(false));
console.log(Number(null));
console.log(Number(undefined));
```

**Output:**
```
123
12.3
0
NaN
1
0
0
NaN
```

**Explanation:** The `Number()` function converts values to numbers. Strings with valid numeric content are converted to their numeric value. Empty strings become `0`. Strings with non-numeric content become `NaN`. `true` becomes `1`, `false` becomes `0`. `null` becomes `0`, and `undefined` becomes `NaN`.

#### Example 6: The + Operator for Type Conversion

```javascript
console.log(+"123");
console.log(+"12.3");
console.log(+"");
console.log(+"hello");
console.log(+true);
console.log(+false);
console.log(+null);
console.log(+undefined);
```

**Output:**
```
123
12.3
0
NaN
1
0
0
NaN
```

**Explanation:** The unary `+` operator converts values to numbers using the same rules as the `Number()` function. It's a shorthand way to perform numeric conversion.

#### Example 7: Boolean Conversion with Logical Operators

```javascript
console.log("hello" && "world");
console.log("" && "world");
console.log("hello" && "");
console.log("hello" || "world");
console.log("" || "world");
console.log("" || 0);
console.log(!!"hello");
console.log(!!"");
```

**Output:**
```
world
""
""
hello
world
0
true
false
```

**Explanation:** The `&&` operator returns the first falsy value or the last value if all are truthy. The `||` operator returns the first truthy value or the last value if all are falsy. The `!!` operator converts a value to its boolean equivalent.

---

### Intermediate Examples

#### Example 1: Object to Primitive Conversion

```javascript
const obj = {
  valueOf: function() {
    return 42;
  },
  toString: function() {
    return "hello";
  }
};

console.log(obj + 1);
console.log(`${obj}`);
console.log(Number(obj));
console.log(String(obj));
```

**Output:**
```
43
hello
42
hello
```

**Explanation:** When objects are used in operations that expect primitives, JavaScript calls either `valueOf()` or `toString()` to convert the object. For numeric operations like `+`, `valueOf()` is called first. For string operations like template literals, `toString()` is called first.

#### Example 2: Array to Primitive Conversion

```javascript
console.log([1, 2, 3] + 4);
console.log([1, 2, 3] - 1);
console.log([1] + [2]);
console.log([1] - [2]);
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log({} + {});
```

**Output:**
```
1,2,34
NaN
12
-1
""
[object Object]
[object Object]
[object Object][object Object]
```

**Explanation:** Arrays are first converted to strings using `toString()` (which joins elements with commas) before further operations. For `+`, string concatenation is performed. For `-`, numeric conversion is attempted. Empty arrays convert to empty strings. Objects convert to the string `[object Object]`.

#### Example 3: Comparison Operators and Type Coercion

```javascript
console.log(5 > 3);
console.log(5 > "3");
console.log("5" > 3);
console.log("5" > "3");
console.log([5] > 3);
console.log([5] > [3]);
console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);
```

**Output:**
```
true
true
true
true
true
true
false
false
true
```

**Explanation:** Comparison operators attempt to convert values to numbers. Strings are compared lexicographically if both operands are strings. Arrays are converted to primitives. The comparison of `null` with numbers has special rules: `null` is not greater than `0`, not equal to `0`, but is greater than or equal to `0` (because `>=` is treated as "not less than").

#### Example 4: Logical Operators and Short-Circuit Evaluation

```javascript
function greet() {
  console.log("Hello");
  return "World";
}

console.log(true && greet());
console.log(false && greet());
console.log(true || greet());
console.log(false || greet());
```

**Output:**
```
Hello
World
true
Hello
World
```

**Explanation:** Logical operators use short-circuit evaluation. For `&&`, if the first operand is falsy, the second operand is not evaluated. For `||`, if the first operand is truthy, the second operand is not evaluated.

#### Example 5: Implicit Coercion in Template Literals

```javascript
const value = 42;
const obj = {
  toString: function() {
    return "Custom String";
  }
};
const arr = [1, 2, 3];

console.log(`Value: ${value}`);
console.log(`Object: ${obj}`);
console.log(`Array: ${arr}`);
console.log(`Null: ${null}`);
console.log(`Undefined: ${undefined}`);
```

**Output:**
```
Value: 42
Object: Custom String
Array: 1,2,3
Null: null
Undefined: undefined
```

**Explanation:** Template literals implicitly convert values to strings. For objects, the `toString()` method is called. Arrays are converted to strings by joining elements with commas. `null` and `undefined` are converted to their string representations.

#### Example 6: Type Coercion with the Nullish Coalescing Operator

```javascript
console.log(null ?? "default");
console.log(undefined ?? "default");
console.log(0 ?? "default");
console.log("" ?? "default");
console.log(false ?? "default");
console.log(NaN ?? "default");
```

**Output:**
```
default
default
0
""
false
NaN
```

**Explanation:** The nullish coalescing operator (`??`) returns the right-hand operand only when the left-hand operand is `null` or `undefined`. Unlike `||`, it doesn't check for falsy values, so `0`, `""`, `false`, and `NaN` are returned as is.

#### Example 7: Type Coercion in Switch Statements

```javascript
const value = "1";

switch (value) {
  case 1:
    console.log("Number 1");
    break;
  case "1":
    console.log("String 1");
    break;
  default:
    console.log("Neither");
}
```

**Output:**
```
String 1
```

**Explanation:** Unlike the `==` operator, the `switch` statement uses strict equality (`===`) for case comparisons. No type coercion is performed, so `"1"` matches the case `"1"` but not the case `1`.

---

### Hard/Tricky Examples

#### Example 1: Complex Coercion Chains

```javascript
console.log(1 + +"2" + +"3");
console.log("" + {} + [] + null + true);
console.log([] + {} + [] === "[object Object]");
console.log((!+[] + [] + ![]).length);
console.log(+"1e6" + +"0x10" + +"0b10" + +"010");
```

**Output:**
```
6
[object Object]nulltrue
true
9
1000026
```

**Explanation:** 
1. `1 + +"2" + +"3"` is `1 + 2 + 3` = `6` (unary `+` converts strings to numbers)
2. `"" + {} + [] + null + true` concatenates all values as strings
3. `[] + {} + [] === "[object Object]"` is false because the left side is `"[object Object]"` + `""` = `"[object Object]"`
4. `(!+[] + [] + ![])` is `"truefalse"`, which has length 9
5. `+"1e6" + +"0x10" + +"0b10" + +"010"` is `1000000 + 16 + 2 + 8` = `1000026` (different numeric literals)

#### Example 2: Equality with `null` and `undefined`

```javascript
console.log(null == undefined);
console.log(null === undefined);
console.log(null == 0);
console.log(null === 0);
console.log(undefined == 0);
console.log(undefined === 0);
console.log(null == false);
console.log(undefined == false);
console.log(null == "");
console.log(undefined == "");
```

**Output:**
```
true
false
false
false
false
false
false
false
false
false
```

**Explanation:** `null` and `undefined` are loosely equal to each other but not to any other value. They are not strictly equal to each other or to any other value. This is a special rule in the equality algorithm.

#### Example 3: The Abstract Equality Algorithm

```javascript
console.log("0" == 0);
console.log("0" == false);
console.log(0 == false);
console.log("false" == false);
console.log([0] == 0);
console.log([0] == "0");
console.log([1, 2] == "1,2");
console.log([null] == "");
console.log([undefined] == "");
console.log([null] == "null");
```

**Output:**
```
true
true
true
false
true
true
true
false
true
false
```

**Explanation:** The abstract equality algorithm (`==`) follows complex rules. When comparing values of different types, one or both values are converted to a common type. Arrays are converted to strings before comparison with strings or numbers. `[null]` becomes `""` when converted to a string, while `[undefined]` also becomes `""`.

#### Example 4: Operator Precedence and Type Coercion

```javascript
console.log(1 + 2 + "3");
console.log("1" + 2 + 3);
console.log(1 + "2" + 3);
console.log(1 + +"2" + 3);
console.log(1 + -"2" + 3);
console.log(+"1" + +"2" + +"3");
```

**Output:**
```
33
123
123
6
2
6
```

**Explanation:** Operator precedence and associativity determine the order of operations. The unary `+` and `-` operators have higher precedence than the binary `+` operator. Operations are evaluated from left to right, and type coercion happens at each step.

#### Example 5: Object Property Access and Type Coercion

```javascript
const obj = {
  "1": "one",
  true: "yes"
};

console.log(obj[1]);
console.log(obj["1"]);
console.log(obj[true]);
console.log(obj["true"]);
console.log(obj[1.0]);
console.log(obj["1.0"]);
```

**Output:**
```
one
one
yes
yes
one
undefined
```

**Explanation:** Object property names are always strings. When using bracket notation with non-string values, they are converted to strings. Numbers `1` and `1.0` both convert to the string `"1"`. The boolean `true` converts to the string `"true"`.

#### Example 6: Type Coercion in Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(arr.indexOf("3"));
console.log(arr.includes("3"));
console.log(arr.find(x => x == "3"));
console.log(arr.findIndex(x => x == "3"));
console.log(arr.filter(x => x == "3"));
```

**Output:**
```
-1
false
3
2
[3]
```

**Explanation:** Different array methods handle type coercion differently. `indexOf` and `includes` use strict equality (`===`), so they don't find the string `"3"`. `find`, `findIndex`, and `filter` use the callback's return value, which can perform loose equality (`==`).

#### Example 7: Bitwise Operators and Type Coercion

```javascript
console.log(~~"123");
console.log(~~"123.45");
console.log(~~"-123.45");
console.log(~~{});
console.log(~~[]);
console.log(~~[123]);
console.log(~~true);
console.log(~~false);
console.log(~~null);
console.log(~~undefined);
```

**Output:**
```
123
123
-123
0
0
123
1
0
0
0
```

**Explanation:** The double bitwise NOT (`~~`) is a trick to truncate numbers and convert other types to integers. It first converts the value to a number, then to a 32-bit integer, effectively removing the decimal part. It's similar to `Math.trunc()` for positive numbers.

#### Example 8: Type Coercion with Date Objects

```javascript
const date = new Date(2023, 0, 1);

console.log(+date);
console.log(date - 0);
console.log(date + 0);
console.log(date == date.getTime());
console.log(date === date.getTime());
console.log(date > new Date(2022, 0, 1));
console.log(date < "2024-01-01");
```

**Output:**
```
1672511400000 (or similar timestamp)
1672511400000 (or similar timestamp)
Sun Jan 01 2023 00:00:00 GMT+0530 (India Standard Time)0
true
false
true
true
```

**Explanation:** When used with numeric operators like `+`, `-`, `>`, `<`, etc., `Date` objects are converted to numbers (timestamps). When used with the `+` operator and a string, they are converted to strings. A `Date` object is loosely equal to its timestamp but not strictly equal.

#### Example 9: Type Coercion in JSON

```javascript
const obj = {
  num: 123,
  str: "hello",
  bool: true,
  nil: null,
  undef: undefined,
  inf: Infinity,
  nan: NaN,
  date: new Date(),
  func: function() {},
  sym: Symbol("symbol")
};

const json = JSON.stringify(obj);
console.log(json);
console.log(JSON.parse(json));
```

**Output:**
```
{"num":123,"str":"hello","bool":true,"nil":null,"inf":null,"nan":null,"date":"2023-01-01T00:00:00.000Z"}
{num: 123, str: "hello", bool: true, nil: null, inf: null, nan: null, date: "2023-01-01T00:00:00.000Z"}
```

**Explanation:** `JSON.stringify()` performs type coercion when converting values to JSON. `undefined`, functions, and symbols are omitted. `Infinity` and `NaN` are converted to `null`. `Date` objects are converted to ISO strings. When parsing the JSON back, the date remains a string.

#### Example 10: Type Coercion in Regular Expressions

```javascript
console.log(/123/.test(123));
console.log(/true/.test(true));
console.log(/null/.test(null));
console.log(/undefined/.test(undefined));
console.log(/NaN/.test(NaN));
console.log(/\[object Object\]/.test({}));
console.log(/1,2,3/.test([1, 2, 3]));
```

**Output:**
```
true
true
true
true
true
true
true
```

**Explanation:** When using non-string values with regular expressions, they are first converted to strings. Numbers, booleans, `null`, `undefined`, and `NaN` are converted to their string representations. Objects are converted to `"[object Object]"`. Arrays are converted to strings by joining elements with commas.
