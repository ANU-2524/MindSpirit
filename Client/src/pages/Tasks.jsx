
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Tasks({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    // Ensure all fields are sent and fallback to defaults if empty
    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority: priority || 'Medium',
      category: category.trim() || 'General',
    };
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        // Defensive: ensure new task has all fields
        setTasks([{ ...data, dueDate: data.dueDate || payload.dueDate, priority: data.priority || payload.priority, category: data.category || payload.category }, ...tasks]);
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('Medium');
        setCategory('General');
      } else {
        setError(data.msg || 'Failed to add task');
      }
    } catch {
      setError('Server error');
    }
  };

  const handleComplete = async (id, completed) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !completed }),
    });
    setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  // Filter tasks by search
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(search.toLowerCase())) ||
    (task.category && task.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: dark
        ? 'radial-gradient(circle at 60% 20%, #232526 0%, #414345 100%)'
        : 'radial-gradient(circle at 60% 20%, #f7971e 0%, #ffd200 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s',
      overflow: 'hidden',
    }}>
      {/* Motivational accent shape */}
      <div style={{
        position: 'absolute',
        top: 60, left: 80,
        width: 120, height: 120,
        background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        borderRadius: '50%',
        filter: 'blur(18px)',
        opacity: 0.3,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 40, right: 120,
        width: 90, height: 90,
        background: 'linear-gradient(135deg, #232526 0%, #ffd200 100%)',
        borderRadius: '50%',
        filter: 'blur(14px)',
        opacity: 0.2,
        zIndex: 0,
      }} />
      <div style={{
        background: dark ? 'rgba(30,30,30,0.98)' : 'rgba(255,255,255,0.98)',
        borderRadius: '2.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 0 0 8px #ffe082',
        padding: '2.8rem 2.2rem 2.2rem 2.2rem',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        position: 'relative',
        color: dark ? '#fff' : '#232526',
        transition: 'background 0.3s, color 0.3s',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: 1, margin: 0, color: dark ? '#ffd200' : '#f7971e', textShadow: dark ? '0 2px 8px #232526' : '0 2px 8px #ffd200' }}>Your Tasks</h2>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: dark ? '#ffd200' : '#232526', marginTop: 8, marginBottom: 4, letterSpacing: 0.5 }}>
            "Every day is a fresh start. Crush your goals!"
          </div>
        </div>
        {/* Search and Task Form */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 2,
              minWidth: '120px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          />
        </div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
            }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{
              flex: 2,
              minWidth: '120px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
            }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
            }}
          />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
            }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '0.75rem',
              border: `2px solid ${dark ? '#ffd200' : '#f7971e'}`,
              borderRadius: '0.9rem',
              background: dark ? '#232526' : '#fffbe7',
              fontSize: '1.05rem',
              outline: 'none',
              color: dark ? '#fff' : '#232526',
              fontWeight: 600,
            }}
          />
          <button type="submit" style={{
            background: dark ? 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)' : 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
            color: dark ? '#232526' : '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.9rem',
            fontWeight: 900,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px #ffe082',
            cursor: 'pointer',
            transition: 'transform 0.15s',
            letterSpacing: 0.5,
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >Add</button>
        </form>
        {error && <div style={{ color: '#e53e3e', marginBottom: '1rem', textAlign: 'center', fontWeight: 700 }}>{error}</div>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%' }}>
          {filteredTasks.length === 0 && (
            <li style={{ textAlign: 'center', color: dark ? '#ffd200' : '#f7971e', fontWeight: 700, fontSize: '1.15rem' }}>No tasks found.</li>
          )}
          {filteredTasks.map((task, idx) => (
            <li key={task._id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              background: task.completed ? 'linear-gradient(90deg, #b2ff59 0%, #f0f0f0 100%)' : (dark ? 'linear-gradient(90deg, #232526 0%, #414345 100%)' : 'linear-gradient(90deg, #fffbe7 0%, #fff 100%)'),
              borderLeft: `6px solid ${task.completed ? '#43cea2' : (task.priority === 'High' ? '#ff1744' : task.priority === 'Low' ? '#2979ff' : '#ffd200')}`,
              borderRadius: '1.2rem',
              boxShadow: '0 2px 12px #ffe082',
              padding: '1.3rem 1.2rem',
              opacity: task.completed ? 0.7 : 1,
              transition: 'opacity 0.2s, box-shadow 0.2s',
              gap: '1.5rem',
              marginBottom: '0.2rem',
              position: 'relative',
              animation: `taskCardIn 0.7s ${idx * 0.07}s cubic-bezier(.68,-0.55,.27,1.55) both`,
            }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontWeight: 900,
                  fontSize: '1.18rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#43cea2' : (dark ? '#ffd200' : '#f7971e'),
                  letterSpacing: 0.5,
                }}>{task.title}</span>
                <p style={{ fontSize: '1.01rem', color: dark ? '#bbb' : '#888', margin: '0.2rem 0 0.5rem 0', fontWeight: 600 }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.99rem', color: dark ? '#ffd200' : '#f7971e', marginTop: '0.2rem', fontWeight: 700 }}>
                  {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  <span>Priority: <span style={{ color: task.priority === 'High' ? '#ff1744' : task.priority === 'Low' ? '#2979ff' : (dark ? '#ffd200' : '#f7971e'), fontWeight: 900 }}>{task.priority}</span></span>
                  <span>Category: {task.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <button onClick={() => handleComplete(task._id, task.completed)} style={{
                  background: task.completed ? 'linear-gradient(90deg, #43cea2 0%, #b2ff59 100%)' : 'linear-gradient(90deg, #2979ff 0%, #43cea2 100%)',
                  color: '#fff',
                  padding: '0.5rem 1.1rem',
                  border: 'none',
                  borderRadius: '0.9rem',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  marginBottom: '0.2rem',
                  letterSpacing: 0.3,
                  boxShadow: '0 2px 8px #43cea2',
                }}>{task.completed ? 'Undo' : 'Complete'}</button>
                <button onClick={() => handleDelete(task._id)} style={{
                  background: 'linear-gradient(90deg, #ff1744 0%, #ff8a65 100%)',
                  color: '#fff',
                  padding: '0.5rem 1.1rem',
                  border: 'none',
                  borderRadius: '0.9rem',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  letterSpacing: 0.3,
                  boxShadow: '0 2px 8px #ff1744',
                }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <style>{`
          @keyframes taskCardIn {
            from { opacity: 0; transform: translateY(30px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    </div>
  );
}
