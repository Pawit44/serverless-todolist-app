require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE,
        prio VARCHAR(10) DEFAULT 'low',
        time VARCHAR(10)
      );
    `;
    await pool.query(createTableQuery);
    console.log('[ SYS ] Database table "todos" is ready.');
  } catch (err) {
    console.error('[ ERR ] Failed to initialize database:', err.stack);
  }
};

// Connect to PostgreSQL and initialize the database

pool.connect()
  .then(() => {
    console.log(`[ SYS ] PostgreSQL connected to "${process.env.DB_NAME}" on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    initDB();
  })
  .catch(err => console.error('[ ERR ] PostgreSQL connection error:', err.stack));

// --- API Routes ---

app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  const { task, prio, time } = req.query;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  try {
    const query = `INSERT INTO todos (task, prio, time) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await pool.query(query, [task, prio || 'low', time]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/todos/:id/toggle', async (req, res) => {
  try {
    const query = `UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [parseInt(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *;', [parseInt(req.params.id)]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
app.listen(PORT, () => {
  console.log(`[ SYS ] Server is running on: http://${process.env.HOST}:${PORT}`);
});