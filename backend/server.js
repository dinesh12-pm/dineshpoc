const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
host: 'postgres',
user: 'admin',
password: 'admin123',
database: 'employees'
});


app.get('/employees', async (req, res) => {
const result = await pool.query('SELECT * FROM employee ORDER BY id');
res.json(result.rows);
});


app.post('/employees', async (req, res) => {
const { name, department } = req.body;
await pool.query('INSERT INTO employee(name, department) VALUES($1, $2)', [name, department]);
res.sendStatus(201);
});


app.listen(3000, () => console.log('Backend running on port 3000'));
