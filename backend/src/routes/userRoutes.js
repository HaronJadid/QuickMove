const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/:id/make-driver', userController.makeDriver);

module.exports = router;
