const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

/**
 * ✅ FIXED CORS (THIS IS THE ROOT FIX)
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Handle browser preflight
app.options('*', cors());

app.use(express.json());

/**
 * PostgreSQL connection
 */
const pool = new Pool({
  host: 'postgres',
  user: 'admin',
  password: 'admin123',
  database: 'employees',
  port: 5432
});

/**
 * Health endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Get employees
 */
app.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employee ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * Add employee
 */
app.post('/employees', async (req, res) => {
  try {
    const { name, department } = req.body;

    await pool.query(
      'INSERT INTO employee(name, department) VALUES($1, $2)',
      [name, department]
    );

    res.status(201).json({ message: 'Employee added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * IMPORTANT: listen on all interfaces
 */
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

