const Rental = require('../models/Rental');
const Game = require('../models/Game');

// Rent a game
exports.rentGame = async (req, res) => {
  try {
    const { gameId, dueDate } = req.body;
    const userId = req.user.id;

    // Validation
    if (!gameId) {
      return res.status(400).json({ message: 'Game ID is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }

    // Check if game exists and is available
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (!game.available) {
      return res.status(400).json({ message: 'Game is not available for rental' });
    }

    // Check if user already has an active rental of this game
    const existingRental = await Rental.findOne({
      user: userId,
      game: gameId,
      status: 'active'
    });
    if (existingRental) {
      return res.status(400).json({ message: 'You already have an active rental of this game' });
    }

    // Create rental
    const rental = new Rental({
      user: userId,
      game: gameId,
      dueDate: new Date(dueDate)
    });

    await rental.save();

    // Mark game as unavailable
    game.available = false;
    await game.save();

    res.status(201).json({ message: 'Game rented successfully', rental });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return a game
exports.returnGame = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const userId = req.user.id;

    if (!rentalId) {
      return res.status(400).json({ message: 'Rental ID is required' });
    }

    // Find the rental
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Check if user owns this rental
    if (rental.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (rental.status !== 'active') {
      return res.status(400).json({ message: 'This rental is not active' });
    }

    // Update rental status
    rental.returnedDate = new Date();
    rental.status = 'returned';
    await rental.save();

    // Mark game as available
    const game = await Game.findById(rental.game);
    game.available = true;
    await game.save();

    res.json({ message: 'Game returned successfully', rental });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's rentals
exports.getUserRentals = async (req, res) => {
  try {
    const userId = req.user.id;

    const rentals = await Rental.find({ user: userId })
      .populate('game', 'title genre price')
      .sort({ rentedDate: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all active rentals (admin feature)
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'username')
      .populate('game', 'title genre price')
      .sort({ rentedDate: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'username')
      .populate('game', 'title genre price');

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
