const inventoryService = require('../services/inventory.service');

exports.getAllGames = async (req, res) => {
  try {

    const games = await inventoryService.getAllGames(req.query);

    res.json(games);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.createGame = async (req, res) => {
  try {

    const gameData = {
      ...req.body,
      imageUrl: req.file ? req.file.path : ''
    };
    
    const game = await Boardgame.create(gameData);

    res.status(201).json(game);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.searchGames = async (req, res) => {
  try {

    const games = await inventoryService.searchGames(req.query);

    res.json(games);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedGame = await Boardgame.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedGame);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteGame = async (req, res) => {
  try {

    await inventoryService.deleteGame(req.params.id);

    res.json({
      message: 'Game deleted successfully'
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.getGameById = async (req, res) => {

  const game = await inventoryService.getGameById(
    req.params.id
  );

  res.json({
    success: true,
    data: game
  });
};