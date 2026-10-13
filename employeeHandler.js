const fs = require("fs");
const FILE_NAME = "employees.json";

const fileData = fs.readFileSync(FILE_NAME, "utf8");
const employees = JSON.parse(fileData);

console.log("Current Employees List:");
console.log(employees);

const newEmployee = {
  id: employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1,
  name: "Hassan",
  department: "Cybersecurity",
  salary: 60000
};

employees.push(newEmployee);
fs.writeFileSync(FILE_NAME, JSON.stringify(employees, null, 2), "utf8");

console.log("\nUpdated Employees List:");
console.log(employees);