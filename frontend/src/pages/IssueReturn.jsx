import { useState, useEffect } from 'react';
import API from '../api/axios';
import { formatDate, daysUntil } from '../utils/helpers';

export default function IssueReturn() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [issueForm, setIssueForm] = useState({ userId: '', bookId: '', dueDays: 14 });
  const [issueError, setIssueError] = useState('');
  const [issueSuccess, setIssueSuccess] = useState('');
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [statusFilter]);

  const fetchAll = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const [txRes, userRes, bookRes] = await Promise.all([
        API.get(`/transactions${params}`),
        API.get('/transactions/users'),
        API.get('/books?limit=100'),
      ]);
      setTransactions(txRes.data.data);
      setUsers(userRes.data.data);
      setBooks(bookRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssueError('');
    setIssueSuccess('');
    setIssueLoading(true);
    try {
      await API.post('/transactions/issue', issueForm);
      setIssueSuccess('Book issued successfully!');
      setIssueForm({ userId: '', bookId: '', dueDays: 14 });
      fetchAll();
      setTimeout(() => setIssueSuccess(''), 3000);
    } catch (err) {
      setIssueError(err.response?.data?.message || 'Issue failed');
    } finally {
      setIssueLoading(false);
    }
  };

  const handleReturn = async (txId) => {
    if (!window.confirm('Confirm book return?')) return;
    try {
      await API.post(`/transactions/return/${txId}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Return failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>📤 Issue & Return</h1>
        <p>Manage book issuing and returns</p>
      </div>

      {/* Issue Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
          Issue a Book
        </h3>

        {issueError && <div className="auth-error">{issueError}</div>}
        {issueSuccess && (
          <div style={{
            background: 'var(--accent-emerald-glow)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: '0.82rem',
            color: 'var(--accent-emerald)',
            marginBottom: '20px',
          }}>
            ✅ {issueSuccess}
          </div>
        )}

        <form onSubmit={handleIssue}>
          <div className="issue-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="issue-user">Student</label>
              <select
                id="issue-user"
                className="form-input"
                value={issueForm.userId}
                onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                required
              >
                <option value="">Select student...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="issue-book">Book</label>
              <select
                id="issue-book"
                className="form-input"
                value={issueForm.bookId}
                onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                required
              >
                <option value="">Select book...</option>
                {books
                  .filter((b) => b.availableCopies > 0)
                  .map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title} ({b.availableCopies} avail)
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="issue-days">Due Days</label>
              <input
                id="issue-days"
                type="number"
                className="form-input"
                min="1"
                max="90"
                value={issueForm.dueDays}
                onChange={(e) => setIssueForm({ ...issueForm, dueDays: e.target.value })}
                style={{ width: '100px' }}
              />
            </div>

            <button type="submit" className="btn btn-success" disabled={issueLoading}>
              {issueLoading ? 'Issuing...' : 'Issue'}
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
            Transaction History
          </h3>
          <div className="flex gap-2">
            {['', 'issued', 'overdue', 'returned'].map((s) => (
              <button
                key={s}
                className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {transactions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Issued</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const days = daysUntil(t.dueDate);
                  return (
                    <tr key={t._id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {t.book?.title || 'Unknown'}
                      </td>
                      <td>{t.user?.name || 'Unknown'}</td>
                      <td>{formatDate(t.issueDate)}</td>
                      <td>
                        {formatDate(t.dueDate)}
                        {t.status === 'issued' && days !== null && days <= 3 && days > 0 && (
                          <span style={{ color: 'var(--accent-amber)', fontSize: '0.72rem', marginLeft: '6px' }}>
                            ⚠️ {days}d
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${t.status}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {(t.status === 'issued' || t.status === 'overdue') && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleReturn(t._id)}
                          >
                            Return
                          </button>
                        )}
                        {t.status === 'returned' && (
                          <span className="text-muted text-sm">
                            {formatDate(t.returnDate)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No transactions found</h3>
            <p>Issue a book to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
