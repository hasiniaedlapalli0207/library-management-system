const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue a book to a user
// @route   POST /api/transactions/issue
exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId, dueDays = 14 } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No copies available for issue',
      });
    }

    // Check if user already has this book issued
    const existingIssue = await Transaction.findOne({
      user: userId,
      book: bookId,
      status: 'issued',
    });
    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: 'User already has this book issued',
      });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(dueDays));

    // Create transaction
    const transaction = await Transaction.create({
      user: userId,
      book: bookId,
      dueDate,
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // Re-fetch with populated fields
    const populated = await Transaction.findById(transaction._id);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/transactions/return/:id
exports.returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned',
      });
    }

    // Update transaction
    transaction.returnDate = new Date();
    transaction.status = 'returned';
    await transaction.save();

    // Increment available copies
    const book = await Book.findById(transaction.book._id || transaction.book);
    if (book) {
      book.availableCopies = Math.min(book.availableCopies + 1, book.quantity);
      await book.save();
    }

    const updated = await Transaction.findById(transaction._id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions (admin)
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    // Update overdue statuses
    await Transaction.updateMany(
      { status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's transactions
// @route   GET /api/transactions/my
exports.getMyTransactions = async (req, res) => {
  try {
    // Update overdue statuses
    await Transaction.updateMany(
      { user: req.user._id, status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overdue transactions
// @route   GET /api/transactions/overdue
exports.getOverdue = async (req, res) => {
  try {
    // Update overdue statuses first
    await Transaction.updateMany(
      { status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const transactions = await Transaction.find({ status: 'overdue' }).sort({
      dueDate: 1,
    });

    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (for issue dropdown)
// @route   GET /api/transactions/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('name email');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
