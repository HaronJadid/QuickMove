const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Create a booking for a client
router.post('/:id/book', clientController.createBooking);
// Get bookings for a client
router.get('/:id/bookings', clientController.getBookingsByClient);

module.exports = router;
