// server.js (Version adaptée à Sequelize et Neon)

require('dotenv').config({ path: './database/.env', silent: true });
const express = require('express');
const cors = require('cors');

// Importation de l'objet de base de données Sequelize (qui inclut la connexion et les modèles)
// Assurez-vous que le chemin est correct (ex: './database/models' si vous êtes dans le dossier 'backend')
const db = require('./database/models'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
        // Vérifier que toutes les tables (créées par nos migrations) sont présentes.
        // Si vous avez déjà fait 'npx sequelize-cli db:migrate', cette étape est moins critique.
        // await db.sequelize.sync({ alter: true }); // A utiliser AVANT de migrer si vous n'avez pas encore migré
        
        // 3. Lancer le serveur
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Échec critique de la connexion ou du démarrage:', error.message);
        console.error('Veuillez vérifier votre DATABASE_URL et la configuration Sequelize.');
        process.exit(1);
    }
}


// server.js (Ajoutez cette route après vos middlewares)
// Assurez-vous d'importer l'objet db: const db = require('./database/models');

app.get('/api/users', async (req, res) => {
    try {
        // La méthode Sequelize 'findAll()' équivaut à 'SELECT * FROM users'
        const users = await db.User.findAll({
            // CORRECTION: Utilisez des colonnes valides
            attributes: ['id', 'nom', 'prenom', 'email', 'imgUrl', 'numero'], 
        });

        if (users.length === 0) {
             return res.status(200).json({ message: "La table 'users' est vide.", users: [] });
        }
        
        res.json({
            message: "Utilisateurs récupérés avec succès.",
            count: users.length,
            users: users
        });
    } catch (err) {
        // ... (gestion des erreurs)
    }
});
// server.js (Ajoutez cet endpoint temporaire)

app.post('/api/users/seed-test', async (req, res) => {
    try {
        const [result, metadata] = await db.sequelize.query(
            // Requête SQL brute pour insérer une ligne (sans utiliser le modèle)
            `INSERT INTO users (nom, prenom, email, password, "createdAt", "updatedAt") 
             VALUES ('Test', 'User', 'test@example.com', 'hashed_pass', NOW(), NOW())
             ON CONFLICT (email) DO NOTHING;` 
        );
        res.json({ message: "Utilisateur de test inséré (s'il n'existait pas déjà)." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'insertion de test." });
    }
});


// Démarrer l'application en initialisant la base de données
initializeApp()
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);


// --- NOTE IMPORTANTE SUR LA CONFIGURATION DE NEON ---
// Étant donné que Neon est utilisé, assurez-vous que votre fichier de configuration 
// (config/config.js) est bien configuré pour utiliser l'URL complète de la base de données.
// Par exemple:
/*
// config/config.js
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL', // Indique à Sequelize d'utiliser la variable d'environnement pour la connexion
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false // Peut être nécessaire selon votre env Node
        }
    }
  },
  // ...
};
*/