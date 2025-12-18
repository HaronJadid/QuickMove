const db = require('../../database/models');

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
    vehicule_id
  } = req.body;

  if (!ville_depart || !ville_arrivee || prix == null) {
    return res.status(400).json({ message: "Champs requis: 'ville_depart_id', 'ville_arrivee_id', 'prix'." });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ message: `Utilisateur id=${userId} introuvable.` });

    if (user.role !== 'client') return res.status(403).json({ message: 'Utilisateur doit être client pour créer une demande.' });

    const depart = await db.Ville.findByPk(ville_depart_id);
    const arrivee = await db.Ville.findByPk(ville_arrivee_id);
    if (!depart || !arrivee) return res.status(404).json({ message: 'Ville de départ ou d arrivée introuvable.' });

    const transaction = await db.sequelize.transaction();
    try {
      const newDemande = await db.Demande.create({
        ville_depart_id,
        ville_arrivee_id,
        prix,
        comment: comment || null,
        dateDepartExacte: dateDepartExacte || null,
        dateArriveeExacte: dateArriveeExacte || null,
        vehicule_id: vehicule_id || null,
        status: 'En attente'
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

