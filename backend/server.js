const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

/**
 * ✅ Proper CORS for browser + NodePort
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Handle preflight
app.options('*', cors());

app.use(express.json());

/**
 * ✅ PostgreSQL connection (Kubernetes service name)
 */
const pool = new Pool({
  host: 'postgres',
  user: 'admin',
  password: 'admin123',
  database: 'employees',
  port: 5432
});

/**
 * ✅ Health check (K8s readiness/liveness)
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * ✅ Get all employees
 */
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employee ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ Add new employee
 */
app.post('/employees', async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    await pool.query(
      'INSERT INTO employee(name, department) VALUES($1, $2)',
      [name, department]
    );

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ Delete employee (NEW – for advanced UI)
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
 * ✅ Start server
 */
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

