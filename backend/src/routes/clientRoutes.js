const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Create a booking for a client
router.post('/:id/book', clientController.createBooking);
// Get bookings for a client
router.get('/:id/bookings', clientController.getBookingsByClient);
// Get client statistics
router.get('/:id/statistics', clientController.getClientStatistics);

// Ratings
router.post('/:id/rate', clientController.rateDriver);
router.get('/:id/ratings', clientController.getClientRatings);
router.put('/:id/ratings/:ratingId', clientController.updateRating);
router.delete('/:id/ratings/:ratingId', clientController.deleteRating);

module.exports = router;
