const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = "students.json";

function getStudents() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = [
        { id: 1, name: "Ali", department: "BSCS" },
        { id: 2, name: "Ahmed", department: "BSIT" },
        { id: 3, name: "Sara", department: "BSCS" }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveStudents(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// GET: All students
app.get("/students", (req, res) => {
  const students = getStudents();
  res.status(200).json(students);
});

// GET: Filter by Department (Task 3)
app.get("/students/department/:department", (req, res) => {
  const students = getStudents();
  const deptParam = req.params.department.toLowerCase();
  const filtered = students.filter(
    item => item.department && item.department.toLowerCase() === deptParam
  );
  return res.status(200).json(filtered);
});

// GET: Student by ID
app.get("/students/:id", (req, res) => {
  const students = getStudents();
  const id = Number(req.params.id);
  const student = students.find(item => item.id === id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  return res.status(200).json(student);
});

// POST: Add new student (Task 4 Validation)
app.post("/students", (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid or missing JSON body" });
  }

  const { name, department } = req.body;

  // Validation: Check missing, non-string, or empty trimmed strings
  if (
    !name || 
    !department || 
    typeof name !== "string" || 
    typeof department !== "string" || 
    !name.trim() || 
    !department.trim()
  ) {
    return res.status(400).json({ message: "name and department are required non-empty strings" });
  }

  const students = getStudents();
  const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = { id: newId, name: name.trim(), department: department.trim() };

  students.push(newStudent);
  saveStudents(students);
  return res.status(201).json(newStudent);
});

// PUT: Update student (Task 4 Validation)
app.put("/students/:id", (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid or missing JSON body" });
  }

  const students = getStudents();
  const id = Number(req.params.id);
  const student = students.find(item => item.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, department } = req.body;

  // Validation: Check missing, non-string, or empty trimmed strings
  if (
    !name || 
    !department || 
    typeof name !== "string" || 
    typeof department !== "string" || 
    !name.trim() || 
    !department.trim()
  ) {
    return res.status(400).json({ message: "name and department are required non-empty strings" });
  }

  student.name = name.trim();
  student.department = department.trim();
  saveStudents(students);
  return res.status(200).json(student);
});

// DELETE: Delete student
app.delete("/students/:id", (req, res) => {
  const students = getStudents();
  const id = Number(req.params.id);
  const index = students.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const [deletedStudent] = students.splice(index, 1);
  saveStudents(students);
  return res.status(200).json({
    message: "Student deleted successfully",
    student: deletedStudent
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});