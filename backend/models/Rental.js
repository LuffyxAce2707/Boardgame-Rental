const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardGame'
  },
  quantity: Number,
  rentDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: {
    type: String,
    enum: ['Rented', 'Returned', 'Late'],
    default: 'Rented'
  },
  depositAmount: Number,
  fineAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rental', rentalSchema);