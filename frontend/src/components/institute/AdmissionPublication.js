import React, { useState, useEffect } from 'react';

const AdmissionPublication = () => {
  const [admissionResults, setAdmissionResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Mock data - will connect to backend
    setAdmissionResults([
      {
        id: 1,
        studentName: 'John Doe',
        course: 'BSc in Information Technology',
        status: 'Admitted',
        decisionDate: '2025-01-20',
        studentEmail: 'john.doe@student.com',
        applicationId: 'APP001'
      },
      {
        id: 2,
        studentName: 'Jane Smith',
        course: 'Diploma in Software Engineering',
        status: 'Admitted',
        decisionDate: '2025-01-20',
        studentEmail: 'jane.smith@student.com',
        applicationId: 'APP002'
      },
      {
        id: 3,
        studentName: 'Mike Johnson',
        course: 'BSc in Information Technology',
        status: 'Rejected',
        decisionDate: '2025-01-20',
        studentEmail: 'mike.johnson@student.com',
        applicationId: 'APP003'
      },
      {
        id: 4,
        studentName: 'Sarah Wilson',
        course: 'Diploma in Business IT',
        status: 'Waitlisted',
        decisionDate: '2025-01-20',
        studentEmail: 'sarah.wilson@student.com',
        applicationId: 'APP004'
      }
    ]);

    setPublicationDate(new Date().toISOString().split('T')[0]);
  }, []);

  const courses = [...new Set(admissionResults.map(result => result.course))];
  const filteredResults = selectedCourse 
    ? admissionResults.filter(result => result.course === selectedCourse)
    : admissionResults;

  const getStatusCount = (status) => {
    return admissionResults.filter(result => result.status === status).length;
  };

  const handlePublish = () => {
    setIsPublished(true);
    alert('Admission results published successfully! Students will be notified via email.');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Admitted': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Waitlisted': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Admission Results Publication
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          {isPublished ? 'Published' : 'Draft'}
        </div>
      </div>

      {/* Publication Status */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
          Publication Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{admissionResults.length}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Decisions</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{getStatusCount('Admitted')}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Admitted</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#fef2f2', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{getStatusCount('Rejected')}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Rejected</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#fffbeb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{getStatusCount('Waitlisted')}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Waitlisted</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Publication Date:</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          <button
            onClick={handlePublish}
            className="btn btn-primary"
            disabled={isPublished}
            style={{ alignSelf: 'flex-end' }}
          >
            {isPublished ? 'Already Published' : 'Publish Results'}
          </button>
        </div>

        {isPublished && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px', 
            background: '#f0fdf4', 
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#065f46'
          }}>
            ✅ Admission results published on {publicationDate}. Students have been notified via email.
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Course:</label>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
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
        </div>
      </div>

      {/* Admission Results */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Admission Results ({filteredResults.length})
        </h3>
        
        {filteredResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No admission results found for the selected course.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Student</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Application ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Decision Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{result.studentName}</div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>{result.studentEmail}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{result.course}</td>
                    <td style={{ padding: '12px' }}>{result.applicationId}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: getStatusColor(result.status) + '20',
                        color: getStatusColor(result.status)
                      }}>
                        {result.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{result.decisionDate}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                        <button style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#fef3c7', 
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <h4 style={{ fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>Important Notes:</h4>
        <ul style={{ color: '#92400e', paddingLeft: '20px' }}>
          <li>Once published, admission results cannot be modified</li>
          <li>Students will receive email notifications automatically</li>
          <li>Admitted students have 14 days to confirm their acceptance</li>
          <li>Waitlisted students will be notified if spots become available</li>
          <li>Ensure all decisions are final before publishing</li>
        </ul>
      </div>
    </div>
  );
};

export default AdmissionPublication;
