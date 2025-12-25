const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');

// Update Client Profile
router.put('/client/:id', profileController.updateClientProfile);

// Update Driver Profile
router.put('/driver/:id', profileController.updateDriverProfile);

module.exports = router;
