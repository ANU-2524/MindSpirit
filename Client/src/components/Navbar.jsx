import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import '../Styles/navbar.css';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>🧠 MindSpirit</span>
      </div>
      <ul className="navbar-links">
        {token && <li><Link to="/">Todos</Link></li>}
        {token && <li><Link to="/profile">Profile</Link></li>}
        <li><ThemeToggle /></li>
        {token && <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
