import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import About from './pages/About';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ActivityLog from './components/ActivityLog';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';

const NAVBAR_HEIGHT = 64; // px, adjust if your navbar height changes

const App = () => {
  const location = window.location.pathname;
  const hideNavFooter = ["/", "/login", "/register"].includes(location);
  const { user } = useContext(AuthContext);
  const showLayout = user && !hideNavFooter;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleHamburgerClick = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div style={{ minHeight: '100vh', background: '#191a23' }}>
      {showLayout && <Navbar onHamburgerClick={handleHamburgerClick} />}
      {showLayout && sidebarOpen && (
        <div className="sidebar-overlay" onClick={handleSidebarClose} />
      )}
      {showLayout && (
        <Sidebar 
          style={{
            position: 'fixed',
            top: NAVBAR_HEIGHT,
            left: sidebarOpen ? 0 : '-220px',
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)` ,
            width: 220,
            zIndex: 200,
            transition: 'left 0.22s cubic-bezier(.4,0,.2,1)',
            boxShadow: sidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.2)' : 'none',
            background: '#23243a',
            borderRight: '1.5px solid #2d2e4a',
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      )}
      <div style={{
        marginTop: showLayout ? NAVBAR_HEIGHT : 0,
        marginLeft: 0,
        minHeight: `calc(100vh - ${showLayout ? NAVBAR_HEIGHT : 0}px)`
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/logs" element={
            <ProtectedRoute>
              <ActivityLog />
            </ProtectedRoute>
          } />
        </Routes>
        {showLayout && <Footer />}
      </div>
    </div>
  );
};

export default App;