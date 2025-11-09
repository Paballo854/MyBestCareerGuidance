import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role
        const redirectPath = getDashboardPath(result.user.role);
        navigate(redirectPath);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'institute':
        return '/institute/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div className="card" style={{maxWidth: '400px', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>
            Welcome Back
          </h2>
          <p style={{color: '#6b7280'}}>Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{width: '100%', marginBottom: '16px', opacity: loading ? 0.6 : 1}}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{textAlign: 'center', color: '#6b7280'}}>
          Don't have an account?{' '}
          <Link to="/register" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500'}}>
            Sign up
          </Link>
        </p>

        {/* Test Credentials Info */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#0369a1'
        }}>
          <strong>Test Backend Connection:</strong><br/>
          Use your backend test credentials to login
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
