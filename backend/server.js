require('dotenv').config({ path: './database/.env' }); // Retire 'silent: true' pour voir les erreurs .env
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/models'); // Import de l'instance sequelize depuis models/index.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const clientRoutes = require("./routes/clientRoute.js");
app.use("/client", clientRoutes); // Les routes seront accessibles via /client/register

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