require('dotenv').config({ path: './database/.env' }); // Retire 'silent: true' pour voir les erreurs .env
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/models'); // Import de l'instance sequelize depuis models/index.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (all mounted under /api)
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
