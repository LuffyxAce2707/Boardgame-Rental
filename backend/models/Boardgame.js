const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    category: {
      type: String
    },

    minPlayers: {
      type: Number
    },

    maxPlayers: {
      type: Number
    },

    playTime: {
      type: Number
    },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },

    rentalPrice: {
      type: Number,
      default: 0
    },

    quantity: {
      type: Number,
      required: true,
      default: 1
    },

    availableQuantity: {
      type: Number,
      required: true,
      default: 1
    },

    image: {
      type: String
    },

    status: {
      type: String,
      enum: ['Available', 'Maintenance', 'OutOfStock'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

boardgameSchema.index({
  title: 'text',
  category: 'text'
});

module.exports = mongoose.model('BoardGame', boardgameSchema);