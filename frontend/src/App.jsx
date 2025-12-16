import { useEffect, useState } from 'react';
import './App.css';


const API = 'http://51.20.141.140:30001';


export default function App() {
const [employees,setEmployees]=useState([]);
const [name,setName]=useState('');
const [department,setDepartment]=useState('');
const [role,setRole]=useState('Employee');
const [photo,setPhoto]=useState('');


const token = localStorage.getItem('token');


const load = async()=>{
const r = await fetch(`${API}/employees`,{ headers:{Authorization:`Bearer ${token}`}});
setEmployees(await r.json());
};


const add = async()=>{
await fetch(`${API}/employees`,{
method:'POST',
headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
body:JSON.stringify({name,department,role,photo})
});
load();
};


const del = async(id)=>{
await fetch(`${API}/employees/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
load();
};


useEffect(()=>{load();},[]);


return (
<div className="app">
<h1>Employee Management System</h1>
<div className="form">
<input placeholder="Name" onChange={e=>setName(e.target.value)} />
<input placeholder="Department" onChange={e=>setDepartment(e.target.value)} />
<input placeholder="Role" onChange={e=>setRole(e.target.value)} />
<input placeholder="Photo URL" onChange={e=>setPhoto(e.target.value)} />
<button onClick={add}>Add Employee</button>
</div>


<div className="grid">
{employees.map(e=> (
<div className="card" key={e.id}>
<img src={e.photo || 'https://i.pravatar.cc/150'} />
<h3>{e.name}</h3>
<p>{e.role}</p>
<p>{e.department}</p>
<button onClick={()=>del(e.id)}>Delete</button>
</div>
))}
</div>
</div>
);
}
