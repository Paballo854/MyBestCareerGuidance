import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, admitted, rejected

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Load current applications
      const appsResponse = await studentAPI.getMyApplications();
      if (appsResponse.success && appsResponse.applications) {
        setApplications(appsResponse.applications);
      } else {
        setApplications([]);
      }
      
      // Load admission results
      const admissionsResponse = await studentAPI.getAdmissionResults();
      if (admissionsResponse.success && admissionsResponse.admissions) {
        setAdmissions(admissionsResponse.admissions);
      } else {
        setAdmissions([]);
      }
      
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications. Please try again.');
      setApplications([]);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine applications and admissions for display
  const allApplications = [...applications, ...admissions];

  const filteredApplications = allApplications.filter(app =>
    filter === 'all' || app.status.toLowerCase() === filter.toLowerCase()
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'admitted': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'under review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusCount = (status) => {
    return allApplications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  const handleAcceptOffer = async (applicationId) => {
    try {
      const response = await studentAPI.selectAdmission(applicationId);
      if (response.success) {
        alert(response.message || 'Admission offer accepted successfully!');
        // Reload applications to show updated status
        await loadApplications();
      } else {
        alert(response.message || 'Failed to accept offer. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert(error.response?.data?.message || 'Failed to accept offer. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading applications...</div>
      </div>
    );
  }

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
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{allApplications.length}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{getStatusCount('approved') + getStatusCount('admitted')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Approved</div>
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
          <option value="approved">Approved</option>
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
                  {app.courseName || app.course}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                  <strong>Institution:</strong> {app.institutionName || app.institution}
                </p>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                  <strong>Applied:</strong> {app.appliedAt ? (app.appliedAt.toDate ? app.appliedAt.toDate().toLocaleDateString() : new Date(app.appliedAt).toLocaleDateString()) : (app.date ? new Date(app.date).toLocaleDateString() : 'N/A')}
                </p>
                <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                  <strong>Application ID:</strong> {app.id}
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
                  {(app.status === 'approved' || app.status === 'admitted') && (
                    <button 
                      onClick={() => handleAcceptOffer(app.id)}
                      className="btn btn-primary" 
                      style={{ padding: '8px 16px' }}
                    >
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
