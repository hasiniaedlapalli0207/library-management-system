import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const status = book.availabilityStatus || (book.availableCopies > 0 ? 'Available' : book.quantity > 0 ? 'Issued' : 'Out of Stock');

  const badgeClass =
    status === 'Available'
      ? 'badge-available'
      : status === 'Issued'
      ? 'badge-issued'
      : 'badge-out';

  return (
    <div className="book-card" onClick={() => navigate(`/books/${book._id}`)}>
      <div className="book-cover" style={{ background: book.coverColor || '#3b82f6' }} />
      <div className="book-body">
        <div className="book-category">{book.category}</div>
        <div className="book-title">{book.title}</div>
        <div className="book-author">by {book.author}</div>
        <div className="book-meta">
          <span className={`badge ${badgeClass}`}>
            {status === 'Available' && <span className="pulse-dot" />}
            {status}
          </span>
          <div className="rack-badge" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            📍 {book.rackNumber}
          </div>
        </div>
        <div className="book-copies mt-2 text-sm text-muted">
          {book.availableCopies} of {book.quantity} copies available
        </div>
      </div>
    </div>
  );
}
