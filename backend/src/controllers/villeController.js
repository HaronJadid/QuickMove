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
 * POST /ville/:villeId/assign/:livreurId
 */
exports.assignVilleToLivreur = async (req, res) => {
  const { villeId, livreurId } = req.params;

  try {
    const ville = await db.Ville.findByPk(villeId);
    if (!ville) return res.status(404).json({ message: `Ville id=${villeId} introuvable.` });

    const livreur = await db.Livreur.findByPk(livreurId);
    if (!livreur) return res.status(404).json({ message: `Livreur id=${livreurId} introuvable.` });

    // Use the association helper defined by alias `zonesService` on Livreur
    if (typeof livreur.hasZonesService === 'function') {
      const already = await livreur.hasZonesService(ville);
      if (already) return res.status(409).json({ message: 'Association déjà existante.' });
      await livreur.addZonesService(ville);
      return res.status(200).json({ message: 'Ville associée au livreur.' });
    }

    // Fallback: create entry in join table manually
    await db.sequelize.models.LivreurVilles.create({ livreur_id: livreurId, ville_id: villeId });
    return res.status(200).json({ message: 'Ville associée au livreur (fallback).' });

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
