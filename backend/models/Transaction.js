const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      default: 'issued',
    },
  },
  { timestamps: true }
);

// Auto-populate user and book on find
transactionSchema.pre(/^find/, function () {
  this.populate('user', 'name email role');
  this.populate('book', 'title author isbn rackNumber coverColor');
});

module.exports = mongoose.model('Transaction', transactionSchema);
