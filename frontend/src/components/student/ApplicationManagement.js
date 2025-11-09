import React, { useState, useEffect } from 'react';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, admitted, rejected

  useEffect(() => {
    // Mock data - will connect to backend
    setApplications([
      {
        id: 1,
        institution: 'Limkokwing University',
        course: 'BSc in Information Technology',
        status: 'Admitted',
        date: '2025-01-15',
        institutionEmail: 'admissions@limkokwing.ac.ls',
        notes: 'Congratulations! You have been admitted. Please confirm your acceptance within 14 days.'
      },
      {
        id: 2,
        institution: 'National University of Lesotho',
        course: 'Computer Science',
        status: 'Pending',
        date: '2025-01-10',
        institutionEmail: 'admissions@nul.ls',
        notes: 'Application under review. Expected decision date: 2025-02-01'
      },
      {
        id: 3,
        institution: 'Botho University',
        course: 'Software Engineering',
        status: 'Under Review',
        date: '2025-01-08',
        institutionEmail: 'admissions@bothouniversity.com',
        notes: 'Application received and being processed'
      },
      {
        id: 4,
        institution: 'Limkokwing University',
        course: 'Diploma in Business IT',
        status: 'Rejected',
        date: '2024-12-20',
        institutionEmail: 'admissions@limkokwing.ac.ls',
        notes: 'Application did not meet minimum requirements'
      }
    ]);
  }, []);

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status.toLowerCase() === filter.toLowerCase()
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'admitted': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'under review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        My Applications
      </h2>

      {/* Application Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px', 
        marginBottom: '25px' 
      }}>
        <div style={{ textAlign: 'center', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{applications.length}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{getStatusCount('admitted')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Admitted</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#fffbeb', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{getStatusCount('pending') + getStatusCount('under review')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>In Progress</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#fef2f2', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{getStatusCount('rejected')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Rejected</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Status:</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        >
          <option value="all">All Applications</option>
          <option value="admitted">Admitted</option>
          <option value="pending">Pending</option>
          <option value="under review">Under Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredApplications.map((app) => (
          <div key={app.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  {app.course}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                  <strong>Institution:</strong> {app.institution}
                </p>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                  <strong>Applied:</strong> {app.date}
                </p>
                <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                  <strong>Contact:</strong> {app.institutionEmail}
                </p>
                {app.notes && (
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '12px', 
                    borderRadius: '6px',
                    borderLeft: '4px solid ' + getStatusColor(app.status)
                  }}>
                    <strong>Status Notes:</strong> {app.notes}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: getStatusColor(app.status) + '20',
                  color: getStatusColor(app.status),
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  {app.status}
                </span>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  {app.status === 'Admitted' && (
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }}>
                      Accept Offer
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ background: '#f3f4f6', color: '#374151', padding: '8px 16px' }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No applications found matching your filter criteria.
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
