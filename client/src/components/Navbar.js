import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  // Hide on login/register
  if (["/", "/login", "/register"].includes(location.pathname)) return null;
  return (
    <nav className="navbar">
      <div className="navbar-logo">TodoBoard</div>
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
    </nav>
  );
};

export default Navbar; 