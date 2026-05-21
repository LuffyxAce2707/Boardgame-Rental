const BoardGame = require('../models/Boardgame');

exports.getAllGames = async (query) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  return await BoardGame.find()
    .skip(skip)
    .limit(limit);
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

  return await BoardGame.findByIdAndUpdate(
    id,
    data,
    {
      new: true
    }
  );
};

exports.deleteGame = async (id) => {

  return await BoardGame.findByIdAndDelete(id);
};

exports.getGameById = async (id) => {

  return await BoardGame.findById(id);
};