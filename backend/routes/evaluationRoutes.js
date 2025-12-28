const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// POST /api/evaluations - Create a rating
router.post('/', evaluationController.createEvaluation);

// GET /api/drivers/:livreurId/evaluations - Get ratings for a driver
// Note: verify route path structure with main server.js, might need adjustment if mounted differently
router.get('/drivers/:livreurId', evaluationController.getDriverEvaluations);

module.exports = router;
