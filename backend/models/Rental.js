const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    gameId: {
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
    },

    rentalAmount: {
      type: Number,
      default: 0
    },

    amountPaid: {
      type: Number,
      default: 0
    },

    paymentMethod: {
      type: String,
      enum: ['Card', 'Bank Transfer'],
      default: 'Bank Transfer'
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },

    checkoutId: {
      type: String
    },

    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    reviewText: {
      type: String,
      default: ''
    },

    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Rental', rentalSchema);
