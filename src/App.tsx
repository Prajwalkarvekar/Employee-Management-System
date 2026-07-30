import { useState, useEffect } from "react";
import EmployeeCard from "./components/EmployeeCard";

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);

  // Runs only once when page loads
  useEffect(() => {
    console.log("Employee Management System Loaded ");
  }, []);

  // Runs whenever employees change
  useEffect(() => {
    console.log("Employee List Updated ✅");
    console.log(employees);
  }, [employees]);

  const addEmployee = () => {
    if (
      name.trim() === "" ||
      role.trim() === "" ||
      salary.trim() === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const newEmployee: Employee = {
      id: Date.now(),
      name,
      role,
      salary: Number(salary),
    };

    setEmployees([...employees, newEmployee]);

    setName("");
    setRole("");
    setSalary("");
  };

  const deleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter(
      (employee) => employee.id !== id
    );

    setEmployees(updatedEmployees);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Employee Management System</h1>

      <input
        type="text"
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addEmployee}>Add Employee</button>

      <hr />

   <h1>Employee Management System - Main Branch</h1>

      {employees.length === 0 ? (
        <p>No Employees Found</p>
      ) : (
        employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            name={employee.name}
            role={employee.role}
            salary={employee.salary}
            onDelete={() => deleteEmployee(employee.id)}
          />
        ))
      )}
    </div>
  );
}

export default App;