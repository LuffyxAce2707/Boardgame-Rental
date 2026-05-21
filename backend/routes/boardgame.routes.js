const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const boardgameController = require('../controllers/boardgame.controller');

// Public APIs
router.get('/', authMiddleware, boardgameController.getAllGames);
router.get('/:id',  authMiddleware, boardgameController.getGameById);
router.get('/search', authMiddleware, boardgameController.searchGames);

// Admin / Staff APIs
router.post(
  '/',
  authMiddleware(['admin', 'staff']),
  upload.single('image'),
  boardgameController.createGame
);

router.put(
  '/:id',
  authMiddleware(['admin', 'staff']),
  upload.single('image'),
  boardgameController.updateGame
);

router.delete(
  '/:id',
  authMiddleware(['admin']),
  boardgameController.deleteGame
);

module.exports = router;