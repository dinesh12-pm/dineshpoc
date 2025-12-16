const express = require('express');
const { Pool } = require('pg');


const app = express();
const JWT_SECRET = 'ems_secret_key';


app.use(cors({ origin: '*', methods: ['GET','POST','DELETE'] }));
app.use(express.json());


const pool = new Pool({
host: 'postgres',
user: 'admin',
password: 'admin123',
database: 'employees',
port: 5432
});


// ---------------- AUTH ----------------
app.post('/login', async (req, res) => {
const { username, password } = req.body;
const result = await pool.query('SELECT * FROM users WHERE username=$1',[username]);
if (!result.rows.length) return res.status(401).json({error:'Invalid user'});


const user = result.rows[0];
const valid = await bcrypt.compare(password, user.password);
if (!valid) return res.status(401).json({error:'Invalid password'});


const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn:'1h' });
res.json({ token, role: user.role });
});


const auth = (roles=[]) => (req,res,next)=>{
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.sendStatus(401);
try {
const decoded = jwt.verify(token, JWT_SECRET);
if (roles.length && !roles.includes(decoded.role)) return res.sendStatus(403);
req.user = decoded;
next();
} catch { return res.sendStatus(401); }
};


// ---------------- EMPLOYEES ----------------
app.get('/employees', auth(['ADMIN','USER']), async (req,res)=>{
const r = await pool.query('SELECT * FROM employee ORDER BY id');
res.json(r.rows);
});


app.post('/employees', auth(['ADMIN']), async (req,res)=>{
const { name, department, role, photo } = req.body;
await pool.query(
'INSERT INTO employee(name,department,role,photo) VALUES($1,$2,$3,$4)',
[name,department,role,photo]
);
await pool.query('INSERT INTO audit_logs(action) VALUES($1)',[`Added ${name}`]);
res.sendStatus(201);
});


app.delete('/employees/:id', auth(['ADMIN']), async (req,res)=>{
await pool.query('DELETE FROM employee WHERE id=$1',[req.params.id]);
await pool.query('INSERT INTO audit_logs(action) VALUES($1)',[`Deleted employee ${req.params.id}`]);
res.sendStatus(200);
});


// ---------------- ANALYTICS ----------------
app.get('/analytics', auth(['ADMIN']), async (req,res)=>{
const emp = await pool.query('SELECT COUNT(*) FROM employee');
const dept = await pool.query('SELECT COUNT(DISTINCT department) FROM employee');
res.json({ totalEmployees: emp.rows[0].count, departments: dept.rows[0].count });
});


app.listen(3000,'0.0.0.0',()=>console.log('Backend running on 3000'));
