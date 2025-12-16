const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');   // ✅ THIS WAS MISSING

const app = express();

/**
 * ✅ Proper CORS configuration
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

/**
 * ✅ PostgreSQL connection (K8s service name)
 */
const pool = new Pool({
  host: 'postgres',
  user: 'admin',
  password: 'admin123',
  database: 'employees',
  port: 5432
});

/**
 * ✅ Health check
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * ✅ Get employees
 */
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employee ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * ✅ Add employee
 */
app.post('/employees', async (req, res) => {
  try {
    const { name, department } = req.body;
    await pool.query(
      'INSERT INTO employee(name, department) VALUES($1,$2)',
      [name, department]
    );
    res.status(201).json({ message: 'Employee added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * ✅ Delete employee
 */
app.delete('/employees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employee WHERE id=$1', [req.params.id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * ✅ Start server
 */
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

