import { useEffect, useState } from "react";
body: JSON.stringify({ name, department })
});


setName("");
setDepartment("");
loadEmployees();
};


const deleteEmployee = async (id) => {
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


return (
<div className="app">
<h1>Employee Management Dashboard</h1>


<div className="stats">
<div className="card blue">Total Employees <span>{employees.length}</span></div>
<div className="card green">Departments <span>{new Set(employees.map(e => e.department)).size}</span></div>
</div>


<div className="form">
<input placeholder="Employee Name" value={name} onChange={e => setName(e.target.value)} />
<input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
<button onClick={addEmployee}>Add Employee</button>
</div>


<input className="search" placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} />


<table>
<thead>
<tr><th>ID</th><th>Name</th><th>Department</th><th>Action</th></tr>
</thead>
<tbody>
{filtered.map(e => (
<tr key={e.id}>
<td>{e.id}</td>
<td>{e.name}</td>
<td>{e.department}</td>
<td><button className="delete" onClick={() => deleteEmployee(e.id)}>Delete</button></td>
</tr>
))}
</tbody>
</table>
</div>
);
}
