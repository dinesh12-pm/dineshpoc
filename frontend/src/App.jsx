import { useEffect, useState } from "react";
import "./App.css";

const API = "http://51.20.141.140:30001";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    department: "",
    role: "",
    photo_url: ""
  });

  const load = async () => {
    const r = await fetch(`${API}/employees`);
    setEmployees(await r.json());
  };

  const add = async () => {
    if (!form.name || !form.department) {
      alert("Name & Department required");
      return;
    }

    await fetch(`${API}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", department: "", role: "", photo_url: "" });
    load();
  };

  const del = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    await fetch(`${API}/employees/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="app">
      <h1>Employee Management System</h1>

      <div className="form">
        <input placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Department"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })} />

        <input placeholder="Role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })} />

        <input placeholder="Photo URL"
          value={form.photo_url}
          onChange={e => setForm({ ...form, photo_url: e.target.value })} />

        <button onClick={add}>Add Employee</button>
      </div>

      <div className="grid">
        {employees.map(e => (
          <div className="card" key={e.id}>
            <img src={e.photo_url || "https://i.pravatar.cc/150"} />
            <h3>{e.name}</h3>
            <p>{e.role || "Employee"}</p>
            <span className="dept">{e.department}</span>
            <span className={`status ${e.status?.toLowerCase()}`}>
              {e.status}
            </span>
            <button onClick={() => del(e.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

