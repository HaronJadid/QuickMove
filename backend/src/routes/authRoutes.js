// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Définition de l'endpoint d'inscription
// POST /api/auth/register
router.post('/register', authController.registerUser);

// POST /api/auth/login
router.post('/login', authController.login);

// Password Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
