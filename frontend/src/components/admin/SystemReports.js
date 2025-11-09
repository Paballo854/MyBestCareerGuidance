import React, { useState, useEffect } from 'react';

const SystemReports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const [reports, setReports] = useState({
    overview: {
      totalUsers: 1250,
      activeUsers: 980,
      newRegistrations: 45,
      totalApplications: 1567,
      pendingApplications: 234,
      approvedApplications: 890,
      jobPostings: 67,
      activeCompanies: 38
    },
    trends: [
      { month: 'Jan', registrations: 120, applications: 245, jobPostings: 12 },
      { month: 'Feb', registrations: 145, applications: 278, jobPostings: 15 },
      { month: 'Mar', registrations: 165, applications: 312, jobPostings: 18 },
      { month: 'Apr', registrations: 132, applications: 298, jobPostings: 14 },
      { month: 'May', registrations: 178, applications: 345, jobPostings: 22 },
      { month: 'Jun', registrations: 195, applications: 389, jobPostings: 25 }
    ]
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          System Reports & Analytics
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px' 
            }}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px' 
            }}
          >
            <option value="overview">Overview</option>
            <option value="users">User Analytics</option>
            <option value="applications">Application Reports</option>
            <option value="performance">System Performance</option>
          </select>
          <button className="btn btn-primary">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
            {reports.overview.totalUsers}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            {reports.overview.totalApplications}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Applications</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
            {reports.overview.jobPostings}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Job Postings</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
            {reports.overview.newRegistrations}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>New Registrations</div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Growth Trends
        </h3>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px 0' }}>
          {reports.trends.map((trend, index) => {
            const maxReg = Math.max(...reports.trends.map(t => t.registrations));
            const maxApp = Math.max(...reports.trends.map(t => t.applications));
            const regHeight = (trend.registrations / maxReg) * 100;
            const appHeight = (trend.applications / maxApp) * 100;
            
            return (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  background: '#3b82f6', 
                  width: '15px', 
                  height: regHeight + '%',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '5px'
                }}></div>
                <div style={{ 
                  background: '#10b981', 
                  width: '15px', 
                  height: appHeight + '%',
                  borderRadius: '4px 4px 0 0'
                }}></div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  {trend.month}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Registrations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Applications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
