const calculator = require("./calculator");

console.log("Addition (10 + 5):", calculator.add(10, 5));
console.log("Subtraction (10 - 5):", calculator.subtract(10, 5));
console.log("Multiplication (10 * 5):", calculator.multiply(10, 5));

try {
  console.log("Division (10 / 2):", calculator.divide(10, 2));
  console.log("Division by zero (10 / 0):", calculator.divide(10, 0));
} catch (error) {
  console.error("Error:", error.message);
}