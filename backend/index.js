require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // Import the driver
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Create the Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // It reads this from .env
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

app.use(cors());
app.use(express.json());

// 2. Example Route: Get Data from Neon
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users'); // SQL Query
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});