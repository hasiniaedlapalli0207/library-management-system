const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getTransactions,
  getMyTransactions,
  getOverdue,
  getUsers,
} = require('../controllers/transactionController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Student routes
router.get('/my', protect, getMyTransactions);

// Admin routes
router.get('/users', protect, requireRole('admin'), getUsers);
router.get('/overdue', protect, requireRole('admin'), getOverdue);
router.get('/', protect, requireRole('admin'), getTransactions);
router.post('/issue', protect, requireRole('admin'), issueBook);
router.post('/return/:id', protect, requireRole('admin'), returnBook);

module.exports = router;
