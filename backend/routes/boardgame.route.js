const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const boardgameController = require('../controllers/boardgame.controller');

const authMiddleware = require('../middleware/auth.middleware');

// Public APIs
router.get('/', boardgameController.getAllGames);
router.get('/:id', boardgameController.getGameById);
router.get('/search', boardgameController.searchGames);

// Admin / Staff APIs
router.post(
  '/',
  authMiddleware(['admin', 'staff']),
  boardgameController.createGame
);

router.put(
  '/:id',
  authMiddleware(['admin', 'staff']),
  boardgameController.updateGame
);

router.delete(
  '/:id',
  authMiddleware(['admin']),
  boardgameController.deleteGame
);

module.exports = router;