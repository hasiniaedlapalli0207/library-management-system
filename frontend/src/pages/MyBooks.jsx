import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatDate, daysUntil } from '../utils/helpers';

export default function MyBooks() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const res = await API.get('/transactions/my');
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const active = transactions.filter((t) => t.status === 'issued' || t.status === 'overdue');
  const returned = transactions.filter((t) => t.status === 'returned');
  const display = tab === 'active' ? active : returned;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>📖 My Books</h1>
        <p>Track your borrowed and returned books</p>
      </div>

      {/* Tabs */}
      <div className="filters-bar">
        <button
          className={`filter-chip ${tab === 'active' ? 'active' : ''}`}
          onClick={() => setTab('active')}
        >
          📤 Active ({active.length})
        </button>
        <button
          className={`filter-chip ${tab === 'returned' ? 'active' : ''}`}
          onClick={() => setTab('returned')}
        >
          ✅ Returned ({returned.length})
        </button>
      </div>

      {display.length > 0 ? (
        <div className="books-grid stagger-children">
          {display.map((t) => {
            const days = daysUntil(t.dueDate);
            const isOverdue = t.status === 'overdue';
            return (
              <div key={t._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '5px', background: t.book?.coverColor || '#3b82f6' }} />
                <div style={{ padding: '20px' }}>
                  <div className="book-category">{t.book?.author || 'Unknown Author'}</div>
                  <div className="book-title" style={{ marginBottom: '12px' }}>
                    {t.book?.title || 'Unknown Book'}
                  </div>

                  <div className="rack-badge" style={{ marginBottom: '14px' }}>
                    <span>📍</span>
                    <span>Rack {t.book?.rackNumber}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                        Issued
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {formatDate(t.issueDate)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {t.status === 'returned' ? 'Returned' : 'Due Date'}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: isOverdue ? 'var(--accent-rose)' : undefined,
                      }}>
                        {t.status === 'returned' ? formatDate(t.returnDate) : formatDate(t.dueDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`badge badge-${t.status}`}>
                      {t.status === 'issued' && <span className="pulse-dot" />}
                      {t.status}
                    </span>
                    {t.status === 'issued' && days !== null && (
                      <span style={{
                        fontSize: '0.78rem',
                        color: days <= 3 ? 'var(--accent-amber)' : 'var(--text-muted)',
                        fontWeight: 500,
                      }}>
                        {days > 0 ? `${days} days left` : 'Due today!'}
                      </span>
                    )}
                    {isOverdue && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 500 }}>
                        ⚠️ Overdue by {Math.abs(days)} days
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{tab === 'active' ? '📖' : '📚'}</div>
          <h3>{tab === 'active' ? 'No active borrows' : 'No return history'}</h3>
          <p>
            {tab === 'active' ? (
              <>Browse the <Link to="/books" style={{ color: 'var(--accent-blue)' }}>library</Link> to find your next read</>
            ) : (
              'Returned books will appear here'
            )}
          </p>
        </div>
      )}
    </div>
  );
}
