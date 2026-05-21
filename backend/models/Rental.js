const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    gameID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoardGame',
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
      enum: ['Active','Returned','Late'],
      default: 'Active'
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