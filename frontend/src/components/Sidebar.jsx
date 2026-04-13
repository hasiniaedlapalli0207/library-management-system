import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import {
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlinePlusCircle,
  HiOutlineSwitchHorizontal,
  HiOutlineCollection,
  HiOutlineLogout,
  HiOutlineX,
} from 'react-icons/hi';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: '/', icon: <HiOutlineViewGrid />, label: 'Dashboard' },
    { to: '/books', icon: <HiOutlineBookOpen />, label: 'Browse Books' },
  ];

  const adminItems = [
    { to: '/books/new', icon: <HiOutlinePlusCircle />, label: 'Add Book' },
    { to: '/transactions', icon: <HiOutlineSwitchHorizontal />, label: 'Issue / Return' },
  ];

  const studentItems = [
    { to: '/my-books', icon: <HiOutlineCollection />, label: 'My Books' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">📚</div>
          <div>
            <div className="brand-text">LibraTrack</div>
            <div className="brand-sub">Smart Library Manager</div>
          </div>
          <button className="sidebar-logout" onClick={onClose} style={{ marginLeft: 'auto', display: isOpen ? 'block' : 'none' }}>
            <HiOutlineX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {isAdmin && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Admin</div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          {!isAdmin && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">My Library</div>
              {studentItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="sidebar-logout" onClick={logout} title="Logout">
              <HiOutlineLogout />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
