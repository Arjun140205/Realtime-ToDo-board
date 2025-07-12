import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import About from './pages/About';
import Footer from './components/Footer';

const App = () => {
  const location = window.location.pathname;
  const hideNavFooter = ["/", "/login", "/register"].includes(location);
  return (
    <>
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
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
};

export default App;