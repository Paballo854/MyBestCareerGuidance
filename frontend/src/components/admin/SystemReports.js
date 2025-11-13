import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const SystemReports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [reports, setReports] = useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      newRegistrations: 0,
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      jobPostings: 0,
      activeCompanies: 0
    },
    trends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [timeRange, reportType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports();
      if (response.success && response.reports) {
        const reportData = response.reports;
        setReports({
          overview: {
            totalUsers: reportData.totalUsers || 0,
            activeUsers: reportData.totalUsers || 0,
            newRegistrations: 0, // Would need additional calculation
            totalApplications: reportData.totalApplications || 0,
            pendingApplications: reportData.applicationsByStatus?.pending || 0,
            approvedApplications: reportData.applicationsByStatus?.approved || 0,
            jobPostings: 0, // Would need additional data
            activeCompanies: reportData.totalCompanies || 0
          },
          trends: [] // Would need time-based data
        });
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      alert('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading reports...</div>
        </div>
      ) : (
        <>
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
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Pending: {reports.overview.pendingApplications} | Approved: {reports.overview.approvedApplications}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                {reports.overview.activeCompanies}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>Active Companies</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                {reports.overview.pendingApplications}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>Pending Applications</div>
            </div>
          </div>
        </>
      )}

      {/* Additional Statistics */}
      {!loading && (
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            System Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' }}>
                {reports.overview.totalUsers}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Users</div>
            </div>
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>
                {reports.overview.totalApplications}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Applications</div>
            </div>
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
                {reports.overview.activeCompanies}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Active Companies</div>
            </div>
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                {reports.overview.pendingApplications}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending Applications</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemReports;
