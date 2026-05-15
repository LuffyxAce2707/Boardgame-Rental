const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: String,
  minPlayers: Number,
  maxPlayers: Number,
  playTime: Number,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  rentalPrice: Number,
  quantity: Number,
  availableQuantity: Number,
  image: String,
  status: {
    type: String,
    enum: ['Available', 'Maintenance', 'OutOfStock'],
    default: 'Available'
  }
}, {
  timestamps: true
});

boardgameSchema.index({
  title: 'text',
  category: 'text'
});

module.exports = mongoose.model('BoardGame', boardgameSchema);