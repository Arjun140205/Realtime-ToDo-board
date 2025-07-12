import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  // Hide on login/register
  if (["/", "/login", "/register"].includes(location.pathname)) return null;
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-hamburger" aria-label="Menu">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="7" x2="23" y2="7"/><line x1="5" y1="14" x2="23" y2="14"/><line x1="5" y1="21" x2="23" y2="21"/></svg>
        </button>
        <span className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="#a78bfa" strokeWidth="4"/><path d="M20 8v24" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/><path d="M12 32l16-24" stroke="#f472b6" strokeWidth="4" strokeLinecap="round"/></svg>
          <span className="navbar-logo-text">kanba</span>
        </span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">Work Tasks</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
    </nav>
  );
};

export default Navbar; 