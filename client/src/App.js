import { Routes, Route, useNavigate } from 'react-router-dom';
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
  const [boards, setBoards] = useState([]); // [{ name: string }]
  const navigate = useNavigate();

  const handleHamburgerClick = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleCreateBoard = (name) => {
    setBoards(prev => [...prev, { name }]);
    setSidebarOpen(false);
    navigate(`/board/${encodeURIComponent(name)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#191a23' }}>
      {showLayout && <Navbar onHamburgerClick={handleHamburgerClick} />}
      {showLayout && (
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} onCreateBoard={handleCreateBoard} />
      )}
      <div
        className={sidebarOpen ? 'sidebar-push-content' : ''}
        style={{
          marginTop: 0,
          paddingTop: showLayout ? NAVBAR_HEIGHT : 0,
          paddingLeft: showLayout ? (sidebarOpen ? 220 : 60) : 0,
          minHeight: `calc(100vh - ${showLayout ? NAVBAR_HEIGHT : 0}px)`,
          maxWidth: '100vw',
          overflowX: 'hidden',
          transition: 'padding-left 0.22s cubic-bezier(.4,0,.2,1), padding-top 0.22s cubic-bezier(.4,0,.2,1)'
        }}
      >
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
          {/* Render a new dashboard for each board */}
          <Route path="/board/:name" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
        {showLayout && <Footer />}
      </div>
    </div>
  );
};

export default App;