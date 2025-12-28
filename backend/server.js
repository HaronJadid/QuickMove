// server.js (Version adaptée à Sequelize et Neon)

require('dotenv').config({ path: './.env', silent: true });
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

const evaluationRoutes = require('./routes/evaluationRoutes');
app.use('/api/evaluations', evaluationRoutes);

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


// 2. Route de Test (Utilisation de Sequelize au lieu du Pool `pg`)
app.get('/db-test', async (req, res) => {
    try {
        // Exécuter une requête simple via Sequelize
        const [results, metadata] = await db.sequelize.query('SELECT NOW() AS currentTime');

        res.json({
            message: "Database Connected Successfully via Sequelize!",
            time: results[0].currentTime
        });
    } catch (err) {
        // Normalement, cette erreur ne devrait pas arriver si authenticate() a réussi.
        res.status(500).json({ error: "Database Query Failed" });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});


// Démarrer l'application en initialisant la base de données
initializeApp();

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