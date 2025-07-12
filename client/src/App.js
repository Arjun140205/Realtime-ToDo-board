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

const App = () => {
  const location = window.location.pathname;
  const hideNavFooter = ["/", "/login", "/register"].includes(location);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!hideNavFooter && <Sidebar />}
      <div style={{ flex: 1, marginLeft: !hideNavFooter ? 60 : 0, marginBottom: !hideNavFooter ? 0 : 0 }}>
        {!hideNavFooter && <Navbar />}
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
        {!hideNavFooter && <Footer />}
      </div>
    </div>
  );
};

export default App;