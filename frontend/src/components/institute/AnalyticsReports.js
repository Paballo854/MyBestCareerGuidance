import React, { useState, useEffect } from 'react';

const AnalyticsReports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [analytics, setAnalytics] = useState({
    applications: {
      total: 0,
      admitted: 0,
      rejected: 0,
      pending: 0
    },
    courses: [],
    trends: [],
    demographics: {
      gender: { male: 0, female: 0 },
      location: {}
    }
  });

  useEffect(() => {
    // Mock data - will connect to backend
    setAnalytics({
      applications: {
        total: 156,
        admitted: 45,
        rejected: 78,
        pending: 33
      },
      courses: [
        { name: 'BSc in IT', applications: 67, admitted: 25, conversion: 37.3 },
        { name: 'Diploma in SE', applications: 45, admitted: 12, conversion: 26.7 },
        { name: 'BSc in CS', applications: 32, admitted: 8, conversion: 25.0 },
        { name: 'Diploma in BIT', applications: 12, admitted: 0, conversion: 0 }
      ],
      trends: [
        { month: 'Jan', applications: 45, admitted: 15 },
        { month: 'Feb', applications: 38, admitted: 12 },
        { month: 'Mar', applications: 52, admitted: 18 },
        { month: 'Apr', applications: 41, admitted: 14 },
        { month: 'May', applications: 48, admitted: 16 },
        { month: 'Jun', applications: 55, admitted: 20 }
      ],
      demographics: {
        gender: { male: 85, female: 71 },
        location: { 
          'Maseru': 98, 
          'Leribe': 25, 
          'Berea': 18, 
          'Mafeteng': 15 
        }
      }
    });
  }, []);

  const calculatePercentage = (part, total) => {
    return total > 0 ? ((part / total) * 100).toFixed(1) : 0;
  };

  // Safe data access
  const genderData = analytics.demographics?.gender || { male: 0, female: 0 };
  const locationData = analytics.demographics?.location || {};
  const applicationsTotal = analytics.applications?.total || 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Analytics & Reports
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

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
            {analytics.applications?.total || 0}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Total Applications</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            {analytics.applications?.admitted || 0}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Admitted Students</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
            {analytics.applications?.rejected || 0}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Rejected Applications</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
            {analytics.applications?.pending || 0}
          </div>
          <div style={{ color: '#6b7280', fontWeight: '500' }}>Pending Review</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
        {/* Course Performance */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Course Performance
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Applications</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Admitted</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.courses || []).map((course, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>{course.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{course.applications}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{course.admitted}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: course.conversion > 30 ? '#10b98120' : course.conversion > 20 ? '#f59e0b20' : '#ef444420',
                        color: course.conversion > 30 ? '#10b981' : course.conversion > 20 ? '#f59e0b' : '#ef4444'
                      }}>
                        {course.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Trends */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Application Trends
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0' }}>
            {(analytics.trends || []).map((trend, index) => {
              const appHeight = (trend.applications / 60) * 100;
              const admitHeight = (trend.admitted / 25) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    background: '#3b82f6', 
                    width: '20px', 
                    height: appHeight + '%',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '5px'
                  }}></div>
                  <div style={{ 
                    background: '#10b981', 
                    width: '20px', 
                    height: admitHeight + '%',
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
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Applications</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Admitted</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        {/* Gender Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Gender Distribution
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="#f3f4f6" />
                <circle 
                  cx="60" cy="60" r="50" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="20"
                  strokeDasharray={(genderData.male / applicationsTotal) * 314 + ' 314'}
                  transform="rotate(-90 60 60)"
                />
                <circle 
                  cx="60" cy="60" r="50" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="20"
                  strokeDasharray={(genderData.female / applicationsTotal) * 314 + ' 314'}
                  strokeDashoffset={-((genderData.male / applicationsTotal) * 314)}
                  transform="rotate(-90 60 60)"
                />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px' }}>Male</span>
                <span style={{ fontWeight: '600' }}>
                  {genderData.male} ({calculatePercentage(genderData.male, applicationsTotal)}%)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Female</span>
                <span style={{ fontWeight: '600' }}>
                  {genderData.female} ({calculatePercentage(genderData.female, applicationsTotal)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Geographic Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(locationData).map(([location, count]) => {
              const maxCount = Math.max(...Object.values(locationData));
              const widthPercent = (count / maxCount) * 100;
              return (
                <div key={location} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{location}</span>
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
                          background: '#3b82f6',
                          width: widthPercent + '%'
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '30px' }}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
