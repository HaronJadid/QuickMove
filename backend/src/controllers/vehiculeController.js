const db = require('../../database/models');

// Créer un véhicule (driver only)
exports.createVehicule = async (req, res) => {
	const { nom, capacite } = req.body;
	// Multer files
	const files = req.files;
	const livreur_id = req.user?.id || req.body.livreur_id;

	if (!nom || !capacite || !livreur_id) {
		return res.status(400).json({ message: 'nom, capacite, et livreur_id sont requis.' });
	}

	try {
		// Start transaction
		const result = await db.sequelize.transaction(async (t) => {
			const livreur = await db.Livreur.findByPk(livreur_id, { transaction: t });
			if (!livreur) throw new Error('Livreur introuvable.');

			// Create Vehicle
			// For backward compatibility, we can keep imgUrl as the first image if needed, or null.
			const firstImage = files && files.length > 0 ? `/uploads/vehicules/${files[0].filename}` : null;

			const vehicule = await db.Vehicule.create({
				nom,
				imgUrl: firstImage, // Keep legacy field populated with main image
				capacite,
				livreur_id
			}, { transaction: t });

			// Create Images
			if (files && files.length > 0) {
				const imagePromises = files.map(file => {
					return db.VehiculeImage.create({
						url: `/uploads/vehicules/${file.filename}`,
						vehicule_id: vehicule.id_vehicule
					}, { transaction: t });
				});
				await Promise.all(imagePromises);
			}

			return vehicule; // Return the created object
		});

		// Fetch fresh with images
		const createdVehicule = await db.Vehicule.findByPk(result.id_vehicule, { include: ['images'] });

		return res.status(201).json({ message: 'Véhicule créé.', vehicule: createdVehicule });
	} catch (error) {
		if (error.message === 'Livreur introuvable.') return res.status(404).json({ message: error.message });
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
		// imgUrl update here only updates the string field, full image edit not fully impl in this snippet but okay for now
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
		const vehicules = await db.Vehicule.findAll({
			where: { livreur_id },
			include: ['images'] // Include the new association
		});
		return res.status(200).json({ message: 'Liste des véhicules.', vehicules });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
	}
};
