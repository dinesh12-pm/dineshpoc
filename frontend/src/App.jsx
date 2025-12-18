import { useEffect, useState } from "react";
const [department, setDepartment] = useState("");
const [role, setRole] = useState("");
const [photo, setPhoto] = useState("");
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);


const loadEmployees = async () => {
setLoading(true);
const res = await fetch(`${API_URL}/employees`);
const data = await res.json();
setEmployees(data);
setLoading(false);
};


const addEmployee = async () => {
await fetch(`${API_URL}/employees`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, department, role, photo })
});
setName(""); setDepartment(""); setRole(""); setPhoto("");
loadEmployees();
};


const deleteEmployee = async (id) => {
await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
loadEmployees();
};


useEffect(() => { loadEmployees(); }, []);


const filtered = employees.filter(e =>
e.name.toLowerCase().includes(search.toLowerCase()) ||
e.department.toLowerCase().includes(search.toLowerCase())
);


const departmentsCount = new Set(employees.map(e => e.department)).size;


return (
<div className="app">
<header className="topbar">
<h1>Employee Management Dashboard</h1>
<span className="env">PROD</span>
</header>


<div className="stats">
<div className="card blue">Total Employees <span>{employees.length}</span></div>
<div className="card green">Departments <span>{departmentsCount}</span></div>
<div className="card purple">Active Status <span>100%</span></div>
</div>


<div className="form">
<input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
<input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
<input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
<input placeholder="Photo URL" value={photo} onChange={e => setPhoto(e.target.value)} />
<button onClick={addEmployee}>➕ Add Employee</button>
</div>


<input className="search" placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} />


{loading ? <p className="loading">Loading...</p> : (
<div className="grid">
{filtered.map(e => (
<div className="emp-card" key={e.id}>
<img src={e.photo || "https://i.pravatar.cc/150"} alt="emp" />
<h3>{e.name}</h3>
<span className="badge">{e.role}</span>
<p>{e.department}</p>
<button className="delete" onClick={() => deleteEmployee(e.id)}>Delete</button>
</div>
))}
</div>
)}
</div>
);
}
