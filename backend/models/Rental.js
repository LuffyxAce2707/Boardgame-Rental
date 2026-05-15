const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    rentedDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnedDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rental', rentalSchema);
