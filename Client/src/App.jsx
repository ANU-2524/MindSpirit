import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodoList from './components/Todos/TodoList';
import { AuthProvider, AuthContext } from './context/AuthContext';
import "./App.css"
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Redirect any unknown routes to /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
