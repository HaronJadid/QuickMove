// backend/src/controllers/villeController.js

const db = require('../../database/models');

/**
 * Create a new Ville
 * POST /ville
 * body: { nom }
 */
exports.createVille = async (req, res) => {
  const { nom } = req.body;

  if (!nom || !nom.trim()) {
    return res.status(400).json({ message: "Le champ 'nom' est requis." });
  }

  try {
    const existing = await db.Ville.findOne({ where: { nom: nom.trim() } });
    if (existing) return res.status(409).json({ message: 'Ville déjà existante.' });

    const ville = await db.Ville.create({ nom: nom.trim() });
    return res.status(201).json({ message: 'Ville créée.', ville });
  } catch (error) {
    console.error('Erreur création ville:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création de la ville.', details: error.message });
  }
};

/**
 * Associate an existing Ville with a Livreur
 * POST /api/ville/assign-livreur
 * body: { villeNom, livreurId }
 */
exports.assignVilleToLivreur = async (req, res) => {
  const { villeNom, livreurId } = req.body;

  if (!villeNom || !livreurId) {
    return res.status(400).json({ message: "Les champs 'villeNom' et 'livreurId' sont requis." });
  }

  try {
    // Find ville by name (case insensitive)
    const ville = await db.Ville.findOne({
      where: {
        nom: { [db.Sequelize.Op.iLike]: villeNom.trim() }
      }
    });

    if (!ville) return res.status(404).json({ message: `Ville '${villeNom}' introuvable.` });

    const livreur = await db.Livreur.findByPk(livreurId);
    if (!livreur) return res.status(404).json({ message: `Livreur id=${livreurId} introuvable.` });

    // Use the association helper defined by alias `zonesService` on Livreur
    if (typeof livreur.hasZonesService === 'function') {
      const already = await livreur.hasZonesService(ville);
      if (already) return res.status(409).json({ message: 'Ce livreur couvre déjà cette ville.' });

      await livreur.addZonesService(ville);
      return res.status(200).json({
        message: `La ville ${ville.nom} a été ajoutée aux zones de service du livreur.`,
        ville: ville
      });
    }

    // Fallback: create entry in join table manually
    await db.sequelize.models.LivreurVilles.create({ livreur_id: livreurId, ville_id: ville.id_ville });
    return res.status(200).json({ message: `Ville ${ville.nom} associée au livreur (fallback).` });

  } catch (error) {
    console.error('Erreur association ville-livreur:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l association.', details: error.message });
  }
};

/**
 * Récupère toutes les villes
 * GET /api/ville
 */
exports.getAllVilles = async (req, res) => {
  try {
    const villes = await db.Ville.findAll({ attributes: ['id_ville', 'nom'] });
    return res.status(200).json({ message: 'Liste des villes', count: villes.length, villes });
  } catch (error) {
    console.error('Erreur récupération villes:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Récupère une ville par ID (avec livreurs desservant si demandé)
 * GET /api/ville/:villeId
 */
exports.getVilleById = async (req, res) => {
  const { villeId } = req.params;
  try {
    const ville = await db.Ville.findByPk(villeId, {
      attributes: ['id_ville', 'nom'],
      include: [
        {
          model: db.Livreur,
          as: 'livreursDesservant',
          through: { attributes: [] },
          attributes: ['id_livreur', 'cin', 'about'],
          include: [{ model: db.User, attributes: ['nom', 'prenom', 'email'] }]
        }
      ]
    });
    if (!ville) return res.status(404).json({ message: `Ville id=${villeId} introuvable.` });
    return res.status(200).json({ message: 'Ville trouvée', ville });
  } catch (error) {
    console.error('Erreur getVilleById:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Met à jour une ville
 * PUT /api/ville/:villeId
 * body: { nom }
 */
exports.updateVille = async (req, res) => {
  const { villeId } = req.params;
  const { nom } = req.body;
  if (!nom || !nom.trim()) return res.status(400).json({ message: "Le champ 'nom' est requis." });
  try {
    const ville = await db.Ville.findByPk(villeId);
    if (!ville) return res.status(404).json({ message: `Ville id=${villeId} introuvable.` });
    // Vérifier unicité
    const exists = await db.Ville.findOne({ where: { nom: nom.trim(), id_ville: { [db.Sequelize.Op.ne]: villeId } } });
    if (exists) return res.status(409).json({ message: 'Une autre ville porte déjà ce nom.' });
    ville.nom = nom.trim();
    await ville.save();
    return res.status(200).json({ message: 'Ville mise à jour.', ville });
  } catch (error) {
    console.error('Erreur updateVille:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Supprime une ville
 * DELETE /api/ville/:villeId
 */
exports.deleteVille = async (req, res) => {
  const { villeId } = req.params;
  try {
    const ville = await db.Ville.findByPk(villeId);
    if (!ville) return res.status(404).json({ message: `Ville id=${villeId} introuvable.` });
    await ville.destroy();
    return res.status(200).json({ message: 'Ville supprimée.' });
  } catch (error) {
    console.error('Erreur deleteVille:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Récupère les villes desservies par un livreur spécifique
 * GET /api/ville/driver/:driverId
 */
exports.getVilleByDriverid = async (req, res) => {
  const { driverId } = req.params;
  try {
    const livreur = await db.Livreur.findByPk(driverId, {
      include: [
        {
          model: db.Ville,
          as: 'zonesService',
          through: { attributes: [] }, // Masquer la table de liaison
          attributes: ['id_ville', 'nom']
        }
      ]
    });

    if (!livreur) {
      return res.status(404).json({ message: `Livreur id=${driverId} introuvable.` });
    }

    // Le tableau des villes est dans livreur.zonesService
    return res.status(200).json({
      message: 'Villes du livreur récupérées avec succès.',
      villes: livreur.zonesService
    });

  } catch (error) {
    console.error('Erreur getVilleByDriverid:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};
/**
 * Remove a city from a driver's service zones
 * DELETE /api/ville/:villeId/driver/:driverId
 */
exports.removeVilleFromDriver = async (req, res) => {
  const { villeId, driverId } = req.params;
  

  try {
    // Find the ville
    const ville = await db.Ville.findByPk(villeId);
    if (!ville) {
      return res.status(404).json({ message: `Ville id=${villeId} introuvable.` });
    }

    // Find the driver
    const driver = await db.Livreur.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ message: `Livreur id=${driverId} introuvable.` });
    }
    // Check if the driver actually serves this city
    const servesCity = await driver.hasZonesService(ville);
    
    if (!servesCity) {
      return res.status(404).json({ 
        message: `Le livreur ne dessert pas la ville ${ville.nom}.` 
      });
    }

    // Remove the association
    await driver.removeZonesService(ville);

    return res.status(200).json({ 
      message: `La ville ${ville.nom} a été retirée des zones de service du livreur.`,
      removed: true
    });

  } catch (error) {
    console.error('Erreur removeVilleFromDriver:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression de la ville des zones de service.', 
      details: error.message 
    });
  }
};