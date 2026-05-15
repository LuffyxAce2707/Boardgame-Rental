const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    players: {
      type: Number,
      required: [true, 'Number of players is required'],
      min: [1, 'Minimum 1 player required'],
      max: [20, 'Maximum 20 players']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      default: null
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);