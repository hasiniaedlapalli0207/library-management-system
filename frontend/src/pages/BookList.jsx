import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, category, availability]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/books/categories/list');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (availability) params.set('availability', availability);
      const res = await API.get(`/books?${params.toString()}`);
      setBooks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>📚 Book Library</h1>
          <p>
            {pagination.total || 0} titles in collection
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/books/new')}>
            + Add Book
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="filters-bar">
        <SearchBar onSearch={(q) => setSearch(q)} />
      </div>

      <div className="filters-bar">
        <button
          className={`filter-chip ${!availability ? 'active' : ''}`}
          onClick={() => setAvailability('')}
        >
          All
        </button>
        <button
          className={`filter-chip ${availability === 'available' ? 'active' : ''}`}
          onClick={() => setAvailability('available')}
        >
          ✅ Available
        </button>
        <button
          className={`filter-chip ${availability === 'issued' ? 'active' : ''}`}
          onClick={() => setAvailability('issued')}
        >
          📤 Issued
        </button>

        {categories.length > 0 && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 4px' }}>|</span>
            <button
              className={`filter-chip ${!category ? 'active' : ''}`}
              onClick={() => setCategory('')}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(category === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="books-grid stagger-children">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
