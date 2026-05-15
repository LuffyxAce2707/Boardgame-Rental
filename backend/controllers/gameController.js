const Game = require('../models/Game');

// GET all games
exports.getGames = async (req, res) => {
  try {
    const { genre, players, search } = req.query;

    let filter = {};

    if (genre) filter.genre = genre;

    if (players) filter.players = { $gte: Number(players) };

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i'
      };
    }

    const games = await Game.find(filter);
    res.json(games);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET game by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed data
exports.seedGames = async (req, res) => {
  try {
    await Game.deleteMany();

    const games = await Game.insertMany([
      { title: "Catan", genre: "Strategy", players: 4, price: 5 },
      { title: "Uno", genre: "Card", players: 6, price: 2 },
      { title: "Chess", genre: "Classic", players: 2, price: 3 }
    ]);

    res.json(games);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGame = async (req, res) => {
  try {
    const { title, genre, players, price, image } = req.body;

    // Validation
    if (!title || !genre || !players || price === undefined) {
      return res.status(400).json({ message: 'Title, genre, players, and price are required' });
    }
    if (title.length < 2) {
      return res.status(400).json({ message: 'Title must be at least 2 characters long' });
    }
    if (players < 1 || players > 20) {
      return res.status(400).json({ message: 'Players must be between 1 and 20' });
    }
    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const game = new Game({
      title,
      genre,
      players,
      price,
      image
    });

    const savedGame = await game.save();

    res.status(201).json(savedGame);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { title, genre, players, price, image, available } = req.body;

    // Validation for price if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }
    if (players !== undefined && (players < 1 || players > 20)) {
      return res.status(400).json({ message: 'Players must be between 1 and 20' });
    }
    if (title !== undefined && title.length < 2) {
      return res.status(400).json({ message: 'Title must be at least 2 characters long' });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { title, genre, players, price, image, available },
      { new: true, runValidators: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(updatedGame);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

