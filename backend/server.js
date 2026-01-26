require('dotenv').config({ path: './database/.env' }); // Retire 'silent: true' pour voir les erreurs .env
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/models'); // Import de l'instance sequelize depuis models/index.js
const db = require("./database/models");
const { Groq } = require("groq-sdk");

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

const profileRoutes = require('./src/routes/profileRoutes');
app.use('/api/profile', profileRoutes);

//ia groq
// import { Groq } from "groq-sdk";



const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Estime le prix du déménagement via IA
 * POST /api/livreur/estimate-price
 * Body: { livreur_id, vehicule_id, distance_km }
 */
app.use("/api/ai", async (req, res) => {
    // 1. Récupération des paramètres

    // const { livreur_id, vehicule_id, distance_km } = req.body;
    const { livreur_id, distance_km,vehicule_id } = {
        livreur_id: 9,
        distance_km: 200,
        vehicule_id:3
    };

    const PRIX_GASOIL = 10.5; // Peut être mis dans une table 'Config' plus tard

    if (!livreur_id || !distance_km) {
        return res.status(400).json({ message: "Livreur ID et distance sont requis." });
    }

    try {
        // 2. Récupérer le véhicule spécifique (pour avoir le type/nom ex: 'Camion', 'Pick-up')
        // Si le user a choisi un véhicule précis, on le prend. Sinon on prend le premier du livreur.
        let vehicule = null;

        if (vehicule_id) {
            vehicule = await db.Vehicule.findByPk(vehicule_id);
        } else {
            // Fallback : On cherche le premier véhicule de ce livreur
            vehicule = await db.Vehicule.findOne({ where: { livreur_id } });
        }

        if (!vehicule) {
            return res.status(404).json({ message: "Ce livreur n'a pas de véhicule associé." });
        }

        // 3. Calculer le Rating Moyen (Exactement comme dans ta fonction getDriverStatistics)
        const evaluations = await db.Evaluation.findAll({
            where: { livreur_id: livreur_id },
            attributes: ['rate']
        });

        let averageRating = 5.0; // Valeur par défaut si nouveau chauffeur
        if (evaluations.length > 0) {
            const sumRatings = evaluations.reduce((sum, e) => sum + e.rate, 0);
            averageRating = parseFloat((sumRatings / evaluations.length).toFixed(1));
        }

        // 4. Préparer le Prompt pour l'IA
        const promptSysteme = `
            Tu es un algorithme expert en tarification de transport au Maroc.
            Règles :
            - Prix base : 150 DH.
            - Conso estimée : Pick-up/Partner (8L/100km), Fourgon (10L/100km), Camion/Hondai (18L/100km).
            - Coût carburant = (Distance / 100) * Conso * ${PRIX_GASOIL}.
            - Marge chauffeur : +40% sur le carburant.
            - Bonus Rating : Si note > 4.5, ajoute 10% au total.
            
            Instruction : Renvoie UNIQUEMENT le montant final (chiffre entier), sans texte.
        `;

        const promptUser = `
            Données :
            - Distance : ${distance_km} km
            - Véhicule : ${vehicule.nom} (Capacité: ${vehicule.capacite})
            - Rating : ${averageRating}/5
        `;

        // 5. Appel à l'IA (Groq)
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Modèle rapide et bon en logique
            temperature: 0,
            max_tokens: 10,
            messages: [
                { role: "system", content: promptSysteme },
                { role: "user", content: promptUser }
            ]
        });

        const prixEstime = completion.choices[0]?.message?.content?.trim();

        // 6. Réponse
        return res.status(200).json({
            success: true,
            estimation: prixEstime,
            details: {
                distance: distance_km,
                vehicule: vehicule.nom,
                rating: averageRating,
                gasoil: PRIX_GASOIL
            }
        });

    } catch (error) {
        console.error("Erreur estimation IA:", error);
        return res.status(500).json({
            message: "Erreur lors de l'estimation.",
            details: error.message
        });
    }
});


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
