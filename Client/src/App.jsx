

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';


function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [dark, setDark] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Layout for authenticated pages
  const MainLayout = () => (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: dark ? 'linear-gradient(135deg, #232526 0%, #414345 100%)' : 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', transition: 'background 0.3s' }}>
      <Sidebar onLogout={handleLogout} dark={dark} setDark={setDark} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <Outlet />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        {token && (
          <Route element={<MainLayout />}>
            <Route path="/tasks" element={<Tasks token={token} dark={dark} />} />
            <Route path="/profile" element={<Profile token={token} dark={dark} />} />
            <Route path="/analytics" element={<Analytics token={token} dark={dark} />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
