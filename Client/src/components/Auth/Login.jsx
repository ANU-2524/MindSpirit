import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 
import "../../Styles/login.css"

const Login = () => {
  const BaseUrl = import.meta.env.VITE_BACKEND_URL; 
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/api/auth/login`, form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />

        <button type="submit">Login</button>
      </form>

      <p className="register-link">
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
