const Rental = require('../models/Rental');
const BoardGame = require('../models/Boardgame');

exports.rentGame = async (data) => {

  const {
    userId,
    gameId,
    quantity,
    days
  } = data;

  if (!quantity || quantity <= 0) {
    throw new Error('Invalid quantity');
  }
  
  if (!days || days <= 0) {
    throw new Error('Invalid rental duration');
  }

  const game = await BoardGame.findById(gameId);

  if (!game) {
    throw new Error('Game not found');
  }

  if (game.availableQuantity < quantity) {
    throw new Error('Not enough stock');
  }

  const deposit = game.rentalPrice * quantity * 2;

  const rental = await Rental.create({
    userId,
    gameId,
    quantity,
    rentDate: new Date(),
    dueDate: new Date(Date.now() + days * 86400000),
    depositAmount: deposit
  });

  game.availableQuantity -= quantity;

  if (game.availableQuantity === 0) {
    game.status = 'OutOfStock';
  }

  await game.save();

  return rental;
};

exports.returnGame = async (rentalId) => {

  const rental = await Rental.findById(rentalId);

  if (!rental) {
    throw new Error('Rental not found');
  }

  if (rental.status === 'Returned' || rental.returnDate) {
    throw new Error('Game already returned');
  }

  const game = await BoardGame.findById(rental.gameId);

  let fine = 0;

  const now = new Date();

  if (now > rental.dueDate) {

    const diffDays = Math.ceil(
      (now - rental.dueDate) / (1000 * 60 * 60 * 24)
    );

    fine = diffDays * 5;
  }

  rental.returnDate = now;

  rental.status = fine > 0 ? 'Late' : 'Returned';

  rental.fineAmount = fine;

  await rental.save();

  game.availableQuantity += rental.quantity;

  if (game.availableQuantity > 0) {
    game.status = 'Available';
  }

  await game.save();

  return {
    message: 'Returned successfully',
    fine
  };
};

exports.getRentalHistory = async (userId) => {

  return await Rental.find({ userId })
    .populate('gameId', 'title imageUrl rentalPrice')
    .sort({ createdAt: -1 });
};

exports.getAllRentals = async () => {

  return await Rental.find()
    .populate('userId', 'fullName email')
    .populate('gameId', 'title imageUrl')
    .sort({ createdAt: -1 });
};