import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, userRole, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      student: 'Student',
      institute: 'Institution',
      company: 'Company',
      admin: 'Administrator'
    };
    return roles[role] || 'User';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#1f2937',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '8px',
                marginRight: '10px'
              }}></div>
              CareerGuide
            </Link>
            
            <nav style={{ display: 'flex', gap: '25px' }}>
              <Link to="/dashboard" style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#eff6ff'
              }}>
                Dashboard
              </Link>
              <Link to="/profile" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px'
              }}>
                Profile
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{userName}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {getRoleDisplayName(userRole)}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '6px',
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
