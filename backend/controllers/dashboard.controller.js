const BoardGame = require('../models/Boardgame');
const Rental = require('../models/Rental');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {

    const totalGames = await BoardGame.countDocuments();

    const rentedGames = await Rental.countDocuments({
      status: 'Active'
    });

    const totalUsers = await User.countDocuments();

    const revenue = await Rental.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: '$fineAmount'
          }
        }
      }
    ]);

    res.json({
      totalGames,
      rentedGames,
      totalUsers,
      revenue: revenue[0]?.total || 0
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};