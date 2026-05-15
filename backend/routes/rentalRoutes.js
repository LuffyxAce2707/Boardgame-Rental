const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  rentGame,
  returnGame,
  getUserRentals,
  getAllRentals,
  getRentalById
} = require('../controllers/rentalController');

// Protected routes (require authentication)
router.post('/rent', auth, rentGame);
router.post('/return', auth, returnGame);
router.get('/my-rentals', auth, getUserRentals);
router.get('/:id', auth, getRentalById);

// Admin routes (getting all rentals)
router.get('/', auth, getAllRentals);

module.exports = router;
