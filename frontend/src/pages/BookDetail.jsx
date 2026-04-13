import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RackBadge from '../components/RackBadge';
import { formatDate } from '../utils/helpers';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await API.delete(`/books/${id}`);
      navigate('/books');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📖</div>
        <h3>Book not found</h3>
        <Link to="/books" className="btn btn-ghost mt-4">← Back to library</Link>
      </div>
    );
  }

  const status = book.availabilityStatus || (book.availableCopies > 0 ? 'Available' : book.quantity > 0 ? 'Issued' : 'Out of Stock');

  const badgeClass =
    status === 'Available'
      ? 'badge-available'
      : status === 'Issued'
      ? 'badge-issued'
      : 'badge-out';

  return (
    <div className="animate-fade-in book-detail">
      <button onClick={() => navigate('/books')} className="btn btn-ghost mb-4">
        ← Back to library
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="detail-header">
          <div className="color-strip" style={{ background: book.coverColor || '#3b82f6' }} />
          <div className="detail-info" style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px' }}>
              <span className="book-category">{book.category}</span>
            </div>
            <h1>{book.title}</h1>
            <p className="detail-author">by {book.author}</p>
            <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {status === 'Available' && <span className="pulse-dot" />}
                {status}
              </span>
              <RackBadge rackNumber={book.rackNumber} large />
            </div>
          </div>
        </div>

        {/* Smart Rack Locator Feature */}
        <div style={{
          background: status === 'Available'
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08))'
            : status === 'Issued'
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(244, 63, 94, 0.08))'
            : 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(139, 92, 246, 0.08))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {status === 'Available' ? '📍' : status === 'Issued' ? '📤' : '❌'}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {status === 'Available'
              ? `Available at Rack ${book.rackNumber}`
              : status === 'Issued'
              ? 'Currently Issued to a Student'
              : 'Out of Stock'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {status === 'Available'
              ? `${book.availableCopies} of ${book.quantity} copies on shelf`
              : status === 'Issued'
              ? `All ${book.quantity} copies are currently issued. Return location: Rack ${book.rackNumber}`
              : 'No copies available in the library'}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <div className="field-label">ISBN</div>
            <div className="field-value">{book.isbn}</div>
          </div>
          <div className="detail-field">
            <div className="field-label">Category</div>
            <div className="field-value">{book.category}</div>
          </div>
          <div className="detail-field">
            <div className="field-label">Total Copies</div>
            <div className="field-value">{book.quantity}</div>
          </div>
          <div className="detail-field">
            <div className="field-label">Available</div>
            <div className="field-value" style={{ color: book.availableCopies > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {book.availableCopies}
            </div>
          </div>
          <div className="detail-field">
            <div className="field-label">Rack Location</div>
            <div className="field-value">{book.rackNumber}</div>
          </div>
          <div className="detail-field">
            <div className="field-label">Added On</div>
            <div className="field-value">{formatDate(book.createdAt)}</div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => navigate(`/books/${book._id}/edit`)}>
              ✏️ Edit Book
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑️ Delete Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
