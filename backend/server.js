// server.js (Version adaptée à Sequelize et Neon)

// Use the dotenv path from origin/main as it seems more specific, or fallback to root
require('dotenv').config({ path: './database/.env' });
// If that file doesn't exist, it might fall back to standard .env or process env. 
// Given the previous setup, let's keep it simple.

const express = require('express');
const cors = require('cors');

// Import db object which contains sequelize instance
const db = require('./database/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Evaluation Routes (from HEAD)
const evaluationRoutes = require('./routes/evaluationRoutes');
app.use('/api/evaluations', evaluationRoutes);

// Existing Routes (from origin/main)
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const clientRoutes = require('./src/routes/clientRoutes');
app.use('/api/client', clientRoutes);

const livreurRoutes = require('./src/routes/livreurRoutes');
app.use("/api/livreur", livreurRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/user', userRoutes);

const villeRoutes = require('./src/routes/villeRoutes');
app.use('/api/ville', villeRoutes);

const vehiculeRoutes = require('./src/routes/vehiculeRoutes');
app.use('/api/vehicule', vehiculeRoutes);

const profileRoutes = require('./src/routes/profileRoutes');
app.use('/api/profile', profileRoutes);


// --- Initialisation et Démarrage ---

/**
 * Fonction pour tester la connexion DB et démarrer le serveur
 */
async function initializeApp() {
    try {
        // 1. Tester la connexion via Sequelize
        await db.sequelize.authenticate();
        console.log('✅ Connexion à la base de données (Sequelize) établie avec succès.');

        // 2. (Optionnel en Production, mais important pour les migrations)
        // await db.sequelize.sync({ alter: true }); 

        // 3. Lancer le serveur
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Unable to connect to the database:', err);
    }
}

// Route de Test
app.get('/db-test', async (req, res) => {
    try {
        const [results, metadata] = await db.sequelize.query('SELECT NOW() AS currentTime');
        res.json({
            message: "Database Connected Successfully via Sequelize!",
            time: results[0].currentTime
        });
    } catch (err) {
        res.status(500).json({ error: "Database Query Failed" });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});


// Démarrer l'application
initializeApp();
