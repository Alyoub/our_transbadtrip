## Introduction

JavaScript is a versatile, high-level programming language primarily used for web development. It allows developers to create dynamic and interactive web pages, enhancing user experience. JavaScript can be run in the browser or on the server (using environments like Node.js). This tutorial covers the most important concepts and features of JavaScript, providing a solid foundation for beginners and a useful reference for experienced developers.

---

## Table of Contents

1. Basics
2. Data Types
3. Variables
4. Operators
5. Control Structures
6. Functions
7. Objects
8. Arrays
9. ES6 Features
10. Asynchronous JavaScript
11. Error Handling
12. DOM Manipulation
13. Event Handling
14. Modules
15. Promises and Async/Await
16. Classes and Inheritance
17. JSON
18. Regular Expressions
19. Conclusion

---

## 1. Basics

### Tutorial

- **Syntax**: JavaScript code is written in plain text and executed by the browser. It follows a specific syntax that includes statements, expressions, and declarations.
- **Comments**: Comments are essential for documenting code. Use `//` for single-line comments and `/* */` for multi-line comments.

### Example:

```javascript
// This is a single-line comment
/* This is
   a multi-line comment */
console.log('Hello, World!'); // Prints "Hello, World!" to the console
```

### Resources

- [MDN JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)
- [JavaScript.info - Getting Started](https://javascript.info/hello-world)
- [freeCodeCamp - JavaScript Basics](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/)

---

## 2. Data Types

### Tutorial

- **Primitive Types**: Number, String, Boolean, Null, Undefined, Symbol.
- **Complex Types**: Objects, Arrays, Functions.

### Example:

```javascript
let age = 25; // Number
let name = "Alice"; // String
let isStudent = true; // Boolean
let something = null; // Null
let notDefined; // Undefined
```

### Resources

- [MDN Data Types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [JavaScript.info - Data Types](https://javascript.info/types)
- [Exercism - JavaScript Data Types](https://exercism.org/tracks/javascript/exercises)

---

## 3. Variables

### Tutorial

- **Declaration**: Use `var`, `let`, or `const` to declare variables.
- `var` is function-scoped, while `let` and `const` are block-scoped.

### Example:

```javascript
let name = 'John'; // Block-scoped
const age = 30; // Block-scoped and cannot be reassigned
var isStudent = true; // Function-scoped
```

### Resources

- [MDN Variables](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables)
- [JavaScript.info - Variables](https://javascript.info/variables)
- [freeCodeCamp - JavaScript Variables](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-javascript-variables)

---

## 4. Operators

### Tutorial

- **Arithmetic Operators**: `+`, `-`, `*`, `/`, `%`
- **Comparison Operators**: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- **Logical Operators**: `&&`, `||`, `!`

### Example:

```javascript
let a = 10, b = 20;
console.log(a + b); // 30
console.log(a > b); // false
console.log(a < b && b > 15); // true
```

### Resources

- [MDN Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
- [JavaScript.info - Operators](https://javascript.info/operators)
- [HackerRank - JavaScript Operators Challenges](https://www.hackerrank.com/domains/tutorials/10-days-of-javascript)

---

## 5. Control Structures

### Tutorial

- **Conditional Statements**: `if`, `else if`, `else`, `switch`.
- **Loops**: `for`, `while`, `do...while`.

### Example:

```javascript
let age = 18;
if (age >= 18) {
  console.log('You are an adult');
} else {
  console.log('You are a minor');
}

for (let i = 0; i < 5; i++) {
  console.log(i); // Prints 0 to 4
}
```

### Resources

- [MDN Control Flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [JavaScript.info - Control Flow](https://javascript.info/ifelse)
- [freeCodeCamp - JavaScript Loops](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/iterate-with-javascript-for-loops)

---

## 6. Functions

### Tutorial

- **Function Declaration**:
  ```javascript
  function greet(name) {
    return `Hello, ${name}`;
  }
  ```
- **Arrow Functions**:
  ```javascript
  const greet = (name) => `Hello, ${name}`;
  ```

### Resources

- [MDN Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info - Functions](https://javascript.info/function-basics)
- [freeCodeCamp - Write JavaScript Functions](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/write-reusable-javascript-with-functions)

---

## 7. Objects

### Tutorial

- **Creating Objects**:
  ```javascript
  const person = {
    name: 'John',
    age: 30
  };
  ```
- **Accessing Properties**:
  ```javascript
  console.log(person.name); // Output: John
  ```

### Resources

- [MDN Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- [JavaScript.info - Objects](https://javascript.info/object)
- [Exercism - Objects](https://exercism.org/tracks/javascript/exercises)

---

## 8. Arrays

### Tutorial

- **Creating Arrays**:
  ```javascript
  const numbers = [1, 2, 3, 4, 5];
  ```
- **Array Methods**: `push()`, `pop()`, `shift()`, `unshift()`, `map()`, `filter()`, `reduce()`.

### Resources

- [MDN Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript.info - Arrays](https://javascript.info/array)
- [freeCodeCamp - Manipulate Arrays](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/manipulate-arrays-with-push)

---

## 9. ES6 Features

### Tutorial

- **Template Literals**:
  ```javascript
  const greeting = `Hello, ${name}`;
  ```
- **Destructuring**:
  ```javascript
  const { name, age } = person;
  ```
- **Spread Operator**:
  ```javascript
  const newArray = [...oldArray, 6, 7];
  ```

### Resources

- [MDN ES6 Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [JavaScript.info - ES6 Features](https://javascript.info/destructuring-assignment)
- [Codewars - ES6 Practice](https://www.codewars.com/)

---

## 10. Asynchronous JavaScript

### zTutorial

- **Callbacks**:
  ```javascript
  function fetchData(callback) {
    // code to fetch data
    callback(data);
  }
  ```
- **Promises**:
  ```javascript
  fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));
  ```
- **Async/Await**:
  ```javascript
  async function fetchData() {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  }
  ```

### Resources

- [MDN Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [JavaScript.info - Async](https://javascript.info/async)
- [freeCodeCamp - Promises](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/es6/create-a-promise)
