import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout, dark, setDark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navBtn = (label, path, icon) => (
    <button
      onClick={() => navigate(path)}
      style={{
        background: 'none',
        border: 'none',
        fontWeight: 800,
        fontSize: '1.13rem',
        color: location.pathname === path ? (dark ? '#ffd200' : '#f7971e') : (dark ? '#fff' : '#232526'),
        cursor: 'pointer',
        marginBottom: '2.1rem',
        textAlign: 'left',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        letterSpacing: 0.2,
        transition: 'color 0.2s',
      }}
    >
      <span style={{ fontSize: '1.3rem', opacity: location.pathname === path ? 1 : 0.7 }}>{icon}</span>
      {label}
    </button>
  );
  return (
    <div style={{
      minHeight: '100vh',
      width: 210,
      background: dark
        ? 'rgba(30,30,30,0.98)'
        : 'rgba(255,255,255,0.98)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '2.5rem 1.2rem 1.2rem 1.2rem',
      boxSizing: 'border-box',
      borderTopLeftRadius: '2.5rem',
      borderBottomLeftRadius: '2.5rem',
      color: dark ? '#fff' : '#232526',
      boxShadow: dark ? '2px 0 16px 0 #232526' : '2px 0 16px 0 #ffd200',
      position: 'relative',
      zIndex: 2,
    }}>
      {/* Vertical accent bar */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 8,
        background: dark ? 'linear-gradient(180deg, #ffd200 0%, #232526 100%)' : 'linear-gradient(180deg, #f7971e 0%, #ffd200 100%)',
        borderTopLeftRadius: '2.5rem',
        borderBottomLeftRadius: '2.5rem',
        zIndex: 3,
      }} />
      <div style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: '2.8rem', color: dark ? '#ffd200' : '#f7971e', letterSpacing: 1, width: '100%', textAlign: 'left', zIndex: 4 }}>MindSpirit</div>
      {navBtn('Tasks', '/tasks', '📋')}
      {navBtn('Profile', '/profile', '👤')}
      {navBtn('Analytics', '/analytics', '📊')}
      <div style={{ flex: 1 }} />
      <button
        onClick={() => setDark(d => !d)}
        style={{
          background: dark ? 'linear-gradient(90deg, #ffd200 0%, #232526 100%)' : 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
          color: dark ? '#232526' : '#fff',
          border: 'none',
          borderRadius: '1.2rem',
          padding: '0.6rem 1.2rem',
          fontWeight: 800,
          cursor: 'pointer',
          marginBottom: '1.2rem',
          width: '100%',
          fontSize: '1.08rem',
          letterSpacing: 0.2,
          boxShadow: dark ? '0 2px 8px #ffd200' : '0 2px 8px #f7971e',
        }}
      >
        {dark ? 'Light' : 'Dark'} Mode
      </button>
      <button
        onClick={onLogout}
        style={{
          background: dark ? 'linear-gradient(90deg, #ffd200 0%, #232526 100%)' : 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
          color: dark ? '#232526' : '#fff',
          padding: '0.7rem 1.5rem',
          border: 'none',
          borderRadius: '1.2rem',
          fontWeight: 800,
          fontSize: '1.08rem',
          boxShadow: dark ? '0 2px 8px #ffd200' : '0 2px 8px #f7971e',
          cursor: 'pointer',
          width: '100%',
          letterSpacing: 0.2,
        }}
      >
        Logout
      </button>
      <div style={{ width: '100%', textAlign: 'center', marginTop: '2.2rem', fontWeight: 700, fontSize: '1.05rem', color: dark ? '#ffd200' : '#f7971e', opacity: 0.8, letterSpacing: 0.2 }}>
        <span>Keep pushing forward!</span>
      </div>
    </div>
  );
}
