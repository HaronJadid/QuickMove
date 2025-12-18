// backend/src/routes/villeRoutes.js
const express = require('express');
const villeController = require('../controllers/villeController');

const router = express.Router();

// Create a new ville
router.post('/', villeController.createVille);

// Associate a ville to a livreur
router.post('/:villeId/assign/:livreurId', villeController.assignVilleToLivreur);

// Get all villes
router.get('/', villeController.getAllVilles);

// Get one ville
router.get('/:villeId', villeController.getVilleById);

// Update ville
router.put('/:villeId', villeController.updateVille);

// Delete ville
router.delete('/:villeId', villeController.deleteVille);

module.exports = router;
