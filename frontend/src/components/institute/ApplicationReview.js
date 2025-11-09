import React, { useState, useEffect } from 'react';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Mock data - will connect to backend
    setApplications([
      {
        id: 1,
        studentId: 'STU001',
        studentName: 'John Doe',
        course: 'BSc in Information Technology',
        applyDate: '2025-01-15',
        status: 'Pending',
        email: 'john.doe@student.com',
        phone: '+266 1234 5678',
        highSchool: 'Maseru High School',
        graduationYear: '2020',
        transcripts: ['transcript_math.pdf', 'transcript_science.pdf'],
        notes: 'Excellent academic record with strong mathematics background.',
        qualifications: {
          mathematics: 'A',
          english: 'B',
          science: 'A',
          computer: 'A'
        }
      },
      {
        id: 2,
        studentId: 'STU002',
        studentName: 'Jane Smith',
        course: 'Diploma in Software Engineering',
        applyDate: '2025-01-14',
        status: 'Under Review',
        email: 'jane.smith@student.com',
        phone: '+266 2345 6789',
        highSchool: 'Lesotho High School',
        graduationYear: '2019',
        transcripts: ['transcript_jane.pdf'],
        notes: 'Strong programming skills demonstrated in portfolio.',
        qualifications: {
          mathematics: 'B',
          english: 'A',
          science: 'B',
          computer: 'A'
        }
      },
      {
        id: 3,
        studentId: 'STU003',
        studentName: 'Mike Johnson',
        course: 'BSc in Information Technology',
        applyDate: '2025-01-10',
        status: 'Admitted',
        email: 'mike.johnson@student.com',
        phone: '+266 3456 7890',
        highSchool: 'Botho High School',
        graduationYear: '2021',
        transcripts: ['transcript_mike.pdf'],
        notes: 'Admitted based on excellent interview performance.',
        qualifications: {
          mathematics: 'A',
          english: 'B',
          science: 'A',
          computer: 'A'
        }
      },
      {
        id: 4,
        studentId: 'STU004',
        studentName: 'Sarah Wilson',
        course: 'Diploma in Business IT',
        applyDate: '2025-01-08',
        status: 'Rejected',
        email: 'sarah.wilson@student.com',
        phone: '+266 4567 8901',
        highSchool: 'Mazenod High School',
        graduationYear: '2020',
        transcripts: ['transcript_sarah.pdf'],
        notes: 'Did not meet minimum mathematics requirement.',
        qualifications: {
          mathematics: 'C',
          english: 'A',
          science: 'B',
          computer: 'B'
        }
      }
    ]);
  }, []);

  const filteredApplications = applications.filter(app => 
    (filterCourse === '' || app.course === filterCourse) &&
    (filterStatus === '' || app.status === filterStatus)
  );

  const courses = [...new Set(applications.map(app => app.course))];
  const statuses = [...new Set(applications.map(app => app.status))];

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication(prev => ({ ...prev, status: newStatus }));
    }
    
    alert('Application status updated to: ' + newStatus);
  };

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
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{getStatusCount('admitted')}</div>
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
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
                        {app.studentName}
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                        {app.course}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                        Applied: {app.applyDate}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {Object.entries(app.qualifications).map(([subject, grade]) => (
                          <span key={subject} style={{ 
                            background: '#f3f4f6', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            textTransform: 'capitalize'
                          }}>
                            {subject}: {grade}
                          </span>
                        ))}
                      </div>
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
                        {app.status}
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
                <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedApplication.studentName}</p>
                <p style={{ marginBottom: '5px' }}><strong>Student ID:</strong> {selectedApplication.studentId}</p>
                <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedApplication.email}</p>
                <p style={{ marginBottom: '5px' }}><strong>Phone:</strong> {selectedApplication.phone}</p>
                <p style={{ marginBottom: '5px' }}><strong>High School:</strong> {selectedApplication.highSchool}</p>
                <p><strong>Graduation Year:</strong> {selectedApplication.graduationYear}</p>
              </div>
            </div>

            {/* Application Details */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Application Details
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <p style={{ marginBottom: '5px' }}><strong>Course:</strong> {selectedApplication.course}</p>
                <p style={{ marginBottom: '5px' }}><strong>Applied:</strong> {selectedApplication.applyDate}</p>
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
                    {selectedApplication.status}
                  </span>
                </p>
                
                {/* Qualifications */}
                <div style={{ marginBottom: '10px' }}>
                  <strong>Qualifications:</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '5px' }}>
                    {Object.entries(selectedApplication.qualifications).map(([subject, grade]) => (
                      <div key={subject} style={{ 
                        background: 'white', 
                        padding: '5px 10px', 
                        borderRadius: '6px',
                        textTransform: 'capitalize',
                        fontSize: '14px'
                      }}>
                        {subject}: <strong>{grade}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Documents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedApplication.transcripts.map((doc, index) => (
                  <button
                    key={index}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    📄 {doc}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedApplication.notes && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                  Notes
                </h4>
                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
                  {selectedApplication.notes}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'Admitted')}
                className="btn btn-primary"
                style={{ background: '#10b981' }}
              >
                Admit Student
              </button>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'Under Review')}
                className="btn btn-secondary"
                style={{ background: '#3b82f6', color: 'white' }}
              >
                Mark Under Review
              </button>
              <button
                onClick={() => handleStatusChange(selectedApplication.id, 'Rejected')}
                className="btn btn-secondary"
                style={{ background: '#ef4444', color: 'white' }}
              >
                Reject Application
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
