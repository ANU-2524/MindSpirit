
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Analytics({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/tasks/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('Could not parse analytics. Backend may be down or misconfigured.');
        }
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch analytics');
        setStats(data);
      } catch (err) {
        setError(err.message || 'Server error');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchAnalytics();
  }, [token]);

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
      {/* Geometric overlays */}
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
        maxWidth: '540px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.3rem', color: '#185a9d', marginBottom: '1.2rem', letterSpacing: 1 }}>Analytics</h2>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.18rem', color: '#43cea2', marginBottom: '1.2rem', letterSpacing: 0.5 }}>Keep Growing!</div>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#185a9d', fontWeight: 600 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>
        ) : stats && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#43cea2', marginBottom: '1.2rem', letterSpacing: 0.5 }}>Tasks Completed Per Day</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', alignItems: 'end', minHeight: 120, marginBottom: 8 }}>
              {stats.completedPerDay.map((val, idx) => (
                <div key={idx} style={{
                  width: '38px',
                  height: `${val * 22 + 18}px`,
                  background: 'linear-gradient(180deg, #43cea2 0%, #185a9d 100%)',
                  borderRadius: '1rem 1rem 0 0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  boxShadow: '0 6px 18px #43cea2',
                  position: 'relative',
                  transition: 'height 0.5s cubic-bezier(.68,-0.55,.27,1.55)',
                  transform: `translateY(${Math.max(0, 5 - val * 2)}px) scaleX(1.05)`,
                  border: val === Math.max(...stats.completedPerDay) ? '2.5px solid #185a9d' : 'none',
                  zIndex: 2,
                  boxSizing: 'border-box',
                  animation: `barGrow 0.7s ${idx * 0.08}s cubic-bezier(.68,-0.55,.27,1.55) both`,
                }}>
                  <span style={{ position: 'absolute', top: -28, left: 0, right: 0, fontSize: '1.1rem', color: '#185a9d', fontWeight: 800, opacity: val > 0 ? 1 : 0 }}>{val > 0 ? val : ''}</span>
                  <span style={{ opacity: 0 }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginTop: '0.5rem', color: '#185a9d', fontWeight: 800, fontSize: '1.1rem', letterSpacing: 0.5 }}>
              {stats.days.map((d, idx) => (
                <div key={idx} style={{ width: '38px', textAlign: 'center' }}>{d}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Keyframes for bar animation */}
      <style>{`
        @keyframes barGrow {
          from { height: 18px; opacity: 0.2; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
