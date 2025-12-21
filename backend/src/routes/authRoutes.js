// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const upload = require("../middlewares/upload");


// Définition de l'endpoint d'inscription
// POST /api/auth/register
router.post('/register',upload.single("avatar"), authController.registerUser);

// POST /api/auth/login
router.post('/login', authController.login);

// Password Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
