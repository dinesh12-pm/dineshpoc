const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

/* CORS */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

/* PostgreSQL connection */
const pool = new Pool({
  host: 'postgres',
  user: 'admin',
  password: 'admin123',
  database: 'employees',
  port: 5432
});

/* Health check */
app.get('/health', (req, res) => res.send('OK'));

/* Get employees */
app.get('/employees', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM employee ORDER BY id'
  );
  res.json(rows);
});

/* Add employee */
app.post('/employees', async (req, res) => {
  const { name, department, role, photo_url } = req.body;

  await pool.query(
    `INSERT INTO employee(name, department, role, photo_url)
     VALUES ($1,$2,$3,$4)`,
    [name, department, role, photo_url]
  );

  res.status(201).json({ message: 'Employee added' });
});

/* Update employee */
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, department, role, status } = req.body;

  await pool.query(
    `UPDATE employee
     SET name=$1, department=$2, role=$3, status=$4
     WHERE id=$5`,
    [name, department, role, status, id]
  );

  res.json({ message: 'Employee updated' });
});

/* Delete employee */
app.delete('/employees/:id', async (req, res) => {
  await pool.query('DELETE FROM employee WHERE id=$1', [req.params.id]);
  res.json({ message: 'Employee deleted' });
});

/* Start */
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

