import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onHamburgerClick }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Hide on login/register
  if (["/", "/login", "/register"].includes(location.pathname)) return null;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-hamburger" aria-label="Menu" onClick={onHamburgerClick}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="7" x2="23" y2="7"/><line x1="5" y1="14" x2="23" y2="14"/><line x1="5" y1="21" x2="23" y2="21"/></svg>
        </button>
        <Link to="/dashboard" className="navbar-logo">
          <img src="/Kanba.png" alt="Kanba Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">TO-DO board</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/about" className="nav-link">About</Link>
        <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar; 