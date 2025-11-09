import React, { useState } from 'react';
import JobManagement from './JobManagement';
import ApplicantManagement from './ApplicantManagement';
import CompanyProfile from './CompanyProfile';
import CompanyAnalytics from './CompanyAnalytics';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock company data
  const companyStats = {
    totalJobs: 8,
    activeJobs: 5,
    totalApplicants: 67,
    newApplicants: 12,
    interviewsScheduled: 8,
    hired: 3
  };

  const recentActivities = [
    { action: 'New application received', job: 'Software Developer', applicant: 'John Doe', time: '2 hours ago' },
    { action: 'Job posting published', job: 'Data Analyst', time: '1 day ago' },
    { action: 'Interview scheduled', job: 'Frontend Developer', applicant: 'Jane Smith', time: '2 days ago' },
    { action: 'Candidate hired', job: 'IT Support', applicant: 'Mike Johnson', time: '1 week ago' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
              Company Dashboard
            </h2>

            {/* Statistics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              marginBottom: '30px' 
            }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                  {companyStats.totalJobs}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Jobs</div>
                <div style={{ color: '#10b981', fontSize: '14px', marginTop: '5px' }}>
                  {companyStats.activeJobs} active
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                  {companyStats.totalApplicants}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Applicants</div>
                <div style={{ color: '#f59e0b', fontSize: '14px', marginTop: '5px' }}>
                  {companyStats.newApplicants} new
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                  {companyStats.interviewsScheduled}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Interviews</div>
                <div style={{ color: '#3b82f6', fontSize: '14px', marginTop: '5px' }}>
                  Scheduled
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                  {companyStats.hired}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>Hired</div>
                <div style={{ color: '#10b981', fontSize: '14px', marginTop: '5px' }}>
                  Successful hires
                </div>
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
                  onClick={() => setActiveTab('jobs')}
                >
                  Post New Job
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('applicants')}
                >
                  View Applicants
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('analytics')}
                >
                  View Analytics
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('profile')}
                >
                  Update Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentActivities.map((activity, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px', 
                    background: '#f8fafc', 
                    borderRadius: '6px' 
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#10b981',
                      marginRight: '12px' 
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{activity.action}</div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        {activity.job ? 'Job: ' + activity.job : ''} 
                        {activity.applicant ? ' • Applicant: ' + activity.applicant : ''}
                      </div>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'jobs':
        return <JobManagement />;
      case 'applicants':
        return <ApplicantManagement />;
      case 'analytics':
        return <CompanyAnalytics />;
      case 'profile':
        return <CompanyProfile />;
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
          Company Portal
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#6b7280' }}>Welcome, Tech Solutions Ltd</span>
          <button className="btn btn-secondary" style={{ background: '#ef4444', color: 'white' }}>
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
          { key: 'jobs', label: 'Job Management' },
          { key: 'applicants', label: 'Applicant Management' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'profile', label: 'Company Profile' }
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

export default CompanyDashboard;
