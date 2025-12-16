const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

/**
 * ✅ Proper CORS configuration (VERY IMPORTANT)
 * Allows browser calls from frontend (NodePort / different port)
 */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Explicitly handle preflight requests
app.options("*", cors());

app.use(express.json());

/**
 * ✅ PostgreSQL connection
 */
const pool = new Pool({
  host: 'postgres',        // Kubernetes service name
  user: 'admin',
  password: 'admin123',
  database: 'employees',
  port: 5432
});

/**
 * ✅ Health check (for k8s readiness/liveness)
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * ✅ Get employees
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
 * ✅ Add employee
 */
app.post('/employees', async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department required' });
    }

    await pool.query(
      'INSERT INTO employee(name, department) VALUES($1, $2)',
      [name, department]
    );

    res.status(201).json({ message: 'Employee added' });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ✅ IMPORTANT: listen on 0.0.0.0 for Kubernetes
 */
app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});

