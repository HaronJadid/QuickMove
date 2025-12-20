const db = require('../../database/models');

// Créer un véhicule (driver only)
exports.createVehicule = async (req, res) => {
	const { nom, imgUrl, capacite } = req.body;
	const livreur_id = req.user?.id || req.body.livreur_id; // Prefer req.user.id if using auth middleware
	if (!nom || !capacite || !livreur_id) {
		return res.status(400).json({ message: 'nom, capacite, et livreur_id sont requis.' });
	}
	try {
		const livreur = await db.Livreur.findByPk(livreur_id);
		if (!livreur) return res.status(404).json({ message: 'Livreur introuvable.' });
		const vehicule = await db.Vehicule.create({ nom, imgUrl, capacite, livreur_id });
		return res.status(201).json({ message: 'Véhicule créé.', vehicule });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
	}
};

// Modifier un véhicule (driver only, must own the vehicule)
exports.editVehicule = async (req, res) => {
	const { id } = req.params;
	const { nom, imgUrl, capacite } = req.body;
	const livreur_id = req.user?.id || req.body.livreur_id;
	try {
		const vehicule = await db.Vehicule.findByPk(id);
		if (!vehicule) return res.status(404).json({ message: 'Véhicule introuvable.' });
		if (vehicule.livreur_id !== livreur_id) {
			return res.status(403).json({ message: 'Non autorisé à modifier ce véhicule.' });
		}
		if (nom !== undefined) vehicule.nom = nom;
		if (imgUrl !== undefined) vehicule.imgUrl = imgUrl;
		if (capacite !== undefined) vehicule.capacite = capacite;
		await vehicule.save();
		return res.status(200).json({ message: 'Véhicule modifié.', vehicule });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
	}
};

// Supprimer un véhicule (driver only, must own the vehicule)
exports.deleteVehicule = async (req, res) => {
	const { id } = req.params;
	const livreur_id = req.user?.id || req.body.livreur_id;
	try {
		const vehicule = await db.Vehicule.findByPk(id);
		if (!vehicule) return res.status(404).json({ message: 'Véhicule introuvable.' });
		if (vehicule.livreur_id !== livreur_id) {
			return res.status(403).json({ message: 'Non autorisé à supprimer ce véhicule.' });
		}
		await vehicule.destroy();
		return res.status(200).json({ message: 'Véhicule supprimé.' });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
	}
};

// Liste des véhicules d'un livreur (driver only)
exports.getVehiculesByDriver = async (req, res) => {
	const livreur_id = req.user?.id || req.params.livreur_id || req.body.livreur_id;
	if (!livreur_id) return res.status(400).json({ message: 'livreur_id requis.' });
	try {
		const vehicules = await db.Vehicule.findAll({ where: { livreur_id } });
		return res.status(200).json({ message: 'Liste des véhicules.', vehicules });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
	}
};
