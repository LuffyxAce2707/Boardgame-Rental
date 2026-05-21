const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    boardgame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boardgame',
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    rentDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    returnDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ['Rented', 'Returned', 'Late'],
      default: 'Rented'
    },

    depositAmount: {
      type: Number,
      default: 0
    },

    fineAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Rental', rentalSchema);