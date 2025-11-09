import React, { useState, useEffect } from 'react';

const CompanyAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalJobs: 8,
      activeJobs: 5,
      totalApplicants: 67,
      interviewRate: 24,
      hireRate: 12
    },
    applicantTrends: [
      { month: 'Jan', applicants: 8, interviews: 2, hires: 1 },
      { month: 'Feb', applicants: 12, interviews: 3, hires: 2 },
      { month: 'Mar', applicants: 15, interviews: 4, hires: 1 },
      { month: 'Apr', applicants: 10, interviews: 3, hires: 2 },
      { month: 'May', applicants: 18, interviews: 5, hires: 3 },
      { month: 'Jun', applicants: 14, interviews: 4, hires: 2 }
    ],
    jobPerformance: [
      { title: 'Software Developer', applicants: 23, interviews: 8, hires: 3 },
      { title: 'Data Analyst', applicants: 15, interviews: 5, hires: 2 },
      { title: 'IT Support', applicants: 8, interviews: 3, hires: 1 },
      { title: 'Project Manager', applicants: 12, interviews: 4, hires: 1 }
    ],
    sources: {
      'Career Platform': 45,
      'Company Website': 18,
      'LinkedIn': 22,
      'Other': 15
    }
  });

  const calculatePercentage = (part, total) => {
    return total > 0 ? ((part / total) * 100).toFixed(1) : 0;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Company Analytics
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
            {analytics.overview.totalJobs}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Jobs</div>
          <div style={{ color: '#10b981', fontSize: '14px', marginTop: '5px' }}>
            {analytics.overview.activeJobs} active
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            {analytics.overview.totalApplicants}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Applicants</div>
          <div style={{ color: '#3b82f6', fontSize: '14px', marginTop: '5px' }}>
            All time
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
            {analytics.overview.interviewRate}%
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Interview Rate</div>
          <div style={{ color: '#f59e0b', fontSize: '14px', marginTop: '5px' }}>
            Conversion
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
            {analytics.overview.hireRate}%
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Hire Rate</div>
          <div style={{ color: '#10b981', fontSize: '14px', marginTop: '5px' }}>
            Success rate
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
        {/* Applicant Trends */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Applicant Trends
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0' }}>
            {analytics.applicantTrends.map((trend, index) => {
              const maxApplicants = Math.max(...analytics.applicantTrends.map(t => t.applicants));
              const appHeight = (trend.applicants / maxApplicants) * 100;
              const intHeight = (trend.interviews / maxApplicants) * 100;
              const hireHeight = (trend.hires / maxApplicants) * 100;
              
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    width: '12px', 
                    height: appHeight + '%',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '2px'
                  }}></div>
                  <div style={{ 
                    background: '#10b981', 
                    width: '12px', 
                    height: intHeight + '%',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '2px'
                  }}></div>
                  <div style={{ 
                    background: '#8b5cf6', 
                    width: '12px', 
                    height: hireHeight + '%',
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
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Applicants</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Interviews</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '12px', height: '12px', background: '#8b5cf6', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Hires</span>
            </div>
          </div>
        </div>

        {/* Application Sources */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Application Sources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(analytics.sources).map(([source, count]) => (
              <div key={source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>{source}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    background: '#f3f4f6', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: source === 'Career Platform' ? '#3b82f6' : 
                                  source === 'Company Website' ? '#10b981' : 
                                  source === 'LinkedIn' ? '#8b5cf6' : '#f59e0b',
                        width: calculatePercentage(count, analytics.overview.totalApplicants) + '%'
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '30px' }}>
                    {count} ({calculatePercentage(count, analytics.overview.totalApplicants)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Performance */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Job Performance
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Job Title</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Applicants</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Interviews</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Hires</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.jobPerformance.map((job, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>{job.title}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{job.applicants}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{job.interviews}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{job.hires}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: job.hires > 2 ? '#10b98120' : job.hires > 0 ? '#f59e0b20' : '#ef444420',
                      color: job.hires > 2 ? '#10b981' : job.hires > 0 ? '#f59e0b' : '#ef4444'
                    }}>
                      {calculatePercentage(job.hires, job.applicants)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
