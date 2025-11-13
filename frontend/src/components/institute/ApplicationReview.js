import React, { useState, useEffect } from 'react';
import { instituteAPI } from '../../services/api';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await instituteAPI.getStudentApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications. Please try again.');
      
      // Fallback to mock data if API fails
      setApplications([
        {
          id: '1',
          studentId: 'STU001',
          student: { firstName: 'John', lastName: 'Doe', email: 'john.doe@student.com' },
          course: { name: 'BSc in Information Technology', faculty: 'ICT' },
          status: 'pending',
          appliedAt: '2025-01-15',
          courseName: 'BSc in Information Technology',
          institutionName: 'Limkokwing University'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app =>
    (filterCourse === '' || app.courseName === filterCourse) &&
    (filterStatus === '' || app.status === filterStatus)
  );

  const courses = [...new Set(applications.map(app => app.courseName))];
  const statuses = [...new Set(applications.map(app => app.status))];

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdating(applicationId);
      
      await instituteAPI.updateApplicationStatus({
        applicationId,
        status: newStatus
      });

      // Update local state
      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }

      alert('Application status updated to: ' + newStatus);
      
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'admitted': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'under review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusDisplayText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'approved': 'Admitted',
      'rejected': 'Rejected',
      'under review': 'Under Review'
    };
    return statusMap[status] || status;
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status?.toLowerCase() === status?.toLowerCase()).length;
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading applications...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Student Applications Review
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Total: {applications.length} applications
        </div>
      </div>

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
        <div style={{ textAlign: 'center', padding: '15px', background: '#fffbeb', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{getStatusCount('pending')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{getStatusCount('under review')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Under Review</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{getStatusCount('approved')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Admitted</div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', background: '#fef2f2', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{getStatusCount('rejected')}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Course:</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under review">Under Review</option>
              <option value="approved">Admitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApplication ? '1fr 400px' : '1fr', gap: '25px' }}>
        {/* Applications List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Applications ({filteredApplications.length})
          </h3>

          {filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No applications found matching your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplication(app)}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '15px',
                    background: selectedApplication?.id === app.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = selectedApplication?.id === app.id ? '#f0f9ff' : 'white'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>
                        {app.student?.firstName} {app.student?.lastName}
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                        {app.courseName || app.course?.name}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                        Applied: {new Date(app.appliedAt || app.applyDate).toLocaleDateString()}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Email: {app.student?.email}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getStatusColor(app.status) + '20',
                        color: getStatusColor(app.status),
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        {getStatusDisplayText(app.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Details Sidebar */}
        {selectedApplication && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Application Details
              </h3>
              <button
                onClick={() => setSelectedApplication(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            {/* Student Information */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Student Information
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedApplication.student?.firstName} {selectedApplication.student?.lastName}</p>
                <p style={{ marginBottom: '5px' }}><strong>Student ID:</strong> {selectedApplication.studentId}</p>
                <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedApplication.student?.email}</p>
                <p style={{ marginBottom: '5px' }}><strong>Applied:</strong> {new Date(selectedApplication.appliedAt || selectedApplication.applyDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Application Details */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Application Details
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <p style={{ marginBottom: '5px' }}><strong>Course:</strong> {selectedApplication.courseName || selectedApplication.course?.name}</p>
                <p style={{ marginBottom: '10px' }}><strong>Status:</strong>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: getStatusColor(selectedApplication.status) + '20',
                    color: getStatusColor(selectedApplication.status),
                    marginLeft: '8px'
                  }}>
                    {getStatusDisplayText(selectedApplication.status)}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                className="btn btn-primary"
                style={{ background: '#10b981' }}
                disabled={updating === selectedApplication.id}
              >
                {updating === selectedApplication.id ? 'Updating...' : 'Admit Student'}
              </button>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'under review')}
                className="btn btn-secondary"
                style={{ background: '#3b82f6', color: 'white' }}
                disabled={updating === selectedApplication.id}
              >
                {updating === selectedApplication.id ? 'Updating...' : 'Mark Under Review'}
              </button>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                className="btn btn-secondary"
                style={{ background: '#ef4444', color: 'white' }}
                disabled={updating === selectedApplication.id}
              >
                {updating === selectedApplication.id ? 'Updating...' : 'Reject Application'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationReview;
