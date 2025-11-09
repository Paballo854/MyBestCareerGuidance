import React, { useState, useEffect } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import CourseBrowser from './CourseBrowser';
import ApplicationManagement from './ApplicationManagement';
import TranscriptUpload from './TranscriptUpload';
import JobSearch from './JobSearch';
import StudentProfile from './StudentProfile';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    applications: 0,
    admitted: 0,
    pending: 0,
    jobsApplied: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      applications: 5,
      admitted: 2,
      pending: 3,
      jobsApplied: 3
    });
  }, []);

  const StatCard = ({ title, value, color }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ color: '#6b7280', fontWeight: '500' }}>{title}</div>
    </div>
  );

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatCard title="Total Applications" value={stats.applications} color="#3b82f6" />
        <StatCard title="Admitted" value={stats.admitted} color="#10b981" />
        <StatCard title="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard title="Jobs Applied" value={stats.jobsApplied} color="#8b5cf6" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('courses')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎓</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Browse Courses</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Discover and apply to academic programs</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('applications')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📋</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>My Applications</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Track your course applications</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('transcripts')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Documents</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Upload academic transcripts</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('jobs')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>💼</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Job Search</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Find employment opportunities</p>
        </div>
      </div>

      {/* Profile Quick Access */}
      <div 
        className="card" 
        style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
        onClick={() => setActiveTab('profile')}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>My Profile</h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Update your personal information and preferences</p>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Recent Activity
        </h2>
        <div style={{ color: '#6b7280' }}>
          <p>✅ Application submitted to Limkokwing University - BSc in IT (Jan 15)</p>
          <p>📋 Application under review at National University of Lesotho</p>
          <p>🎓 Admitted to Botho University - Software Engineering</p>
          <p>📄 Transcript uploaded and verified</p>
          <p>👤 Profile updated successfully</p>
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'courses':
        return <CourseBrowser />;
      case 'applications':
        return <ApplicationManagement />;
      case 'transcripts':
        return <TranscriptUpload />;
      case 'jobs':
        return <JobSearch />;
      case 'profile':
        return <StudentProfile />;
      default:
        return renderDashboard();
    }
  };

  const getTabName = (tab) => {
    const tabNames = {
      dashboard: 'Dashboard',
      courses: 'Browse Courses',
      applications: 'My Applications',
      transcripts: 'Documents',
      jobs: 'Job Search',
      profile: 'My Profile'
    };
    return tabNames[tab] || 'Dashboard';
  };

  return (
    <DashboardLayout userRole="student" userName="John Doe">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Student Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>Welcome back! Manage your academic and career journey.</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          {['dashboard', 'courses', 'applications', 'transcripts', 'jobs', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab ? '600' : '400',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {getTabName(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
