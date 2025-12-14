// backend/src/controllers/userController.js

const db = require('../../database/models'); 

// ... (code existant pour getUserById)

/**
 * Promouvoir un utilisateur existant au statut de Livreur.
 * Nécessite l'ID de l'utilisateur et les informations du véhicule.
 */
exports.makeDriver = async (req, res) => {
    // L'ID de l'utilisateur à promouvoir est dans les paramètres de la route
    const userId = req.params.id; 
    
    // Les informations spécifiques au véhicule sont dans le corps de la requête
    const {
        // Livreur fields
        cin,
        about,
        // Vehicule fields (matchent au modèle Vehicule)
        nomVehicule,
        imgUrl,
        capacite
    } = req.body;

    // Validation basique
    if (!cin || !nomVehicule || !capacite) {
        return res.status(400).json({ message: "Veuillez fournir au minimum 'cin', 'nomVehicule' et 'capacite'." });
    }

    try {
        // 1. Vérifier si l'utilisateur existe
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: `Utilisateur avec l'ID ${userId} non trouvé.` });
        }

        // 2. Vérifier si un profil Livreur existe déjà (pour éviter les doublons)
        const existingLivreur = await db.Livreur.findByPk(userId);
        if (existingLivreur) {
            return res.status(409).json({ message: "Cet utilisateur est déjà un livreur." });
        }
        
        // --- DÉMARRER LA TRANSACTION ---
        // On crée à la fois le véhicule et le Livreur, la transaction assure que si l'un échoue, l'autre est annulé.
        const transaction = await db.sequelize.transaction();

        try {
                // 3. Création du Profil Livreur (doit utiliser l'ID de l'utilisateur comme PK)
                const newLivreur = await db.Livreur.create({
                    id_livreur: userId,
                    cin: cin,
                    about: about || null
                }, { transaction });

                // 4. Création du Véhicule et association au Livreur (via livreur_id)
                const newVehicule = await db.Vehicule.create({
                    nom: nomVehicule,
                    imgUrl: imgUrl || null,
                    capacite: capacite,
                    livreur_id: userId
                }, { transaction });

            // 5. Commit de la transaction
            await transaction.commit();

            // 6. Succès
            return res.status(201).json({
                message: "L'utilisateur a été promu au statut de Livreur avec succès.",
                livreurId: newLivreur.id_livreur,
                vehiculeId: newVehicule.id_vehicule
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error("Erreur lors de la promotion en Livreur:", error);
        return res.status(500).json({ 
            message: "Erreur serveur lors de la création du profil Livreur.",
            details: error.message
        });
    }
};