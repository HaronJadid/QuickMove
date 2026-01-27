const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');


router.post("/prix_estimee",aiController.prixEstimee);


module.exports = router;

