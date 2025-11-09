import React, { useState, useEffect } from 'react';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    qualifications: '',
    experience: '',
    deadline: ''
  });

  useEffect(() => {
    // Mock data - will connect to backend
    setJobs([
      {
        id: 1,
        title: 'Software Developer',
        department: 'Technology',
        type: 'Full-time',
        location: 'Maseru, Lesotho',
        salary: 'M25,000 - M35,000',
        status: 'active',
        postedDate: '2024-12-01',
        deadline: '2025-01-31',
        applicants: 23,
        description: 'We are looking for a skilled Software Developer to join our technology team...',
        requirements: '3+ years of experience in software development',
        qualifications: 'BSc in Computer Science or related field',
        experience: '3-5 years'
      },
      {
        id: 2,
        title: 'Data Analyst',
        department: 'Analytics',
        type: 'Full-time',
        location: 'Maseru, Lesotho',
        salary: 'M20,000 - M30,000',
        status: 'active',
        postedDate: '2024-12-10',
        deadline: '2025-02-15',
        applicants: 15,
        description: 'Join our analytics team to help transform data into actionable insights...',
        requirements: 'Strong analytical skills and proficiency in SQL',
        qualifications: 'Degree in Statistics, Mathematics, or related field',
        experience: '2-4 years'
      },
      {
        id: 3,
        title: 'IT Support Specialist',
        department: 'Technology',
        type: 'Part-time',
        location: 'Maseru, Lesotho',
        salary: 'M15,000 - M20,000',
        status: 'closed',
        postedDate: '2024-11-15',
        deadline: '2024-12-31',
        applicants: 8,
        description: 'Provide technical support and maintain our IT infrastructure...',
        requirements: 'Knowledge of computer systems and networking',
        qualifications: 'Diploma in IT or related field',
        experience: '1-3 years'
      }
    ]);
  }, []);

  const handleCreateJob = (e) => {
    e.preventDefault();
    const job = {
      id: jobs.length + 1,
      ...newJob,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0
    };
    setJobs([...jobs, job]);
    setShowJobForm(false);
    setNewJob({
      title: '',
      department: '',
      type: 'Full-time',
      location: '',
      salary: '',
      description: '',
      requirements: '',
      qualifications: '',
      experience: '',
      deadline: ''
    });
    alert('Job posted successfully!');
  };

  const handleInputChange = (e) => {
    setNewJob({
      ...newJob,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'closed': return '#ef4444';
      case 'draft': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getApplicantsColor = (count) => {
    if (count > 20) return '#10b981';
    if (count > 10) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Job Management
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowJobForm(true)}
        >
          Post New Job
        </button>
      </div>

      {/* Job Creation Form */}
      {showJobForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              Post New Job
            </h3>
            <button
              onClick={() => setShowJobForm(false)}
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

          <form onSubmit={handleCreateJob}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Software Developer"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Department *</label>
                <input
                  type="text"
                  name="department"
                  value={newJob.department}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Job Type *</label>
                <select
                  name="type"
                  value={newJob.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Maseru, Lesotho"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., M25,000 - M35,000"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Application Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  value={newJob.deadline}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Job Description *</label>
              <textarea
                name="description"
                value={newJob.description}
                onChange={handleInputChange}
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  resize: 'vertical'
                }}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Requirements *</label>
              <textarea
                name="requirements"
                value={newJob.requirements}
                onChange={handleInputChange}
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  resize: 'vertical'
                }}
                placeholder="List the key requirements and skills needed..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Qualifications</label>
                <input
                  type="text"
                  name="qualifications"
                  value={newJob.qualifications}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., BSc in Computer Science"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  value={newJob.experience}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., 3-5 years"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowJobForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Active Job Postings ({jobs.filter(job => job.status === 'active').length})
        </h3>
        
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No job postings yet. Create your first job posting to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {jobs.map((job) => (
              <div 
                key={job.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                onClick={() => setSelectedJob(job)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                      {job.title}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong>Department:</strong> {job.department}
                      </div>
                      <div>
                        <strong>Type:</strong> {job.type}
                      </div>
                      <div>
                        <strong>Location:</strong> {job.location}
                      </div>
                      <div>
                        <strong>Salary:</strong> {job.salary}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ 
                        background: '#f3f4f6', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px'
                      }}>
                        Posted: {job.postedDate}
                      </span>
                      <span style={{ 
                        background: '#f3f4f6', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px'
                      }}>
                        Deadline: {job.deadline}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: getStatusColor(job.status) + '20',
                      color: getStatusColor(job.status),
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}>
                      {job.status}
                    </span>
                    <div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getApplicantsColor(job.applicants) + '20',
                        color: getApplicantsColor(job.applicants)
                      }}>
                        {job.applicants} Applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManagement;
