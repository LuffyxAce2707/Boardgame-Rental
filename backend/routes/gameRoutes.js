const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getGames,
  getGameById,
  seedGames,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController');

router.get('/', getGames);
router.get('/seed', seedGames);
router.get('/:id', getGameById);
router.post('/', auth,  createGame);
router.put('/:id', auth,  updateGame);
router.delete('/:id', auth,  deleteGame);

module.exports = router;