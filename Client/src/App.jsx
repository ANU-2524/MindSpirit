import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodoList from './components/Todos/TodoList';
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
