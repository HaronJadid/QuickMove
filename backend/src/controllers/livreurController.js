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

/**
 * Get all demands (trips) assigned to a driver
 * GET /api/livreur/:id/demands
 */
exports.getDemandsByDriver = async (req, res) => {
    const livreurId = req.params.id;

    try {
        const livreur = await db.Livreur.findByPk(livreurId);
        if (!livreur) return res.status(404).json({ message: `Livreur id=${livreurId} introuvable.` });

        // Fetch demands via Vehicule association (Vehicule -> Livreur)
        const demands = await db.Demande.findAll({
            include: [
                {
                    model: db.Vehicule,
                    as: 'VehiculeUtilise',
                    where: { livreur_id: livreurId },
                    attributes: ['id_vehicule', 'nom', 'imgUrl']
                },
                {
                    model: db.Client,
                    as: 'clients', // Many-to-Many via ClientDemandes
                    include: [{ model: db.User, attributes: ['nom', 'prenom', 'imgUrl', 'email', 'numero'] }],
                    through: { attributes: [] }
                },
                { model: db.Ville, as: 'VilleDepart', attributes: ['id_ville', 'nom'] },
                { model: db.Ville, as: 'VilleArrivee', attributes: ['id_ville', 'nom'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formatted = demands.map(d => ({
            id: d.id,
            status: d.status,
            prix: d.prix,
            comment: d.comment,
            dateDepartExacte: d.dateDepartExacte,
            dateArriveeExacte: d.dateArriveeExacte,
            villeDepart: d.VilleDepart ? d.VilleDepart.nom : null,
            villeArrivee: d.VilleArrivee ? d.VilleArrivee.nom : null,
            client: d.clients && d.clients.length > 0 && d.clients[0].User ? {
                id: d.clients[0].id_client,
                nom: d.clients[0].User.nom,
                prenom: d.clients[0].User.prenom,
                email: d.clients[0].User.email,
                numero: d.clients[0].User.numero, // Using correct column
                imgUrl: d.clients[0].User.imgUrl
            } : null,
            vehicule: d.VehiculeUtilise ? {
                id: d.VehiculeUtilise.id_vehicule,
                nom: d.VehiculeUtilise.nom
            } : null,
            createdAt: d.createdAt
        }));

        return res.status(200).json({
            message: `Demandes pour le livreur id=${livreurId}`,
            count: formatted.length,
            demands: formatted
        });

    } catch (error) {
        console.error('Erreur getDemandsByDriver:', error);
        return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
    }
};

/**
 * Update the status of a demand (e.g., CONFIRMED, COMPLETED)
 * PUT /api/livreur/:id/demands/:demandeId/status
 * Body: { status }
 */
exports.updateDemandStatus = async (req, res) => {
    const livreurId = req.params.id;
    const demandeId = req.params.demandeId;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Statut invalide. Valeurs permises: ${validStatuses.join(', ')}` });
    }

    try {
        // Find the demand and verify it belongs to this driver (via Vehicule)
        const demande = await db.Demande.findOne({
            where: { id: demandeId },
            include: [{
                model: db.Vehicule,
                as: 'VehiculeUtilise',
                where: { livreur_id: livreurId }
            }]
        });

        if (!demande) {
            return res.status(404).json({ message: "Demande introuvable ou ne concerne pas ce livreur." });
        }

        // Update status
        demande.status = status;
        await demande.save();

        return res.status(200).json({
            message: `Statut de la demande ${demandeId} mis à jour.`,
            status: demande.status,
            demande
        });

    } catch (error) {
        console.error('Erreur updateDemandStatus:', error);
        return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
    }
};