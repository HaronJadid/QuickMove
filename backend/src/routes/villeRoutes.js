// backend/src/routes/villeRoutes.js
const express = require('express');
const villeController = require('../controllers/villeController');

const router = express.Router();

// Create a new ville
router.post('/', villeController.createVille);

// Associate a ville to a livreur
// Associate a ville to a livreur (Body: { villeNom, livreurId })
router.post('/assign-livreur', villeController.assignVilleToLivreur);


// Get all villes
router.get('/', villeController.getAllVilles);

// Get villes by driver ID
router.get('/driver/:driverId', villeController.getVilleByDriverid);

// Get one ville
router.get('/:villeId', villeController.getVilleById);

// Update ville
router.put('/:villeId', villeController.updateVille);

// Delete ville
router.delete('/:villeId', villeController.deleteVille);

// DELETE route for removing city from driver's service zones
router.delete('/:villeId/driver/:driverId', villeController.removeVilleFromDriver);

module.exports = router;