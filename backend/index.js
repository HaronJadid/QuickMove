require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the Postgres driver

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Setup the Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true, // Neon requires SSL
    },
});

app.use(cors());
app.use(express.json());

// 2. Test Route: Check if DB is alive
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Ask DB for current time
        res.json({
            message: "Database Connected Successfully!",
            time: result.rows[0].now
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});