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

    const game = await inventoryService.createGame(req.body);

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

    const game = await inventoryService.updateGame(
      req.params.id,
      req.body
    );

    res.json(game);

  } catch (err) {
    res.status(500).json({
      error: err.message
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