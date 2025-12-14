const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Get user by id
router.get('/:id', userController.getUserById);

module.exports = router;
