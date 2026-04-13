const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCopies = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);
    const availableCopies = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } },
    ]);

    // Update overdue statuses
    await Transaction.updateMany(
      { status: 'issued', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const activeIssues = await Transaction.countDocuments({ status: 'issued' });
    const overdueBooks = await Transaction.countDocuments({ status: 'overdue' });
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalReturned = await Transaction.countDocuments({ status: 'returned' });

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Category distribution
    const categoryStats = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalCopies: { $sum: '$quantity' } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        totalCopies: totalCopies[0]?.total || 0,
        availableCopies: availableCopies[0]?.total || 0,
        issuedCopies: (totalCopies[0]?.total || 0) - (availableCopies[0]?.total || 0),
        activeIssues,
        overdueBooks,
        totalUsers,
        totalReturned,
        recentTransactions,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
