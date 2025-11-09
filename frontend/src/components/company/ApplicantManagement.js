import React, { useState, useEffect } from 'react';

const ApplicantManagement = () => {
  const [applicants, setApplicants] = useState([]);
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    // Mock data - will connect to backend
    setApplicants([
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@student.limkokwing.ac.ls',
        phone: '+266 1234 5678',
        jobTitle: 'Software Developer',
        appliedDate: '2024-12-15',
        status: 'under_review',
        qualifications: {
          degree: 'BSc in Information Technology',
          institution: 'Limkokwing University',
          graduationYear: '2024',
          gpa: '3.8'
        },
        experience: [
          {
            position: 'Junior Developer',
            company: 'Tech Solutions',
            duration: '1 year',
            description: 'Worked on web applications using React and Node.js'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        certificates: ['AWS Certified Developer', 'React Professional Certificate'],
        transcript: 'transcript_john_doe.pdf',
        resume: 'resume_john_doe.pdf'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@student.nul.ls',
        phone: '+266 2345 6789',
        jobTitle: 'Data Analyst',
        appliedDate: '2024-12-18',
        status: 'interview',
        qualifications: {
          degree: 'BSc in Statistics',
          institution: 'National University of Lesotho',
          graduationYear: '2023',
          gpa: '3.9'
        },
        experience: [
          {
            position: 'Data Intern',
            company: 'Analytics Pro',
            duration: '6 months',
            description: 'Assisted in data analysis and reporting'
          }
        ],
        skills: ['Python', 'SQL', 'R', 'Excel', 'Tableau'],
        certificates: ['Google Data Analytics Certificate'],
        transcript: 'transcript_jane_smith.pdf',
        resume: 'resume_jane_smith.pdf'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@student.botho.com',
        phone: '+266 3456 7890',
        jobTitle: 'IT Support Specialist',
        appliedDate: '2024-12-10',
        status: 'rejected',
        qualifications: {
          degree: 'Diploma in IT',
          institution: 'Botho University',
          graduationYear: '2023',
          gpa: '3.5'
        },
        experience: [
          {
            position: 'IT Assistant',
            company: 'Local School',
            duration: '1 year',
            description: 'Provided technical support and maintained computer systems'
          }
        ],
        skills: ['Windows OS', 'Networking', 'Hardware', 'Troubleshooting'],
        certificates: ['CompTIA A+', 'Microsoft Certified Professional'],
        transcript: 'transcript_mike_johnson.pdf',
        resume: 'resume_mike_johnson.pdf'
      }
    ]);
  }, []);

  const filteredApplicants = applicants.filter(applicant => 
    (filterJob === '' || applicant.jobTitle === filterJob) &&
    (filterStatus === '' || applicant.status === filterStatus)
  );

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    ));
    
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
    }
    
    alert('Applicant status updated to: ' + newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'under_review': return '#f59e0b';
      case 'interview': return '#3b82f6';
      case 'shortlisted': return '#8b5cf6';
      case 'rejected': return '#ef4444';
      case 'hired': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'under_review': return 'Under Review';
      case 'interview': return 'Interview';
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      case 'hired': return 'Hired';
      default: return status;
    }
  };

  const getJobs = () => {
    return [...new Set(applicants.map(applicant => applicant.jobTitle))];
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Applicant Management
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Total: {applicants.length} applicants
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Job:</label>
            <select 
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px' 
              }}
            >
              <option value="">All Jobs</option>
              {getJobs().map(job => (
                <option key={job} value={job}>{job}</option>
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
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApplicant ? '1fr 400px' : '1fr', gap: '25px' }}>
        {/* Applicants List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Applicants ({filteredApplicants.length})
          </h3>
          
          {filteredApplicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No applicants found matching your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredApplicants.map((applicant) => (
                <div 
                  key={applicant.id}
                  onClick={() => setSelectedApplicant(applicant)}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    background: selectedApplicant?.id === applicant.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {applicant.name}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <strong>Job:</strong> {applicant.jobTitle}
                        </div>
                        <div>
                          <strong>Email:</strong> {applicant.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {applicant.phone}
                        </div>
                        <div>
                          <strong>Applied:</strong> {applicant.appliedDate}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span style={{ 
                          background: '#f3f4f6', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px'
                        }}>
                          {applicant.qualifications.degree}
                        </span>
                        <span style={{ 
                          background: '#f3f4f6', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px'
                        }}>
                          GPA: {applicant.qualifications.gpa}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getStatusColor(applicant.status) + '20',
                        color: getStatusColor(applicant.status),
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        {getStatusText(applicant.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applicant Details Sidebar */}
        {selectedApplicant && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Applicant Details
              </h3>
              <button
                onClick={() => setSelectedApplicant(null)}
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

            {/* Personal Information */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Personal Information
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedApplicant.name}</p>
                <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedApplicant.email}</p>
                <p style={{ marginBottom: '5px' }}><strong>Phone:</strong> {selectedApplicant.phone}</p>
                <p style={{ marginBottom: '5px' }}><strong>Applied For:</strong> {selectedApplicant.jobTitle}</p>
                <p><strong>Applied Date:</strong> {selectedApplicant.appliedDate}</p>
              </div>
            </div>

            {/* Qualifications */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Qualifications
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <p style={{ marginBottom: '5px' }}><strong>Degree:</strong> {selectedApplicant.qualifications.degree}</p>
                <p style={{ marginBottom: '5px' }}><strong>Institution:</strong> {selectedApplicant.qualifications.institution}</p>
                <p style={{ marginBottom: '5px' }}><strong>Graduation Year:</strong> {selectedApplicant.qualifications.graduationYear}</p>
                <p><strong>GPA:</strong> {selectedApplicant.qualifications.gpa}</p>
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Skills & Certificates
              </h4>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Skills:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {selectedApplicant.skills.map((skill, index) => (
                      <span key={index} style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Certificates:</strong>
                  <div style={{ marginTop: '5px' }}>
                    {selectedApplicant.certificates.map((cert, index) => (
                      <div key={index} style={{ fontSize: '14px', color: '#6b7280' }}>
                        • {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Application Status
              </h4>
              <select
                value={selectedApplicant.status}
                onChange={(e) => handleStatusChange(selectedApplicant.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Documents */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Documents
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  View Resume
                </button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>
                  View Transcript
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-primary">
                Schedule Interview
              </button>
              <button className="btn btn-secondary" style={{ background: '#10b981', color: 'white' }}>
                Send Offer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantManagement;
