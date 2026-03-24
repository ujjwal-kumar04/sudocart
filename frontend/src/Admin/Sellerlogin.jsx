import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from '../service/api';
import './Loginpage.css';

function Sellerlogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginSeller({
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            user: response.data.user,
            token: response.data.token
          })
        );
        localStorage.setItem('userRole', 'seller');
        alert('Seller Login Successful!');
        navigate('/seller/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Seller Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Mobile</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter email or mobile"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <span onClick={() => navigate('/seller/register')}>Register as Seller</span>
        </p>
      </div>
    </div>
  );
}

export default Sellerlogin;
