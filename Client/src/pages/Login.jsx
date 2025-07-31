
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        navigate('/tasks');
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        padding: '3.5rem 2rem 2rem 2rem',
        width: '100%',
        maxWidth: '350px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'visible',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        }}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>
        </div>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '2rem',
          marginTop: '2.5rem',
          marginBottom: '0.5rem',
          color: '#333',
          letterSpacing: '0.02em',
          textShadow: '0 2px 8px #e0e0e0',
        }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>Sign in to MindSpirit to manage your tasks!</p>
        {error && <div style={{ color: '#e53e3e', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #bdbdbd',
                borderRadius: '0.75rem',
                background: '#f7f7fa',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fc5c7d',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 20V8.99l8 7 8-7V20H4Z"/></svg>
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #bdbdbd',
                borderRadius: '0.75rem',
                background: '#f7f7fa',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6a82fb',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-7V7a6 6 0 0 0-12 0v3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-8-3a4 4 0 0 1 8 0v3H6V7Zm10 12H6v-7h12v7Z"/></svg>
            </span>
          </div>
          <button type="submit" style={{
            width: '100%',
            background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
            color: '#fff',
            padding: '0.9rem',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            marginTop: '0.5rem',
            boxShadow: '0 2px 8px #e0e0e0',
            cursor: 'pointer',
            transition: 'transform 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >Login</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/register" style={{ color: '#fc5c7d', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
}
