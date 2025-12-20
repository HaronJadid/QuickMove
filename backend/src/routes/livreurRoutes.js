// backend/src/routes/livreurRoutes.js

const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreurController');

// Route pour rechercher les livreurs par ville (via query parameter)
// GET /api/livreurs?ville=NomDeLaVille
router.get('/', livreurController.findLivreursByCity);
router.get('/all', livreurController.getAllLivreurs);
router.get('/:id/evaluations', livreurController.getEvaluationsByLivreur);

// Demands management for driver
router.get('/:id/demands', livreurController.getDemandsByDriver);
router.put('/:id/demands/:demandeId/status', livreurController.updateDemandStatus);

// router.get('/:id', livreurController.getLivreurDetails); // Future route

module.exports = router;