const db = require('../../database/models');
const { Op } = require('sequelize');

/**
 * Create a booking (Demande) for a client user
 * POST /api/client/:id/book
 */
exports.createBooking = async (req, res) => {
  const userId = req.params.id;
  const {
    ville_depart,
    ville_arrivee,
    prix,
    comment,
    dateDepartExacte,
    dateArriveeExacte,
    vehicule_id,
    livreur_id // must be provided by frontend (the driver being booked)
  } = req.body;

  if (!ville_depart || !ville_arrivee || prix == null || !vehicule_id || !livreur_id) {
    return res.status(400).json({ message: "Champs requis: 'ville_depart', 'ville_arrivee', 'prix', 'vehicule_id', 'livreur_id'." });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ message: `Utilisateur id=${userId} introuvable.` });
    if (user.role !== 'client') return res.status(403).json({ message: 'Utilisateur doit être client pour créer une demande.' });

    // Find villes by name (case-insensitive). Trim user input.
    const depart = await db.Ville.findOne({ where: { nom: { [Op.iLike]: ville_depart.trim() } } });
    const arrivee = await db.Ville.findOne({ where: { nom: { [Op.iLike]: ville_arrivee.trim() } } });
    if (!depart || !arrivee) {
      return res.status(404).json({ message: 'Ville de départ ou d arrivée introuvable. Vérifiez les noms dans la table `Ville`.' });
    }

    // --- VEHICULE/DRIVER VALIDATION ---
    // 1. Fetch the vehicule
    const vehicule = await db.Vehicule.findByPk(vehicule_id);
    if (!vehicule) {
      return res.status(404).json({ message: 'Véhicule introuvable.' });
    }
    // 2. Check that the vehicule belongs to the selected driver
    if (vehicule.livreur_id !== Number(livreur_id)) {
      return res.status(400).json({ message: 'Ce véhicule n\'appartient pas à ce livreur.' });
    }

    const transaction = await db.sequelize.transaction();
    try {
      const newDemande = await db.Demande.create({
        ville_depart_id: depart.id_ville,
        ville_arrivee_id: arrivee.id_ville,
        prix,
        comment: comment || null,
        dateDepartExacte: dateDepartExacte || null,
        dateArriveeExacte: dateArriveeExacte || null,
        vehicule_id,
        status: 'PENDING'
      }, { transaction });

      let client = await db.Client.findByPk(userId, { transaction });
      if (!client) {
        client = await db.Client.create({ id_client: userId }, { transaction });
      }

      const qi = db.sequelize.getQueryInterface();
      const now = new Date();
      await qi.bulkInsert('ClientDemandes', [{ client_id: userId, demande_id: newDemande.id, createdAt: now, updatedAt: now }], { transaction });

      await transaction.commit();
      return res.status(201).json({ message: 'Demande créée.', demande: newDemande });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error('Erreur createBooking (src clientController):', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Récupère toutes les demandes (bookings) liées à un client
 * GET /api/client/:id/bookings
 */
exports.getBookingsByClient = async (req, res) => {
  const clientId = req.params.id;
  try {
    const client = await db.Client.findByPk(clientId, {
      include: [
        {
          model: db.Demande,
          as: 'demandesFaites',
          through: { attributes: [] },
          include: [
            { model: db.Ville, as: 'VilleDepart', attributes: ['id_ville', 'nom'] },
            { model: db.Ville, as: 'VilleArrivee', attributes: ['id_ville', 'nom'] },
            { model: db.Vehicule, as: 'VehiculeUtilise', attributes: ['id_vehicule', 'nom', 'imgUrl', 'capacite'] }
          ]
        }
      ]
    });

    if (!client) return res.status(404).json({ message: `Client id=${clientId} introuvable.` });

    const demandes = (client.demandesFaites || []).map(d => ({
      id: d.id,
      status: d.status,
      prix: d.prix,
      comment: d.comment,
      dateDepartExacte: d.dateDepartExacte,
      dateArriveeExacte: d.dateArriveeExacte,
      villeDepart: d.VilleDepart ? { id: d.VilleDepart.id_ville, nom: d.VilleDepart.nom } : null,
      villeArrivee: d.VilleArrivee ? { id: d.VilleArrivee.id_ville, nom: d.VilleArrivee.nom } : null,
      vehicule: d.VehiculeUtilise ? { id: d.VehiculeUtilise.id_vehicule, nom: d.VehiculeUtilise.nom, capacite: d.VehiculeUtilise.capacite } : null,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    }));

    return res.status(200).json({ message: 'Bookings du client', count: demandes.length, demandes });
  } catch (error) {
    console.error('Erreur getBookingsByClient:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};


exports.getClientStatistics = async (req, res) => {
  const clientId = req.params.id;

  try {
    // Check if client exists
    const client = await db.Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: `Client id=${clientId} introuvable.` });
    }

    const stats = await db.Demande.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('Demande.id')), 'count'],
        [db.sequelize.fn('SUM', db.sequelize.col('prix')), 'totalSpent']
      ],
      include: [{
        model: db.Client,
        as: 'clients',
        where: { id_client: clientId },
        attributes: [],
        through: { attributes: [] }
      }],
      group: ['status'],
      raw: true
    });

    // Initialize result object
    let result = {
      completed: 0,
      pending: 0,
      confirmed: 0,
      totalSpent: 0
    };

    stats.forEach(s => {
      // With raw: true, s is a plain object. Keys might be 'status', 'count', 'totalSpent'
      const status = s.status;
      const count = parseInt(s.count, 10);
      const total = parseFloat(s.totalSpent) || 0;

      // Map DB status to our result keys (assuming case-insensitivity or direct match)
      if (status === 'COMPLETED') {
        result.completed = count;
        result.totalSpent += total;
      } else if (status === 'PENDING') {
        result.pending = count;
      } else if (status === 'CONFIRMED') {
        result.confirmed = count;
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error('Erreur getClientStatistics:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Rate a driver
 * POST /api/client/:id/rate
 * Body: { livreur_id, rate, comment }
 */
exports.rateDriver = async (req, res) => {
  const clientId = req.params.id;
  const { livreur_id, rate, comment } = req.body;

  if (!livreur_id || !rate) {
    return res.status(400).json({ message: "Champs requis: 'livreur_id', 'rate'." });
  }

  try {

    const hasWorkedWith = await db.Demande.findOne({
      where: {
        status: 'COMPLETED' // Only allow rating if trip is finished
      },
      include: [
        {
          model: db.Client,
          as: 'clients',
          where: { id_client: clientId },
          attributes: []
        },
        {
          model: db.Vehicule,
          as: 'VehiculeUtilise',
          where: { livreur_id: livreur_id },
          attributes: []
        }
      ]
    });

    if (!hasWorkedWith) {
      return res.status(403).json({ message: "Vous ne pouvez noter que les livreurs avec qui vous avez terminé une course." });
    }

    // 2. Create the evaluation
    const evaluation = await db.Evaluation.create({
      client_id: clientId,
      livreur_id: livreur_id,
      rate,
      comment,
      date: new Date()
    });

    return res.status(201).json({ message: "Évaluation ajoutée.", evaluation });

  } catch (error) {
    console.error('Erreur rateDriver:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Get all ratings made by a client
 * GET /api/client/:id/ratings
 */
exports.getClientRatings = async (req, res) => {
  const clientId = req.params.id;

  try {
    const ratings = await db.Evaluation.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: db.Livreur,
          as: 'evalue',
          include: [{
            model: db.User,
            attributes: ['nom', 'prenom', 'imgUrl'] // User has imgUrl, not photoUrl
          }],
          attributes: ['id_livreur']
        }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json(ratings);
  } catch (error) {
    console.error('Erreur getClientRatings:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Update a rating
 * PUT /api/client/:id/ratings/:ratingId
 */
exports.updateRating = async (req, res) => {
  const clientId = req.params.id;
  const ratingId = req.params.ratingId;
  const { rate, comment } = req.body;

  try {
    const evaluation = await db.Evaluation.findByPk(ratingId);
    if (!evaluation) {
      return res.status(404).json({ message: "Évaluation introuvable." });
    }

    if (evaluation.client_id != clientId) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    // Update
    if (rate) evaluation.rate = rate;
    if (comment !== undefined) evaluation.comment = comment; // Allow clearing comment if sent as null/empty

    await evaluation.save();

    return res.status(200).json({ message: "Évaluation mise à jour.", evaluation });
  } catch (error) {
    console.error('Erreur updateRating:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

/**
 * Delete a rating
 * DELETE /api/client/:id/ratings/:ratingId
 */
exports.deleteRating = async (req, res) => {
  const clientId = req.params.id;
  const ratingId = req.params.ratingId;

  try {
    const evaluation = await db.Evaluation.findByPk(ratingId);
    if (!evaluation) {
      return res.status(404).json({ message: "Évaluation introuvable." });
    }

    if (evaluation.client_id != clientId) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    await evaluation.destroy();

    return res.status(200).json({ message: "Évaluation supprimée." });
  } catch (error) {
    console.error('Erreur deleteRating:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};

