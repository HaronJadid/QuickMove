// server.js (Version adaptée à Sequelize et Neon)

// Load environment variables
require('dotenv').config({ path: './database/.env' });
require('dotenv').config(); // Load root .env


const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/models'); // Import de l'instance sequelize depuis models/index.js


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

// --- ROUTES ---

// Evaluation Routes (from HEAD)
const evaluationRoutes = require('./src/routes/evaluationRoutes');
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

//ia groq
// import { Groq } from "groq-sdk";





const prixestimeRoute =require("./src/routes/aiRoutes")
app.use("/api/ai", prixestimeRoute)


// Démarrage du serveur et Connexion DB
app.listen(PORT, async () => {
    console.log(`Le serveur tourne sur le port ${PORT}!`);

    // try {
    //     await sequelize.authenticate();
    //     console.log('Connecté à Neon via Sequelize !');
    // } catch (err) {
    //     console.error('Erreur de connexion à la DB :', err);
    // }
});
