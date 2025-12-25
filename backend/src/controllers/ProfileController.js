const db = require('../../database/models');
const { Op } = require('sequelize');

/**
 * Update Client Profile
 * PUT /api/profile/client/:id
 * Body: { nom, prenom, email, numero }
 */
exports.updateClientProfile = async (req, res) => {
    const userId = req.params.id;
    const { nom, prenom, email, numero } = req.body;

    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        if (user.role !== 'client') {
            return res.status(403).json({ message: "Action non autorisée pour ce rôle." });
        }

        // Check email uniqueness if email is being updated
        if (email && email !== user.email) {
            const existingUser = await db.User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: userId } // Check if any OTHER user has this email
                }
            });
            if (existingUser) {
                return res.status(409).json({ message: "Cet adresse email est déjà utilisée." });
            }
            user.email = email;
        }

        // Update other fields if provided
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        if (numero) user.numero = numero;

        await user.save();

        return res.status(200).json({
            message: "Profil client mis à jour avec succès.",
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                numero: user.numero,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur updateClientProfile:", error);
        return res.status(500).json({ message: "Erreur serveur.", details: error.message });
    }
};

/**
 * Update Driver Profile
 * PUT /api/profile/driver/:id
 * Body: { nom, prenom, email, numero, about, cin }
 */
exports.updateDriverProfile = async (req, res) => {
    const userId = req.params.id;
    const { nom, prenom, email, numero, about, cin } = req.body;

    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        if (user.role !== 'driver' && user.role !== 'livreur') {
            return res.status(403).json({ message: "Action non autorisée pour ce rôle." });
        }

        // Check email uniqueness if email is being updated
        if (email && email !== user.email) {
            const existingUser = await db.User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: userId }
                }
            });
            if (existingUser) {
                return res.status(409).json({ message: "Cet adresse email est déjà utilisée." });
            }
            user.email = email;
        }

        // Transaction to update both User and Livreur tables atomically
        const transaction = await db.sequelize.transaction();

        try {
            // Update User table
            if (nom) user.nom = nom;
            if (prenom) user.prenom = prenom;
            if (numero) user.numero = numero;
            // Email is already assigned to user object above if valid
            await user.save({ transaction });

            // Update Livreur table
            const livreur = await db.Livreur.findOne({ where: { id_livreur: userId }, transaction });
            if (livreur) {
                if (about) livreur.about = about;
                if (cin) livreur.cin = cin;
                await livreur.save({ transaction });
            }

            await transaction.commit();

            return res.status(200).json({
                message: "Profil conducteur mis à jour avec succès.",
                user: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    numero: user.numero,
                    role: user.role
                },
                driverDetails: livreur ? {
                    cin: livreur.cin,
                    about: livreur.about
                } : null
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error("Erreur updateDriverProfile:", error);
        return res.status(500).json({ message: "Erreur serveur.", details: error.message });
    }
};
