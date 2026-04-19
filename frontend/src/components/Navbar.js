import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        AI Study Assistant
      </Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>
          <span>Dashboard</span>
        </Link>
        <Link to="/materials" className={isActive('/materials')}>
          <span>Materials</span>
        </Link>
        <Link to="/subjects" className={isActive('/subjects')}>
          <span>Subjects</span>
        </Link>
        <Link to="/quizzes" className={isActive('/quizzes')}>
          <span>Quizzes</span>
        </Link>
        <Link to="/history" className={isActive('/history')}>
          <span>History</span>
        </Link>
        <div className="nav-user">
          <span className="nav-user-name">{user?.name}</span>
          <button className="nav-link" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
