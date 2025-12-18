const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
host: 'postgres',
user: 'admin',
password: 'admin123',
database: 'employees'
});


app.get('/health', (_, res) => res.send('OK'));


app.get('/employees', async (_, res) => {
const { rows } = await pool.query('SELECT * FROM employee ORDER BY id');
res.json(rows);
});


app.post('/employees', async (req, res) => {
const { name, department, role, photo } = req.body;
await pool.query(
'INSERT INTO employee(name, department, role, photo) VALUES($1,$2,$3,$4)',
[name, department, role, photo]
);
res.status(201).json({ message: 'Employee added' });
});


app.delete('/employees/:id', async (req, res) => {
await pool.query('DELETE FROM employee WHERE id=$1', [req.params.id]);
res.json({ message: 'Employee deleted' });
});


app.listen(3000, '0.0.0.0', () => console.log('Backend running'));
