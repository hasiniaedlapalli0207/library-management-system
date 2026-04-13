import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import { formatDate, daysUntil } from '../utils/helpers';
import {
  HiOutlineBookOpen,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (isAdmin) {
        const res = await API.get('/dashboard/stats');
        setStats(res.data.data);
      } else {
        const res = await API.get('/transactions/my');
        setMyBooks(res.data.data);
      }
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

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>{isAdmin ? 'Here\'s your library overview' : 'Track your borrowed books'}</p>
      </div>

      {isAdmin && stats && (
        <>
          <div className="stats-grid stagger-children">
            <StatsCard
              icon={<HiOutlineBookOpen />}
              value={stats.totalBooks}
              label="Total Titles"
              color="#3b82f6"
            />
            <StatsCard
              icon={<HiOutlineCollection />}
              value={stats.totalCopies}
              label="Total Copies"
              color="#8b5cf6"
            />
            <StatsCard
              icon={<HiOutlineCheckCircle />}
              value={stats.availableCopies}
              label="Available"
              color="#10b981"
            />
            <StatsCard
              icon={<HiOutlineClock />}
              value={stats.activeIssues}
              label="Currently Issued"
              color="#f59e0b"
            />
            <StatsCard
              icon={<HiOutlineExclamation />}
              value={stats.overdueBooks}
              label="Overdue"
              color="#f43f5e"
            />
            <StatsCard
              icon={<HiOutlineUsers />}
              value={stats.totalUsers}
              label="Students"
              color="#06b6d4"
            />
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
              Recent Activity
            </h3>
            {stats.recentTransactions?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((t) => (
                    <tr key={t._id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {t.book?.title || 'Unknown'}
                      </td>
                      <td>{t.user?.name || 'Unknown'}</td>
                      <td>
                        <span className={`badge badge-${t.status}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{formatDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No recent activity</p>
              </div>
            )}
          </div>

          {/* Category Distribution */}
          {stats.categoryStats?.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
                Category Distribution
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stats.categoryStats.map((cat) => (
                  <div
                    key={cat._id}
                    className="filter-chip"
                    style={{ cursor: 'default' }}
                  >
                    {cat._id} ({cat.count} titles, {cat.totalCopies} copies)
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!isAdmin && (
        <>
          <div className="stats-grid stagger-children">
            <StatsCard
              icon={<HiOutlineClock />}
              value={myBooks.filter((t) => t.status === 'issued').length}
              label="Currently Borrowed"
              color="#3b82f6"
            />
            <StatsCard
              icon={<HiOutlineExclamation />}
              value={myBooks.filter((t) => t.status === 'overdue').length}
              label="Overdue"
              color="#f43f5e"
            />
            <StatsCard
              icon={<HiOutlineCheckCircle />}
              value={myBooks.filter((t) => t.status === 'returned').length}
              label="Returned"
              color="#10b981"
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
              My Borrowed Books
            </h3>
            {myBooks.filter((t) => t.status !== 'returned').length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Rack</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBooks
                    .filter((t) => t.status !== 'returned')
                    .map((t) => {
                      const days = daysUntil(t.dueDate);
                      return (
                        <tr key={t._id}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {t.book?.title || 'Unknown'}
                          </td>
                          <td>
                            <span className="rack-badge" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                              📍 {t.book?.rackNumber}
                            </span>
                          </td>
                          <td>
                            {formatDate(t.dueDate)}
                            {days !== null && days <= 3 && days > 0 && (
                              <span style={{ color: 'var(--accent-amber)', fontSize: '0.75rem', marginLeft: '8px' }}>
                                ({days}d left)
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge badge-${t.status}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <h3>No active borrows</h3>
                <p>Visit the Book List to find something to read!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
