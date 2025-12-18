const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

/**
 * ✅ CORS (Browser + NodePort safe)
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
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
 * ✅ Health check (K8s)
 */
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

/**
 * ✅ Get all employees
 */
app.get('/employees', async (_, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM employee ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ Add employee
 */
app.post('/employees', async (req, res) => {
  try {
    const { name, department, role, photo } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        error: 'Name and department are required'
      });
    }

    await pool.query(
      `INSERT INTO employee(name, department, role, photo)
       VALUES ($1, $2, $3, $4)`,
      [name, department, role || 'Employee', photo || null]
    );

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ Delete employee
 */
app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM employee WHERE id = $1',
      [id]
    );

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('DELETE /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ Start server (important for Docker/K8s)
 */
app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Backend running on port 3000');
});

