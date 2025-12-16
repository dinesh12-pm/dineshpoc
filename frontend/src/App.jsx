import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");

  const loadEmployees = async () => {
    const res = await fetch("http://backend-service:3000/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const addEmployee = async () => {
    await fetch("http://backend-service:3000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, department: dept })
    });
    setName("");
    setDept("");
    loadEmployees();
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="container">
      <h1>Employee Dashboard</h1>

      <div className="form">
        <input
          placeholder="Employee Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Department"
          value={dept}
          onChange={e => setDept(e.target.value)}
        />
        <button onClick={addEmployee}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

