import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import UserManagement from './UserManagement';
import InstitutionManagement from './InstitutionManagement';
import CompanyManagement from './CompanyManagement';
import SystemReports from './SystemReports';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalCompanies: 0,
    pendingApprovals: 0,
    totalApplications: 0,
    activeStudents: 0,
    jobPostings: 0,
    applicationStats: { pending: 0, approved: 0, rejected: 0 },
    userCounts: { student: 0, institute: 0, company: 0, admin: 0 }
  });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      if (response.success && response.stats) {
        setStats({
          totalUsers: response.stats.totalUsers || 0,
          totalInstitutions: response.stats.totalInstitutions || 0,
          totalCompanies: response.stats.totalCompanies || 0,
          pendingApprovals: response.stats.applicationStats?.pending || 0,
          totalApplications: response.stats.totalApplications || 0,
          activeStudents: response.stats.userCounts?.student || 0,
          jobPostings: response.stats.totalJobs || 0,
          applicationStats: response.stats.applicationStats || { pending: 0, approved: 0, rejected: 0 },
          userCounts: response.stats.userCounts || { student: 0, institute: 0, company: 0, admin: 0 }
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // WORKING LOGOUT FUNCTION
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
              Admin Dashboard
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div>Loading dashboard data...</div>
              </div>
            ) : (
              <>
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
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      Students: {stats.userCounts.student} | Institutes: {stats.userCounts.institute} | Companies: {stats.userCounts.company}
                    </div>
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
                    <div style={{ color: '#6b7280', fontWeight: '500' }}>Pending Applications</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                      {stats.totalApplications}
                    </div>
                    <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Applications</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      Approved: {stats.applicationStats.approved} | Rejected: {stats.applicationStats.rejected}
                    </div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                      {stats.jobPostings}
                    </div>
                    <div style={{ color: '#6b7280', fontWeight: '500' }}>Job Postings</div>
                  </div>
                </div>
              </>
            )}

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
