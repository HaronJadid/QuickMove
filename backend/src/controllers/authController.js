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
    const { nom, prenom, email, password, numero, role } = req.body;

    // 2. Validation basique (à étendre)
    if (!email || !password || !nom || !prenom) {
        return res.status(400).json({ message: "Veuillez fournir nom, prénom, email et mot de passe." });
    }
    const file = req.file;

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

        // 6️⃣ Build image URL (if file exists)
        const imgUrl = file
            ? `/uploads/avatars/${file.filename}`
            : null;


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
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                role: newUser.role,
                imgUrl: newUser.imgUrl
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
            imgUrl: user.imgUrl,
            nom: user.nom,
            prenom: user.prenom,
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

// Configuration Nodemailer
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Setup transporter using Gmail
// We use a fallback 'dummy' password to prevent startup crashes if env var is missing
// The actual sending will be skipped if the var is missing.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohssinengu@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'dummy_password_for_init'
    }
});

/**
 * Forgot Password: Generates a 6-digit code and sends it via email
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
    let { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Veuillez fournir votre email." });
    }

    email = email.toLowerCase();

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpires = new Date(Date.now() + 15 * 60000); // 15 mins

        user.resetCode = resetCode;
        user.resetCodeExpires = resetCodeExpires;
        await user.save();

        // Log code for development/debugging
        console.log(`[DEV] Reset Code for ${email}: ${resetCode}`);

        // Only attempt to send email if password is configured
        if (process.env.GMAIL_APP_PASSWORD) {
            const mailOptions = {
                from: '"QuickMove Support" <mohssinengu@gmail.com>',
                to: email,
                subject: 'Validation Code - MoveMorocco',
                html: `
                    <h3>Password Reset Request</h3>
                    <p>Hello ${user.prenom},</p>
                    <p>Your password reset code is:</p>
                    <h2 style="background-color: #f3f4f6; padding: 10px; display: inline-block; border-radius: 5px; letter-spacing: 5px;">${resetCode}</h2>
                    <p>This code expires in 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                `
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.warn("⚠️ GMAIL_APP_PASSWORD is missing in .env. Email was NOT sent. Use the code from the console.");
        }

        return res.status(200).json({
            message: "A verification code has been generated. Check your email (or console)."
        });

    } catch (error) {
        console.error("Erreur forgotPassword:", error);
        // We return 200 even if email fails in DEV mode if we want to proceed, but properly we should error.
        // However, given the user is stuck, let's treat it as a soft failure if code generated.
        return res.status(500).json({ message: "Error processing request.", details: error.message });
    }
};

/**
 * Verify Code: Checks if the code is correct
 * POST /api/auth/verify-code
 */
exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required." });
    }

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: "Invalid code." });
        }

        if (new Date() > user.resetCodeExpires) {
            return res.status(400).json({ message: "Code has expired." });
        }

        return res.status(200).json({ message: "Code verified successfully." });

    } catch (error) {
        console.error("Erreur verifyCode:", error);
        return res.status(500).json({ message: "Server error.", details: error.message });
    }
};

/**
 * Reset Password: Updates password using the verified code
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: "Email, code and new password are required." });
    }

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: "Invalid code." });
        }

        if (new Date() > user.resetCodeExpires) {
            return res.status(400).json({ message: "Code has expired." });
        }

        // Update password (hash hook will handle encryption)
        user.password = newPassword;
        user.resetCode = null;
        user.resetCodeExpires = null;

        await user.save();

        return res.status(200).json({ message: "Password updated successfully. You can now login." });

    } catch (error) {
        console.error("Erreur resetPassword:", error);
        return res.status(500).json({ message: "Server error.", details: error.message });
    }
};
