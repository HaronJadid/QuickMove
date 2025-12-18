// backend/src/controllers/livreurController.js

const db = require('../../database/models');
const { Op } = require('sequelize'); // Importe l'opérateur Sequelize pour les recherches

/**
 * Récupère les livreurs qui desservent une ville spécifique.
 * * NOTE : La ville est passée dans les paramètres de requête (ex: ?ville=Casablanca).
 */
exports.findLivreursByCity = async (req, res) => {
    // 1. Récupération du paramètre de la ville (ville de départ)
    const cityName = req.query.ville; // Récupère 'ville' depuis l'URL: /api/livreurs?ville=Casablanca

    if (!cityName) {
        return res.status(400).json({ 
            message: "Le paramètre 'ville' est obligatoire pour la recherche." 
        });
    }

    try {
        // 2. Recherche de l'ID de la Ville
        // Le modèle Ville définit le champ `nom`, pas `nom_ville`.
        const ville = await db.Ville.findOne({
            where: {
                nom: { [Op.iLike]: `%${cityName.trim()}%` }
            }
        });

        if (!ville) {
            return res.status(404).json({ 
                message: `Aucune ville trouvée correspondant à '${cityName}'.` 
            });
        }
        
        const villeId = ville.id_ville;

        // 3. Récupération des Livreurs liés à cet ID de Ville
        // Le modèle Livreur définit l'association Many-to-Many vers Ville sous l'alias `zonesService`.
        const livreurs = await db.Livreur.findAll({
            include: [
                {
                    model: db.Ville,
                    as: 'zonesService',
                    through: { attributes: [] },
                    where: { id_ville: villeId },
                    required: true
                },
                {
                    model: db.User,
                    // L'association Livreur -> User n'a pas d'alias explicitement défini,
                    // Sequelize devrait résoudre la relation automatiquement.
                    attributes: ['nom', 'prenom', 'email', 'numero', 'imgUrl']
                },
                {
                    model: db.Vehicule,
                    as: 'vehicules',
                    attributes: ['nom', 'imgUrl', 'capacite']
                }
            ],
            // Attributs exposés du Livreur
            attributes: ['id_livreur', 'cin', 'about']
        });
        
        if (livreurs.length === 0) {
            return res.status(200).json({ 
                message: `Aucun livreur disponible dans la ville de ${cityName}.`,
                livreurs: []
            });
        }

        // 4. Formatage pour une réponse plus claire
        const formatted = livreurs.map(l => {
            const user = l.User || l.utilisateur || null;
            const vehicules = (l.vehicules || []).map(v => ({
                id: v.id_vehicule || null,
                nom: v.nom || null,
                imgUrl: v.imgUrl || null,
                capacite: v.capacite || null
            }));
            const villes = (l.zonesService || l.villesDesservant || []).map(v => ({
                id: v.id_ville || null,
                nom: v.nom || null
            }));

            return {
                id: l.id_livreur,
                cin: l.cin,
                about: l.about,
                user: user ? {
                    nom: user.nom || null,
                    prenom: user.prenom || null,
                    email: user.email || null,
                    numero: user.numero || null,
                    imgUrl: user.imgUrl || null
                } : null,
                vehicules,
                villes
            };
        });

        return res.status(200).json({
            message: `Livreurs trouvés pour la ville de ${cityName}.`,
            count: formatted.length,
            livreurs: formatted
        });

    } catch (error) {
        console.error("Erreur de recherche des livreurs:", error);
        return res.status(500).json({ 
            message: "Erreur serveur lors de la recherche des livreurs.",
            details: error.message
        });
    }
};

/**
 * Récupère tous les livreurs (sans filtre)
 * GET /api/livreur/all
 */
exports.getAllLivreurs = async (req, res) => {
    try {
        const livreurs = await db.Livreur.findAll({
            include: [
                {
                    model: db.User,
                    attributes: ['nom', 'prenom', 'email', 'numero', 'imgUrl']
                },
                {
                    model: db.Vehicule,
                    as: 'vehicules',
                    attributes: ['id_vehicule', 'nom', 'imgUrl', 'capacite']
                },
                {
                    model: db.Ville,
                    as: 'zonesService',
                    through: { attributes: [] },
                    attributes: ['id_ville', 'nom']
                }
            ],
            attributes: ['id_livreur', 'cin', 'about']
        });

        // Format similar to findLivreursByCity
        const formatted = livreurs.map(l => {
            const user = l.User || l.utilisateur || null;
            const vehicules = (l.vehicules || []).map(v => ({
                id: v.id_vehicule || null,
                nom: v.nom || null,
                imgUrl: v.imgUrl || null,
                capacite: v.capacite || null
            }));
            const villes = (l.zonesService || l.villesDesservant || []).map(v => ({
                id: v.id_ville || null,
                nom: v.nom || null
            }));

            return {
                id: l.id_livreur,
                cin: l.cin,
                about: l.about,
                user: user ? {
                    nom: user.nom || null,
                    prenom: user.prenom || null,
                    email: user.email || null,
                    numero: user.numero || null,
                    imgUrl: user.imgUrl || null
                } : null,
                vehicules,
                villes
            };
        });

        return res.status(200).json({
            message: 'Liste des livreurs',
            count: formatted.length,
            livreurs: formatted
        });
    } catch (error) {
        console.error('Erreur récupération des livreurs:', error);
        return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
    }
};

/**
 * Récupère toutes les évaluations pour un livreur donné
 * GET /api/livreur/:id/evaluations
 */
exports.getEvaluationsByLivreur = async (req, res) => {
    const livreurId = req.params.id;
    if (!livreurId) return res.status(400).json({ message: 'ID du livreur requis.' });

    try {
        const livreur = await db.Livreur.findByPk(livreurId);
        if (!livreur) return res.status(404).json({ message: `Livreur id=${livreurId} introuvable.` });

        const evaluations = await db.Evaluation.findAll({
            where: { livreur_id: livreurId },
            include: [
                {
                    model: db.Client,
                    as: 'evaluateur',
                    include: [{ model: db.User, attributes: ['nom', 'prenom', 'email'] }]
                }
            ],
            order: [['date', 'DESC']]
        });

        const formatted = evaluations.map(ev => ({
            id: ev.id,
            date: ev.date,
            rate: ev.rate,
            comment: ev.comment,
            client: ev.evaluateur && ev.evaluateur.User ? {
                id: ev.evaluateur.id_client || null,
                nom: ev.evaluateur.User.nom || null,
                prenom: ev.evaluateur.User.prenom || null,
                email: ev.evaluateur.User.email || null
            } : null
        }));

        const average = evaluations.length ? Math.round((evaluations.reduce((s, e) => s + e.rate, 0) / evaluations.length) * 100) / 100 : null;

        return res.status(200).json({
            message: `Évaluations pour le livreur id=${livreurId}`,
            count: evaluations.length,
            average,
            evaluations: formatted
        });
    } catch (error) {
        console.error('Erreur getEvaluationsByLivreur:', error);
        return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
    }
};