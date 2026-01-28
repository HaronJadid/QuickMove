const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');

const upload = require('../middlewares/upload');

// Update Client Profile
router.put('/client/:id', upload.single('avatar'), profileController.updateClientProfile);

// Update Driver Profile
router.put('/driver/:id', upload.single('avatar'), profileController.updateDriverProfile);

module.exports = router;
