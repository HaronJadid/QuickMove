// backend/src/controllers/authController.js

const db = require('../../database/models'); // Assurez-vous que le chemin vers index.js est correct
const bcrypt = require('bcryptjs');

// Définissez le nombre de tours de hachage (salt rounds)
// Il est préférable de le lire depuis .env : process.env.BCRYPT_SALT_ROUNDS || 10
const SALT_ROUNDS = 10; 

/**
 * Gère l'inscription d'un nouvel utilisateur et crée son profil Client.
 */
exports.registerUser = async (req, res) => {
    // 1. Récupération des données du corps de la requête
    const { nom, prenom, email, password, imgUrl, numero, role } = req.body;

    // 2. Validation basique (à étendre)
    if (!email || !password || !nom || !prenom) {
        return res.status(400).json({ message: "Veuillez fournir nom, prénom, email et mot de passe." });
    }

    try {
        // --- VÉRIFICATION DE L'EXISTENCE ---
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        // Note: password hashing is handled in the User model hooks; do not double-hash here.
        const plainPassword = password;

        // --- TRANSACTION (Assurer l'atomicité) ---
        // On utilise une transaction pour s'assurer que si la création de Client échoue,
        // la création de User est annulée.
        const transaction = await db.sequelize.transaction();
        
        try {
            // 3. Création de l'entrée User dans la table 'users'
            // The User model has hooks that hash the password and create the corresponding
            // Client/Livreur profile based on the `role` field. We pass `role` here.
            const newUser = await db.User.create({
                nom,
                prenom,
                email,
                password: plainPassword,
                imgUrl,
                numero,
                role: role || 'client'
            }, { transaction });

            // 5. Commit de la transaction
            await transaction.commit();

            // 6. Succès et réponse
            // NOTE: Nous n'incluons JAMAIS le mot de passe dans la réponse.
            return res.status(201).json({
                message: "Inscription réussie.",
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role
            });

        } catch (error) {
            // En cas d'erreur (ex: validation Sequelize), annuler la transaction
            await transaction.rollback();
            throw error; // Propager l'erreur pour la gestion globale
        }

    } catch (error) {
        console.error("Erreur d'inscription:", error);
        return res.status(500).json({ 
            message: "Erreur serveur lors de l'inscription.",
            details: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    // 1. Récupération de l'ID depuis les paramètres de la route
    const userId = req.params.id;

    try {
        // 2. Recherche de l'utilisateur par clé primaire (ID)
        const user = await db.User.findByPk(userId, {
            // Sécurité : Nous excluons toujours le mot de passe hashé
            attributes: { exclude: ['password'] }, 
            
            // 3. Inclusion optionnelle des relations (Client et Livreur)
            // C'est souvent utile pour savoir quel type de profil l'utilisateur possède.
            include: [
                {
                    model: db.Client, // Inclus le profil Client
                    as: 'clientProfile',
                    required: false // La relation est facultative (un user peut ne pas être client/livreur dans un scénario plus complexe)
                },
                {
                    model: db.Livreur, // Inclus le profil Livreur
                    as: 'livreurProfile',
                    required: false
                }
            ]
        });

        // 4. Gestion de l'absence d'utilisateur
        if (!user) {
            return res.status(404).json({ message: `Utilisateur avec l'ID ${userId} non trouvé.` });
        }

        // 5. Succès et réponse
        return res.status(200).json({
            message: "Utilisateur récupéré avec succès.",
            user: user
        });

    } catch (error) {
        console.error("Erreur de récupération de l'utilisateur:", error);
        return res.status(500).json({ 
            message: "Erreur serveur lors de la récupération de l'utilisateur.",
            details: error.message
        });
    }

};