import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://51.20.141.140:30001";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/employees`);
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
  };

  const addEmployee = async () => {
    if (!name || !department) {
      alert("Please fill all fields");
      return;
    }

    await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, department })
    });

    setName("");
    setDepartment("");
    loadEmployees();
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const departmentsCount = new Set(
    employees.map(e => e.department)
  ).size;

  return (
    <div className="app">
      <header className="topbar">
        <h1>Employee Management Dashboard</h1>
        <span className="env">PROD</span>
      </header>

      <div className="stats">
        <div className="card blue">
          Total Employees <span>{employees.length}</span>
        </div>
        <div className="card green">
          Departments <span>{departmentsCount}</span>
        </div>
      </div>

      <div className="form">
        <input
          placeholder="Employee Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Department"
          value={department}
          onChange={e => setDepartment(e.target.value)}
        />
        <button onClick={addEmployee}>➕ Add Employee</button>
      </div>

      <input
        className="search"
        placeholder="Search employee..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading">Loading employees...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name}</td>
                <td>{e.department}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => deleteEmployee(e.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && employees.length === 0 && (
        <p className="empty">No employees found</p>
      )}
    </div>
  );
}

export default App;

