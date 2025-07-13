import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = ({ open, onClose, onCreateBoard }) => {
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState('');

  const handleCreateBoard = () => {
    setShowModal(true);
    setBoardName('');
  };

  const handleModalSave = () => {
    if (boardName.trim()) {
      onCreateBoard(boardName.trim());
      setShowModal(false);
    }
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`} tabIndex={-1}>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} onClick={onClose}>
          <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
          <span className="sidebar-link-text">Work Tasks</span>
        </NavLink>
        <NavLink to="/logs" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} onClick={onClose}>
          <span className="sidebar-link-icon"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="16" height="8" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>
          <span className="sidebar-link-text">Logs</span>
        </NavLink>
      </nav>
      <button className="sidebar-create-board" onClick={handleCreateBoard}>+ Create New Board</button>
      <button className="sidebar-theme-toggle" aria-label="Toggle theme" onClick={() => { document.body.classList.toggle('light'); }}>
        <span className="theme-icon">
          <svg className="sun" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><g><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>
          <svg className="moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
        </span>
      </button>
      {showModal && (
        <div className="sidebar-modal-bg" onClick={() => setShowModal(false)}>
          <div className="sidebar-modal" onClick={e => e.stopPropagation()}>
            <h4>Name your new board</h4>
            <input
              type="text"
              value={boardName}
              onChange={e => setBoardName(e.target.value)}
              placeholder="Board name"
              autoFocus
            />
            <div className="sidebar-modal-actions">
              <button onClick={handleModalSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 