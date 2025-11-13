import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import DashboardLayout from '../common/DashboardLayout';
import CourseBrowser from './CourseBrowser';
import ApplicationManagement from './ApplicationManagement';
import TranscriptUpload from './TranscriptUpload';
import JobSearch from './JobSearch';
import StudentProfile from './StudentProfile';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    admitted: 0,
    pending: 0,
    jobsApplied: 0
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Professional Color Palette
  const colors = {
    primary: '#2563eb',
    secondary: '#7c3aed', 
    success: '#059669',
    warning: '#d97706',
    info: '#0891b2',
    neutral200: '#e2e8f0',
    neutral300: '#cbd5e1',
    neutral400: '#94a3b8',
    neutral500: '#64748b',
    neutral600: '#475569',
    neutral700: '#334155',
    neutral800: '#1e293b',
    neutral900: '#0f172a'
  };

  // DEBUG: Check what's in the user object
  useEffect(() => {
    console.log('=== AUTH USER OBJECT ===');
    console.log('Full user object:', user);
    console.log('User keys:', user ? Object.keys(user) : 'No user');
    console.log('User firstName:', user?.firstName);
    console.log('User lastName:', user?.lastName);
    console.log('User email:', user?.email);
    console.log('User role:', user?.role);
    console.log('========================');
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getDashboard();

      if (response.success && response.dashboard) {
        setDashboardData(response.dashboard);
        setStats({
          applications: response.dashboard.totalApplications || 0,
          admitted: response.dashboard.approvedApplications || 0,
          pending: response.dashboard.pendingApplications || 0,
          jobsApplied: 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        applications: 0,
        admitted: 0,
        pending: 0,
        jobsApplied: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Professional StatCard Component
  const StatCard = ({ title, value, color, subtitle }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: colors.neutral800,
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.9rem',
        fontWeight: '600',
        color: colors.neutral700,
        marginBottom: '2px'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '0.8rem',
          color: colors.neutral500,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  // Professional Feature Card
  const FeatureCard = ({ title, description, onClick, color }) => (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = color;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: colors.neutral800
      }}>
        {title}
      </h3>
      <p style={{
        color: colors.neutral600,
        fontSize: '0.9rem',
        lineHeight: '1.4',
        marginBottom: '16px'
      }}>
        {description}
      </p>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: color,
        fontWeight: '600',
        fontSize: '0.8rem',
      }}>
        Get Started
      </div>
    </div>
  );

  // Professional Footer
  const DashboardFooter = () => (
    <div style={{
      marginTop: '40px',
      background: 'white',
      borderRadius: '12px',
      padding: '32px 24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
        marginBottom: '24px',
      }}>
        <div>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            color: colors.primary
          }}>
            CareerGuide
          </h4>
          <p style={{ 
            color: colors.neutral600,
            lineHeight: '1.5',
            fontSize: '0.9rem'
          }}>
            Empowering Lesotho's future leaders through education.
          </p>
        </div>
        
        <div>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: colors.neutral800
          }}>
            Quick Links
          </h4>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
          }}>
            <button 
              onClick={() => setActiveTab('courses')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.neutral600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '4px 0',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.color = colors.primary}
              onMouseOut={(e) => e.target.style.color = colors.neutral600}
            >
              Browse Courses
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.neutral600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '4px 0',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.color = colors.primary}
              onMouseOut={(e) => e.target.style.color = colors.neutral600}
            >
              My Applications
            </button>
            <button 
              onClick={() => setActiveTab('jobs')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.neutral600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '4px 0',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.color = colors.primary}
              onMouseOut={(e) => e.target.style.color = colors.neutral600}
            >
              Job Search
            </button>
          </div>
        </div>
        
        <div>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: colors.neutral800
          }}>
            Support
          </h4>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            color: colors.neutral600,
            fontSize: '0.9rem'
          }}>
            <div>support@careerguide.ls</div>
            <div>+266 1234 5678</div>
            <div>Maseru, Lesotho</div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        borderTop: '1px solid #e2e8f0', 
        paddingTop: '16px',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '0.9rem', 
          fontWeight: '500',
          color: colors.neutral700,
          marginBottom: '4px'
        }}>
          CareerGuide Student Dashboard
        </p>
        <p style={{ 
          color: colors.neutral500,
          fontSize: '0.8rem' 
        }}>
          &copy; 2024 Career Guidance System
        </p>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (loading) {
      return (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 32px',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            color: colors.neutral800,
            marginBottom: '8px'
          }}>
            Loading Dashboard Data
          </div>
          <div style={{ 
            color: colors.neutral600,
          }}>
            Preparing your academic journey overview...
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard 
            title="Total Applications" 
            value={stats.applications} 
            color={colors.primary}
            subtitle="All time applications"
          />
          <StatCard 
            title="Admitted" 
            value={stats.admitted} 
            color={colors.success}
            subtitle="Successful applications"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            color={colors.warning}
            subtitle="Under review"
          />
          <StatCard 
            title="Jobs Applied" 
            value={stats.jobsApplied} 
            color={colors.secondary}
            subtitle="Career applications"
          />
        </div>

        {/* Feature Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <FeatureCard
            title="Browse Courses"
            description="Discover and apply to academic programs"
            onClick={() => setActiveTab('courses')}
            color={colors.primary}
          />

          <FeatureCard
            title="My Applications"
            description="Track and manage your applications"
            onClick={() => setActiveTab('applications')}
            color={colors.success}
          />

          <FeatureCard
            title="Documents"
            description="Upload academic transcripts"
            onClick={() => setActiveTab('transcripts')}
            color={colors.warning}
          />

          <FeatureCard
            title="Job Search"
            description="Find employment opportunities"
            onClick={() => setActiveTab('jobs')}
            color={colors.secondary}
          />
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <h2 style={{ 
            fontSize: '1.3rem', 
            fontWeight: 'bold', 
            color: colors.neutral800,
            marginBottom: '16px',
          }}>
            Recent Activity
          </h2>
          
          <div>
            {dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardData.recentApplications.map((app, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: colors.neutral800,
                      }}>
                        {app.courseName}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem',
                        color: colors.neutral600
                      }}>
                        {app.institutionName} • {app.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: colors.neutral600
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: colors.neutral800 }}>
                  No Recent Activity
                </div>
                <div>
                  Start by browsing courses and submitting applications!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DashboardFooter />
      </>
    );
  };

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

  // Get the actual student's name
  const getStudentName = () => {
    if (!user) return 'Student';
    const firstName = user.firstName || user.name || user.displayName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) return firstName + ' ' + lastName;
    if (firstName) return firstName;
    if (user.email) return user.email.split('@')[0];
    return 'Student';
  };

  return (
    <DashboardLayout userRole="student" userName={getStudentName()}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colors.neutral800, marginBottom: '4px' }}>
          Student Dashboard
        </h1>
        <p style={{ color: colors.neutral600 }}>
          Welcome back, {getStudentName()}! Manage your academic and career journey.
        </p>
      </div>

      <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          {['dashboard', 'courses', 'applications', 'transcripts', 'jobs', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab ? colors.primary : colors.neutral600,
                fontWeight: activeTab === tab ? '600' : '400',
                borderBottom: activeTab === tab ? '2px solid ' + colors.primary : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {getTabName(tab)}
            </button>
          ))}
        </div>
      </div>

      {renderTabContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
