const rentalService = require('../services/rental.service');

exports.rentGame = async (req, res) => {
  try {

    const rental = await rentalService.rentGame(req.body);

    res.status(201).json({
  success: true,
  data: rental
});

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.returnGame = async (req, res) => {
  try {

    const result = await rentalService.returnGame(req.params.id);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.getRentalHistory = async (req, res) => {
  try {

    const rentals = await rentalService.getRentalHistory(req.params.userId);

    res.json(rentals);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.getAllRentals = async (req, res) => {
  try {

    const rentals = await rentalService.getAllRentals();

    res.json(rentals);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};