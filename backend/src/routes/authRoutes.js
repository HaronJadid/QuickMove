// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Définition de l'endpoint d'inscription
// POST /api/auth/register
router.post('/register', authController.registerUser);
router.get('/users/:id', authController.getUserById);

module.exports = router;
