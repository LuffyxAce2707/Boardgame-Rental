const express = require('express');
const router = express.Router();

const rentalController = require('../controllers/rental.controller');

const authMiddleware = require('../middleware/auth.middleware');

// Customer rent game
router.post(
  '/',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.rentGame
);

// Return game
router.put(
  '/:id/return',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.returnGame
);

// Rental history
router.get(
  '/history/:userId',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.getRentalHistory
);

// All rentals (admin/staff)
router.get(
  '/',
  authMiddleware(['admin', 'staff']),
  rentalController.getAllRentals
);

module.exports = router;