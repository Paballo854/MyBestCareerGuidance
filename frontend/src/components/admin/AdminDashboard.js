import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import InstitutionManagement from './InstitutionManagement';
import CompanyManagement from './CompanyManagement';
import SystemReports from './SystemReports';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();

  // WORKING LOGOUT FUNCTION
  const handleLogout = () => {
    console.log('🎯 LOGOUT BUTTON CLICKED!');
    alert('LOGOUT IS WORKING!');
    
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('✅ User confirmed logout');
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('🗑️ LocalStorage cleared');
      // Redirect to login
      window.location.href = '/login';
    }
  };

  // Mock statistics data
  const stats = {
    totalUsers: 1250,
    totalInstitutions: 15,
    totalCompanies: 42,
    pendingApprovals: 8,
    totalApplications: 1567,
    activeStudents: 980,
    jobPostings: 67,
    systemHealth: 'Excellent'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
              Admin Dashboard
            </h2>

            {/* Statistics Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px', 
              marginBottom: '40px' 
            }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  {stats.totalUsers}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Users</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                  {stats.totalInstitutions}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Institutions</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                  {stats.totalCompanies}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Companies</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                  {stats.pendingApprovals}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Pending Approvals</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab('users')}
                >
                  Manage Users
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('institutions')}
                >
                  Manage Institutions
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('companies')}
                >
                  Manage Companies
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('reports')}
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'institutions':
        return <InstitutionManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'reports':
        return <SystemReports />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
          Admin Panel
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#6b7280' }}>Welcome, Admin</span>
          <button 
            className="btn btn-secondary" 
            style={{ background: '#ef4444', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '30px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'users', label: 'User Management' },
          { key: 'institutions', label: 'Institution Management' },
          { key: 'companies', label: 'Company Management' },
          { key: 'reports', label: 'System Reports' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === tab.key ? '600' : '400',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
