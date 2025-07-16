import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url(/loginbackground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto'
    }}>
      {/* Glass morphism container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        margin: '20px',
        boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '300',
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>Welcome Back</h2>
          
          {error && (
            <div style={{ 
              color: '#ff6b6b', 
              marginBottom: '20px', 
              textAlign: 'center',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px'
            }}>{error}</div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              value={form.email}
              onChange={handleChange} 
              required 
              style={{ 
                width: '100%', 
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(147, 51, 234, 0.6)';
                e.target.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={form.password}
              onChange={handleChange} 
              required 
              style={{ 
                width: '100%', 
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(147, 51, 234, 0.6)';
                e.target.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '15px', 
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
              color: 'white', 
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px rgba(147, 51, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(147, 51, 234, 0.3)';
            }}
          >
            Sign In
          </button>
        </form>
        
        <p style={{ 
          textAlign: 'center', 
          marginTop: '25px', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: '#a855f7',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#c084fc'}
            onMouseLeave={(e) => e.target.style.color = '#a855f7'}
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;