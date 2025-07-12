import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <NavLink to="/dashboard" className={({ isActive }) => 'sidebar-icon' + (isActive ? ' active' : '')} title="Board">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    </NavLink>
    <NavLink to="/add" className={({ isActive }) => 'sidebar-icon' + (isActive ? ' active' : '')} title="Add">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    </NavLink>
    <NavLink to="/settings" className={({ isActive }) => 'sidebar-icon' + (isActive ? ' active' : '')} title="Settings">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
    </NavLink>
  </aside>
);

export default Sidebar; 