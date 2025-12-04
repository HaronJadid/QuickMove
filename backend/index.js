require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Render sets this automatically

// Middleware
app.use(cors()); // Allow all origins (Configure this specifically for production later)
app.use(express.json()); // Allow parsing JSON bodies

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});