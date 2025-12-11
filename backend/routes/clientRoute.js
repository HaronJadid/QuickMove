const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Utilise POST pour la création
router.post('/register', clientController.Register);

module.exports = router;