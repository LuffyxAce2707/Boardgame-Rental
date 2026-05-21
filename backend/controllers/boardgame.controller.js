const inventoryService = require('../services/inventory.service');

const resolveImageUrl = (file, body) => {
  if (!file) {
    return body.imageUrl || '';
  }

  if (
    file.path &&
    (file.path.startsWith('http://') || file.path.startsWith('https://'))
  ) {
    return file.path;
  }

  const base =
    process.env.API_BASE_URL ||
    `http://localhost:${process.env.PORT || 5000}`;

  return `${base}${file.path}`;
};

const parseGameBody = (body, file) => {
  const gameData = {
    title: body.title,
    category: body.category,
    rentalPrice: Number(body.rentalPrice ?? body.pricePerDay) || 0,
    quantity: Number(body.quantity) || 1,
    imageUrl: resolveImageUrl(file, body)
  };

  if (body.description) {
    gameData.description = body.description;
  }

  return gameData;
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await inventoryService.getAllGames(req.query);

    res.json({
      success: true,
      data: games
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.createGame = async (req, res) => {
  try {
    const game = await inventoryService.createGame(
      parseGameBody(req.body, req.file)
    );

    res.status(201).json({
      success: true,
      data: game
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.searchGames = async (req, res) => {
  try {
    const games = await inventoryService.searchGames(req.query);

    res.json({
      success: true,
      data: games
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const updateData = parseGameBody(req.body, req.file);

    const updatedGame = await inventoryService.updateGame(
      req.params.id,
      updateData
    );

    if (!updatedGame) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    res.json({
      success: true,
      data: updatedGame
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
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
  try {
    const game = await inventoryService.getGameById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      data: game
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
