const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchSuggestions,
  getCategories,
} = require('../controllers/bookController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Public-ish routes (require auth)
router.get('/search/suggestions', protect, searchSuggestions);
router.get('/categories/list', protect, getCategories);
router.get('/', protect, getBooks);
router.get('/:id', protect, getBook);

// Admin only
router.post('/', protect, requireRole('admin'), createBook);
router.put('/:id', protect, requireRole('admin'), updateBook);
router.delete('/:id', protect, requireRole('admin'), deleteBook);

module.exports = router;
