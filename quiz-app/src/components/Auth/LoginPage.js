import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';  // Sử dụng thư viện Google OAuth
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

// Cấu hình axios để gọi API
const api = axios.create({
  baseURL: 'http://localhost/WEBQUIZZ/Chucnang/',  // URL backend PHP
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', matkhau: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfReady, setCsrfReady] = useState(false);
  const navigate = useNavigate();

  // Fetch CSRF Token từ backend để bảo mật
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await api.get('csrf.php');
        api.defaults.headers.common['X-CSRF-TOKEN'] = response.data.token;
        setCsrfReady(true);
      } catch (error) {
        console.error("CSRF token error:", error);
        setMessage('System initializing. Please try again shortly.');
        api.defaults.headers.common['X-CSRF-TOKEN'] = 'fallback-token-' + Date.now();
        setCsrfReady(true);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!csrfReady) {
      setMessage('System initializing. Please wait.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Validation Email và Mật khẩu
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (!form.matkhau || form.matkhau.length < 6) {
      setMessage('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Gửi yêu cầu login với email và mật khẩu tới backend
      const res = await api.post('login.php', JSON.stringify(form));
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        setMessage('Login successful');
        setTimeout(() => navigate(res.data.user.role === 1 ? '/dashboard' : '/homepage'), 1000);
      } else {
        setMessage('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Google Login
  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setMessage('');

    try {
      const token = response.credential;

      // Gửi token Google lên backend PHP
      const res = await api.post('google-login.php', { 
        token: token 
      }, {
        headers: {
          'X-CSRF-TOKEN': api.defaults.headers.common['X-CSRF-TOKEN']
        }
      });

      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        setMessage('Google login successful');
        setTimeout(() => navigate(res.data.user.role === 1 ? '/dashboard' : '/homepage'), 1000);
      } else {
        setMessage(res.data.error || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setMessage('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <form className="login-page-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {message && <div>{message}</div>}

        {/* Form đăng nhập với email và mật khẩu */}
        <div className="input-group">
          <input
            name="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <input
            name="matkhau"
            type="password"
            className="input-field"
            value={form.matkhau}
            onChange={handleChange}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          className="login-btn" 
          type="submit" 
          disabled={loading || !csrfReady}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Google Login */}
        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setMessage('Google login failed')}
            useOneTap
            theme="filled_blue"
            size="large"
            text="continue_with"
          />
        </div>

        {/* Liên kết đăng ký */}
        <div className="register-link">
          <p>Don't have an account? 
            <button 
              type="button" 
              className="link-button"
              onClick={() => navigate("/register")}
            >
              Register now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
