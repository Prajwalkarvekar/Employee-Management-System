import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import EmployeeCard from "./components/EmployeeCard";

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

const STORAGE_KEY = "employee-management-system:employees";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "salary" | "name">("latest");
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null,
  );
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const storedEmployees = window.localStorage.getItem(STORAGE_KEY);

    if (!storedEmployees) {
      return;
    }

    try {
      setEmployees(JSON.parse(storedEmployees) as Employee[]);
    } catch (error) {
      console.error("Failed to parse employee records", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const totalPayroll = employees.reduce(
    (sum, employee) => sum + employee.salary,
    0,
  );
  const averageSalary = employees.length
    ? Math.round(totalPayroll / employees.length)
    : 0;
  const highestPaidEmployee = employees.reduce<Employee | null>(
    (highest, employee) => {
      if (!highest || employee.salary > highest.salary) {
        return employee;
      }

      return highest;
    },
    null,
  );
  const uniqueRoles = new Set(
    employees.map((employee) => employee.role.toLowerCase()),
  ).size;
  const salaryBandCount = new Set(
    employees.map((employee) => Math.floor(employee.salary / 25000)),
  ).size;
  const filteredEmployees = employees
    .filter((employee) => {
      const searchableText = `${employee.name} ${employee.role}`.toLowerCase();
      return searchableText.includes(searchTerm.trim().toLowerCase());
    })
    .sort((left, right) => {
      if (sortBy === "salary") {
        return right.salary - left.salary;
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name);
      }

      return right.id - left.id;
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const resetForm = () => {
    setName("");
    setRole("");
    setSalary("");
    setEditingEmployeeId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim() === "" || role.trim() === "" || salary.trim() === "") {
      alert("Please fill all fields");
      return;
    }

    const numericSalary = Number(salary);

    if (Number.isNaN(numericSalary) || numericSalary <= 0) {
      alert("Please enter a valid salary");
      return;
    }

    if (editingEmployeeId !== null) {
      setEmployees((currentEmployees) =>
        currentEmployees.map((employee) =>
          employee.id === editingEmployeeId
            ? {
                ...employee,
                name: name.trim(),
                role: role.trim(),
                salary: numericSalary,
              }
            : employee,
        ),
      );
      resetForm();
      return;
    }

    setEmployees((currentEmployees) => [
      {
        id: Date.now(),
        name: name.trim(),
        role: role.trim(),
        salary: numericSalary,
      },
      ...currentEmployees,
    ]);
    resetForm();
  };

  const deleteEmployee = (id: number) => {
    setEmployees((currentEmployees) =>
      currentEmployees.filter((employee) => employee.id !== id),
    );

    if (editingEmployeeId === id) {
      resetForm();
    }
  };

  const startEditingEmployee = (employee: Employee) => {
    setName(employee.name);
    setRole(employee.role);
    setSalary(String(employee.salary));
    setEditingEmployeeId(employee.id);
  };

  const maxSalary = highestPaidEmployee?.salary ?? 1;

  return (
    <main className="dashboard-shell">
      <aside className="control-rail">
        <div className="brand-block">
          <span className="brand-chip">EMS / Studio</span>
          <h1>Team Operations Board</h1>
          <p>
            A sharper way to manage headcount, payroll, and employee records in
            one premium workspace.
          </p>
        </div>

        <div className="rail-stat rail-stat--accent">
          <span>Live Team Count</span>
          <strong>{employees.length.toString().padStart(2, "0")}</strong>
          <small>{employees.length ? "Records synced locally" : "No records yet"}</small>
        </div>

        <div className="rail-grid">
          <div className="rail-stat">
            <span>Payroll</span>
            <strong>{formatCurrency(totalPayroll)}</strong>
          </div>
          <div className="rail-stat">
            <span>Avg Salary</span>
            <strong>{formatCurrency(averageSalary)}</strong>
          </div>
          <div className="rail-stat">
            <span>Roles</span>
            <strong>{uniqueRoles}</strong>
          </div>
          <div className="rail-stat">
            <span>Bands</span>
            <strong>{salaryBandCount}</strong>
          </div>
        </div>

        <section className="entry-panel">
          <div className="panel-copy">
            <span className="micro-label">
              {editingEmployeeId !== null ? "Edit Mode" : "Quick Entry"}
            </span>
            <h2>
              {editingEmployeeId !== null ? "Update Employee" : "Add Employee"}
            </h2>
          </div>

          <form className="employee-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Role</span>
              <input
                type="text"
                placeholder="Frontend Engineer"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Salary</span>
              <input
                type="number"
                placeholder="85000"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingEmployeeId !== null ? "Save Changes" : "Create Record"}
              </button>

              {editingEmployeeId !== null ? (
                <button
                  className="secondary-button"
                  onClick={resetForm}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </aside>

      <section className="board-area">
        <section className="spotlight-panel">
          <div className="spotlight-copy">
            <span className="micro-label">Payroll Spotlight</span>
            <h2>Operational view of your workforce</h2>
            <p>
              Search, sort, and monitor the team with a more editorial,
              dashboard-style interface.
            </p>
          </div>

          <div className="spotlight-metrics">
            <div className="metric-card">
              <span>Top Earner</span>
              <strong>
                {highestPaidEmployee ? highestPaidEmployee.name : "No data yet"}
              </strong>
              <small>
                {highestPaidEmployee
                  ? formatCurrency(highestPaidEmployee.salary)
                  : "Add employees to unlock"}
              </small>
            </div>

            <div className="metric-card metric-card--dark">
              <span>Directory Mode</span>
              <strong>{employees.length ? "Active" : "Waiting"}</strong>
              <small>
                {editingEmployeeId !== null ? "Editing enabled" : "Viewing records"}
              </small>
            </div>
          </div>
        </section>

        <section className="analytics-strip">
          {employees.slice(0, 4).map((employee) => (
            <div className="salary-bar-card" key={employee.id}>
              <div className="salary-bar-card__head">
                <strong>{employee.name}</strong>
                <span>{employee.role}</span>
              </div>
              <div className="salary-track">
                <div
                  className="salary-fill"
                  style={{
                    width: `${Math.max((employee.salary / maxSalary) * 100, 18)}%`,
                  }}
                />
              </div>
              <small>{formatCurrency(employee.salary)}</small>
            </div>
          ))}

          {!employees.length ? (
            <div className="salary-bar-card salary-bar-card--empty">
              <strong>Live salary bars will appear here</strong>
              <span>Add a few employees to make the board feel alive.</span>
            </div>
          ) : null}
        </section>

        <section className="directory-panel">
          <div className="directory-header">
            <div>
              <span className="micro-label">Directory</span>
              <h2>Employee Deck</h2>
            </div>

            <p>
              {employees.length
                ? `${filteredEmployees.length} of ${employees.length} records visible`
                : "No employee records available yet"}
            </p>
          </div>

          <div className="toolbar">
            <label className="toolbar-search">
              <span>Search</span>
              <input
                type="text"
                placeholder="Search by name or role"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="toolbar-sort">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "latest" | "salary" | "name")
                }
              >
                <option value="latest">Latest</option>
                <option value="salary">Highest Salary</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">+</div>
              <h3>No employees added yet</h3>
              <p>
                Create the first record from the left panel and this board will
                transform into a visual employee deck.
              </p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state compact">
              <div className="empty-icon">?</div>
              <h3>No matching employees</h3>
              <p>Try another name or role term to filter the directory.</p>
            </div>
          ) : (
            <div className="employee-grid">
              {filteredEmployees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  index={index}
                  name={employee.name}
                  role={employee.role}
                  salary={employee.salary}
                  onDelete={() => deleteEmployee(employee.id)}
                  onEdit={() => startEditingEmployee(employee)}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
