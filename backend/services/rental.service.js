const Rental = require('../models/Rental');
const BoardGame = require('../models/Boardgame');
const crypto = require('crypto');

exports.rentGame = async (data) => {

  const {
    userId,
    gameId,
    quantity,
    days,
    paymentMethod = 'Cash',
    checkoutId = crypto.randomUUID()
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

  const rentalAmount = game.rentalPrice * quantity * days;
  const deposit = game.rentalPrice * quantity * 2;

  const rental = await Rental.create({
    userId,
    gameId,
    quantity,
    rentDate: new Date(),
    dueDate: new Date(Date.now() + days * 86400000),
    depositAmount: deposit,
    rentalAmount,
    amountPaid: rentalAmount + deposit,
    paymentMethod,
    paymentStatus: 'Paid',
    checkoutId
  });

  game.availableQuantity -= quantity;

  if (game.availableQuantity === 0) {
    game.status = 'OutOfStock';
  }

  await game.save();

  return rental;
};

exports.checkoutRentals = async (data) => {
  const {
    userId,
    items,
    days,
    paymentMethod = 'Cash'
  } = data;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Checkout requires at least one game');
  }

  if (!days || days <= 0) {
    throw new Error('Invalid rental duration');
  }

  const normalizedItems = items.map((item) => ({
    gameId: item.gameId,
    quantity: Number(item.quantity) || 1
  }));

  const games = await BoardGame.find({
    _id: {
      $in: normalizedItems.map((item) => item.gameId)
    }
  });

  const gamesById = new Map(
    games.map((game) => [game._id.toString(), game])
  );

  for (const item of normalizedItems) {
    const game = gamesById.get(String(item.gameId));

    if (!game) {
      throw new Error('One or more games were not found');
    }

    if (item.quantity <= 0) {
      throw new Error('Invalid quantity');
    }

    if (game.availableQuantity < item.quantity) {
      throw new Error(`Not enough stock for ${game.title}`);
    }
  }

  const checkoutId = crypto.randomUUID();
  const rentals = [];
  let rentalTotal = 0;
  let depositTotal = 0;

  for (const item of normalizedItems) {
    const game = gamesById.get(String(item.gameId));
    const rentalAmount = game.rentalPrice * item.quantity * days;
    const deposit = game.rentalPrice * item.quantity * 2;

    const rental = await Rental.create({
      userId,
      gameId: game._id,
      quantity: item.quantity,
      rentDate: new Date(),
      dueDate: new Date(Date.now() + days * 86400000),
      depositAmount: deposit,
      rentalAmount,
      amountPaid: rentalAmount + deposit,
      paymentMethod,
      paymentStatus: 'Paid',
      checkoutId
    });

    game.availableQuantity -= item.quantity;

    if (game.availableQuantity === 0) {
      game.status = 'OutOfStock';
    }

    await game.save();

    rentalTotal += rentalAmount;
    depositTotal += deposit;
    rentals.push(rental);
  }

  return {
    checkoutId,
    rentals,
    rentalTotal,
    depositTotal,
    amountPaid: rentalTotal + depositTotal,
    paymentStatus: 'Paid'
  };
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

  rental.status = 'Returned';

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
    .populate('gameId', 'title imageUrl rentalPrice')
    .sort({ createdAt: -1 });
};
