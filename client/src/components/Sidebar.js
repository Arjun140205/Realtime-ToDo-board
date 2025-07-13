import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <nav className="sidebar-nav">
      <NavLink to="/dashboard" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
        <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
        <span className="sidebar-link-text">Work Tasks</span>
      </NavLink>
      <NavLink to="/goals" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
        <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
        <span className="sidebar-link-text">Personal Goals</span>
      </NavLink>
      <NavLink to="/logs" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
        <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="16" height="8" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>
        <span className="sidebar-link-text">Logs</span>
      </NavLink>
      <NavLink to="/new-board" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
        <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="16" height="16" rx="4"/><path d="M8 12h8M12 8v8"/></svg></span>
        <span className="sidebar-link-text">New Board</span>
      </NavLink>
    </nav>
    <button className="sidebar-create-board">+ Create New Board</button>
    <button className="sidebar-theme-toggle" aria-label="Toggle theme" onClick={() => { document.body.classList.toggle('light'); }}>
      <span className="theme-icon">
        <svg className="sun" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>
        <svg className="moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
      </span>
    </button>
  </aside>
);

export default Sidebar; 