import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        // Fetch user info

        const resUser = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let userData;
        try {
          userData = await resUser.json();
        } catch {
          throw new Error('Could not parse user info. Backend may be down or misconfigured.');
        }
        if (!resUser.ok) throw new Error(userData.msg || 'Failed to fetch user');
        setUser(userData);

        // Fetch tasks for stats
        const resTasks = await fetch(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = await resTasks.json();
        if (!resTasks.ok) throw new Error('Failed to fetch tasks');
        const completed = tasks.filter(t => t.completed).length;
        setStats({ total: tasks.length, completed });
      } catch (err) {
        setError(err.message || 'Server error');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  // Progress ring calculation
  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 70% 20%, #ffe29f 0%, #43cea2 40%, #185a9d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Accent shapes */}
      <div style={{
        position: 'absolute',
        top: 60, left: 80,
        width: 120, height: 120,
        background: 'linear-gradient(135deg, #43cea2 0%, #ffe29f 100%)',
        borderRadius: '50%',
        filter: 'blur(18px)',
        opacity: 0.5,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 40, right: 120,
        width: 90, height: 90,
        background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
        borderRadius: '50%',
        filter: 'blur(14px)',
        opacity: 0.4,
        zIndex: 0,
      }} />
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: '2.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 0 0 8px #43cea2',
        padding: '2.8rem 2.2rem 2.2rem 2.2rem',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.3rem', color: '#185a9d', marginBottom: '1.2rem', letterSpacing: 1 }}>Profile</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#185a9d', fontWeight: 600 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>
        ) : user && (
          <>
            {/* Geometric Avatar with Progress Ring */}
            <div style={{ position: 'relative', margin: '0 auto 1.2rem auto', width: 90, height: 90 }}>
              <svg width="90" height="90">
                <circle cx="45" cy="45" r="38" fill="url(#avatarBg)" />
                <defs>
                  <linearGradient id="avatarBg" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#43cea2" />
                    <stop offset="1" stopColor="#185a9d" />
                  </linearGradient>
                </defs>
                <circle
                  cx="45" cy="45" r="38"
                  fill="none"
                  stroke="#ffe29f"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - percent / 100)}
                  style={{ transition: 'stroke-dashoffset 0.7s' }}
                />
                <text x="50%" y="54%" textAnchor="middle" fontSize="2.2rem" fontWeight="900" fill="#fff" dy=".3em">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </text>
              </svg>
            </div>
            <div style={{ marginBottom: '0.5rem', textAlign: 'center', fontWeight: 800, fontSize: '1.25rem', color: '#185a9d', letterSpacing: 0.5 }}>{user.username}</div>
            <div style={{ color: '#555', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>{user.email}</div>
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.13rem', color: '#43cea2', marginBottom: '0.5rem', letterSpacing: 0.3 }}>
              Tasks Completed: {stats.completed} / {stats.total}
            </div>
            <div style={{ textAlign: 'center', color: '#185a9d', fontWeight: 700, fontSize: '1.08rem', marginTop: '0.5rem', letterSpacing: 0.2 }}>
              {stats.total > 0 ? `${percent}% done!` : 'No tasks yet.'}
            </div>
            {/* Achievement badges */}
            <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', marginTop: '1.2rem' }}>
              {percent >= 100 && <span style={{ background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: '#fff', fontWeight: 800, borderRadius: '1.2rem', padding: '0.4rem 1.1rem', fontSize: '1.05rem', boxShadow: '0 2px 8px #43cea2' }}>Goal Crusher</span>}
              {stats.completed >= 10 && <span style={{ background: 'linear-gradient(90deg, #ffe29f 0%, #43cea2 100%)', color: '#185a9d', fontWeight: 800, borderRadius: '1.2rem', padding: '0.4rem 1.1rem', fontSize: '1.05rem', boxShadow: '0 2px 8px #ffe29f' }}>10+ Tasks</span>}
              {stats.completed >= 1 && <span style={{ background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)', color: '#fff', fontWeight: 800, borderRadius: '1.2rem', padding: '0.4rem 1.1rem', fontSize: '1.05rem', boxShadow: '0 2px 8px #185a9d' }}>Starter</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
