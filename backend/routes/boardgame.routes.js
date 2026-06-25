const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();
const { uploadImage } = require('../middleware/uploadMiddleware');

const boardgameController = require('../controllers/boardgame.controller');

// Public APIs
router.get('/', boardgameController.getAllGames);
router.get('/search', boardgameController.searchGames);
router.get('/:id', boardgameController.getGameById);

// Admin / Staff APIs
router.post(
  '/',
  authMiddleware(['admin', 'staff']),
  uploadImage,
  boardgameController.createGame
);

router.put(
  '/:id',
  authMiddleware(['admin', 'staff']),
  uploadImage,
  boardgameController.updateGame
);

router.delete(
  '/:id',
  authMiddleware(['admin']),
  boardgameController.deleteGame
);

module.exports = router;
