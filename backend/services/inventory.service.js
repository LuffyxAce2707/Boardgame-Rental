const BoardGame = require('../models/Boardgame');

const buildGameFilter = (query) => {
  const {
    category,
    difficulty,
    players,
    maxPlayTime,
    minPrice,
    maxPrice,
    status
  } = query;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (players) {
    const playerCount = Number(players);

    filter.minPlayers = { $lte: playerCount };
    filter.maxPlayers = { $gte: playerCount };
  }

  if (maxPlayTime) {
    filter.playTime = { $lte: Number(maxPlayTime) };
  }

  if (minPrice || maxPrice) {
    filter.rentalPrice = {};

    if (minPrice) {
      filter.rentalPrice.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.rentalPrice.$lte = Number(maxPrice);
    }
  }

  if (status) {
    filter.status = status;
  }

  return filter;
};

exports.getAllGames = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.max(Number(query.limit) || 10, 1);

  const skip = (page - 1) * limit;
  const filter = buildGameFilter(query);

  const [games, total] = await Promise.all([
    BoardGame.find(filter)
      .skip(skip)
      .limit(limit),
    BoardGame.countDocuments(filter)
  ]);

  return {
    games,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  };
};

exports.createGame = async (data) => {

  return await BoardGame.create({
    ...data,
    availableQuantity: data.quantity
  });
};

exports.searchGames = async (query) => {

  const {
    keyword,
    category,
    difficulty,
    minPlayers,
    maxPlayers
  } = query;

  let filter = {};

  if (keyword) {
    filter.title = {
      $regex: keyword,
    };
  }

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (minPlayers) {
    filter.minPlayers = {
      $gte: Number(minPlayers)
    };
  }

  if (maxPlayers) {
    filter.maxPlayers = {
      $lte: Number(maxPlayers)
    };
  }

  return await BoardGame.find(filter);
};

exports.updateGame = async (id, data) => {
  const existingGame = await BoardGame.findById(id);

  if (!existingGame) {
    return null;
  }

  const nextData = { ...data };

  if (Object.prototype.hasOwnProperty.call(nextData, 'quantity')) {
    const nextQuantity = Math.max(Number(nextData.quantity) || 1, 1);
    const rentedQuantity = Math.max(
      (existingGame.quantity || 0) - (existingGame.availableQuantity || 0),
      0
    );

    nextData.quantity = nextQuantity;
    nextData.availableQuantity = Math.max(nextQuantity - rentedQuantity, 0);

    if (existingGame.status !== 'Maintenance') {
      nextData.status =
        nextData.availableQuantity > 0 ? 'Available' : 'OutOfStock';
    }
  }

  Object.assign(existingGame, nextData);

  return await existingGame.save();
};

exports.deleteGame = async (id) => {

  return await BoardGame.findByIdAndDelete(id);
};

exports.getGameById = async (id) => {

  return await BoardGame.findById(id);
};
