// backend/src/controllers/authController.js

const db = require('../../database/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Définissez le nombre de tours de hachage (salt rounds)
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

/**
 * Gère la connexion d'un utilisateur
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    try {
        // 1. Trouver l'utilisateur (avec le mot de passe explicitement inclus)
        const user = await db.User.findOne({
            where: { email },
            attributes: { include: ['password'] }
        });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // 3. Récupérer l'ID spécifique au rôle (Client ou Livreur)
        let roleId = null;
        let specificProfile = null;

        if (user.role === 'client') {
            specificProfile = await db.Client.findOne({ where: { id_client: user.id } });
            if (specificProfile) roleId = specificProfile.id_client;
        } else if (user.role === 'driver' || user.role === 'livreur') {
            specificProfile = await db.Livreur.findOne({ where: { id_livreur: user.id } });
            if (specificProfile) roleId = specificProfile.id_livreur;
        }

        // 4. Générer les tokens JWT
        const payload = {
            id: user.id,
            role: user.role,
            roleId: roleId
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret_access_key', { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'secret_refresh_key', { expiresIn: '7d' });

        // 5. Répondre
        return res.status(200).json({
            message: "Connexion réussie.",
            userId: user.id,
            role: user.role,
            clientId: user.role === 'client' ? roleId : null,
            driverId: (user.role === 'driver' || user.role === 'livreur') ? roleId : null,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Erreur login:", error);
        return res.status(500).json({ message: "Erreur serveur.", details: error.message });
    }
};
/**dont work with it because before i need to test it */
// // Configuration Nodemailer (Pour le développement, on utilise souvent un service factice comme Ethereal ou simplement le logging console si pas de SMTP)
// const nodemailer = require('nodemailer');

// // Setup transporter (A REMPLACER par vos vrais identifiants SMTP en production)
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.ethereal.email',
//     port: process.env.SMTP_PORT || 587,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER || 'ethereal_user',
//         pass: process.env.SMTP_PASS || 'ethereal_pass'
//     }
// });

// /**
//  * Forgot Password: Vérifie l'email et envoie un lien de réinitialisation
//  * POST /api/auth/forgot-password
//  */
// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: "Veuillez fournir votre email." });
//     }

//     try {
//         const user = await db.User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
//         }

//         // Générer un token de réinitialisation (valide 15 minutes)
//         // On utilise un secret différent ou concaténé avec le hash du pwd pour plus de sécurité (optionnel mais recommandé)
//         // Ici simple JWT pour la démo
//         const resetToken = jwt.sign(
//             { id: user.id },
//             process.env.JWT_RESET_SECRET || 'secret_reset_key',
//             { expiresIn: '15m' }
//         );

//         // Lien de réinitialisation (Frontend URL en réalité, mais pour l'API on renvoie le lien)
//         // Supposons que le frontend tourne sur localhost:3000 ou que c'est une route API directe
//         const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

//         // Envoyer l'email
//         const mailOptions = {
//             from: '"QuickMove Support" <no-reply@quickmove.com>',
//             to: email,
//             subject: 'Réinitialisation de votre mot de passe',
//             text: `Bonjour ${user.prenom},\n\nVous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant :\n\n${resetLink}\n\nCe lien expire dans 15 minutes.\n\nSi vous n'avez pas demandé cela, ignorez cet email.`
//         };

//         // NOTE: En dev, si pas de SMTP configuré, ceci peut échouer. On loggue le lien pour tester.
//         console.log(`[DEV MODE] Password Reset Link for ${email}: ${resetLink}`);

//         // Tentative d'envoi réel (peut être commenté si pas d'internet/SMTP)
//         // await transporter.sendMail(mailOptions); 

//         return res.status(200).json({
//             message: "Si l'email existe, un lien de réinitialisation a été envoyé.",
//             // Pour le débuggage/démo, on renvoie le lien (A RETIRER EN PROD)
//             debugLink: resetLink
//         });

//     } catch (error) {
//         console.error("Erreur forgotPassword:", error);
//         return res.status(500).json({ message: "Erreur serveur.", details: error.message });
//     }
// };

// /**
//  * Reset Password: Met à jour le mot de passe avec le token
//  * POST /api/auth/reset-password
//  */
// exports.resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;

//     if (!token || !newPassword) {
//         return res.status(400).json({ message: "Token et nouveau mot de passe requis." });
//     }

//     try {
//         // Vérifier le token
//         const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || 'secret_reset_key');

//         const user = await db.User.findByPk(decoded.id);
//         if (!user) {
//             return res.status(404).json({ message: "Utilisateur introuvable." });
//         }

//         // Hasher le nouveau mot de passe (IMPORTANT: le hook beforeUpdate le fera si on utilise user.save/update et changed('password'))
//         // Mais ici, on peut assigner directement et laisser le hook faire, ou hasher manuellement.
//         // Le hook `beforeUpdate` dans user.js gère le hashage si password est changé.

//         user.password = newPassword;
//         await user.save(); // Déclenche beforeUpdate

//         return res.status(200).json({ message: "Mot de passe mis à jour avec succès. Vous pouvez vous connecter." });

//     } catch (error) {
//         console.error("Erreur resetPassword:", error);
//         if (error.name === 'TokenExpiredError') {
//             return res.status(400).json({ message: "Le lien a expiré." });
//         }
//         return res.status(400).json({ message: "Lien invalide ou expiré.", details: error.message });
//     }
// };
