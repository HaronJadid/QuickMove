const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/evaluations - Create a rating (Protected)
router.post('/', authMiddleware, evaluationController.createEvaluation);

// GET /api/drivers/:livreurId/evaluations - Get ratings for a driver
// Public route (anyone can read ratings)
router.get('/drivers/:livreurId', evaluationController.getDriverEvaluations);

module.exports = router;
