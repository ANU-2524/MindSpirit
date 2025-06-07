import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../../Styles/register.css"
const Register = () => {
  const BaseUrl = import.meta.env.VITE_BACKEND_URL;
  // console.log(BaseUrl) ;
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BaseUrl}/api/auth/register`, form);
      // Assume backend responds with { token, user }
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

return (
  <div className="register-container">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
    <p>
      Already have an account?{' '}
      <Link to="/login">Login here</Link>
    </p>
  </div>
);
};

export default Register;
