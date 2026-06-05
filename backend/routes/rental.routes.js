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

// Customer checkout multiple games
router.post(
  '/checkout',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.checkoutRentals
);

// Return game
router.put(
  '/:id/return',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.returnGame
);

// Extend rental
router.put(
  '/:id/extend',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.extendRental
);

// Review returned rental
router.put(
  '/:id/review',
  authMiddleware(['customer', 'admin', 'staff']),
  rentalController.reviewRental
);

// Rental history
router.get(
  '/history',
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
