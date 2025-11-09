import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - will connect to backend
    login({ email, role });
    alert('Login successful! Redirecting to dashboard...');
    window.location.href = '/' + role + '/dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f3f4f6'
    }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>
          Login to Career Platform
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              placeholder="Enter your password"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="student">Student</option>
              <option value="institute">Institute</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span style={{ color: '#6b7280' }}>Don't have an account? </span>
          <a href="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
