import React, { useState, useEffect } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import CourseManagement from './CourseManagement';
import ApplicationReview from './ApplicationReview';
import InstituteProfile from './InstituteProfile';
import FacultyManagement from './FacultyManagement';
import AdmissionPublication from './AdmissionPublication';
import AnalyticsReports from './AnalyticsReports';
import { instituteAPI } from '../../services/api';

const InstituteDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    applications: 0,
    admitted: 0,
    pending: 0,
    faculty: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await instituteAPI.getDashboard();
      if (response.success && response.dashboard) {
        const dashboard = response.dashboard;
        setStats({
          courses: dashboard.totalCourses || 0,
          applications: dashboard.totalApplications || 0,
          admitted: dashboard.approvedApplications || 0,
          pending: dashboard.pendingApplications || 0,
          faculty: dashboard.totalFaculties || 0
        });
        setRecentApplications(dashboard.recentApplications || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <StatCard title="Total Courses" value={stats.courses} color="#3b82f6" />
        <StatCard title="Applications" value={stats.applications} color="#8b5cf6" />
        <StatCard title="Admitted" value={stats.admitted} color="#10b981" />
        <StatCard title="Pending Review" value={stats.pending} color="#f59e0b" />
        <StatCard title="Faculty" value={stats.faculty} color="#ef4444" />
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
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Manage Courses</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Add and manage academic programs</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('applications')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Review Applications</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Process student applications</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('faculty')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Faculty Management</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage teaching staff</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('admissions')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📢</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Publish Admissions</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Release admission results</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('analytics')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Analytics & Reports</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>View institutional analytics</p>
        </div>

        <div 
          className="card" 
          style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => setActiveTab('profile')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Institute Profile</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Update institution information</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Recent Activity
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            Loading recent activity...
          </div>
        ) : recentApplications.length > 0 ? (
          <div style={{ color: '#6b7280' }}>
            {recentApplications.map((app, index) => {
              const studentName = app.student ? `${app.student.firstName || ''} ${app.student.lastName || ''}`.trim() : 'Unknown Student';
              const courseName = app.courseName || app.course?.name || 'Unknown Course';
              const status = app.status || 'pending';
              const appliedDate = app.appliedAt ? new Date(app.appliedAt.seconds ? app.appliedAt.seconds * 1000 : app.appliedAt).toLocaleDateString() : 'Recently';
              
              return (
                <p key={index}>
                  {status === 'approved' ? 'Admitted' : status === 'rejected' ? 'Rejected' : 'Application from'} 
                  {studentName} - {courseName} ({appliedDate})
                </p>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            No recent activity
          </div>
        )}
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'courses':
        return <CourseManagement />;
      case 'applications':
        return <ApplicationReview />;
      case 'faculty':
        return <FacultyManagement />;
      case 'admissions':
        return <AdmissionPublication />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'profile':
        return <InstituteProfile />;
      default:
        return renderDashboard();
    }
  };

  const getTabName = (tab) => {
    const tabNames = {
      dashboard: 'Dashboard',
      courses: 'Course Management',
      applications: 'Application Review',
      faculty: 'Faculty Management',
      admissions: 'Admission Publication',
      analytics: 'Analytics & Reports',
      profile: 'Institute Profile'
    };
    return tabNames[tab] || 'Dashboard';
  };

  return (
    <DashboardLayout userRole="institute" userName="Limkokwing University">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Institute Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>Manage your institution's academic operations and student applications</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          {['dashboard', 'courses', 'applications', 'faculty', 'admissions', 'analytics', 'profile'].map((tab) => (
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

export default InstituteDashboard;
