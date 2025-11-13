import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getJobs();
      if (response.success && response.jobs) {
        setJobs(response.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      alert('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const companyMatch = filterCompany === '' || job.companyName === filterCompany || job.company === filterCompany;
    return titleMatch && companyMatch;
  });

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);
      // REAL API CALL to apply for job
      await studentAPI.applyForJob(jobId);
      alert('Application submitted successfully! The company will contact you if shortlisted.');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  const companies = [...new Set(jobs.map(job => job.companyName || job.company).filter(Boolean))];

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading job opportunities...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        Job Opportunities
      </h2>

      {/* Search and Filter */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Search Jobs:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title..."
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Filter by Company:</label>
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredJobs.map((job) => (
          <div key={job.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  {job.title}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <strong>Company:</strong> {job.companyName || job.company}
                  </div>
                  <div>
                    <strong>Location:</strong> {job.location}
                  </div>
                  <div>
                    <strong>Type:</strong> {job.jobType || job.type}
                  </div>
                  <div>
                    <strong>Salary:</strong> {job.salary || 'Not specified'}
                  </div>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                  <strong>Description:</strong> {job.description}
                </p>
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                  <strong>Requirements:</strong> {job.requirements}
                </p>
                <div style={{ display: 'flex', gap: '20px', color: '#6b7280', fontSize: '14px' }}>
                  <div>
                    <strong>Posted:</strong> {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : (job.postedDate || 'N/A')}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                <button
                  onClick={() => handleApply(job.id)}
                  className="btn btn-primary"
                  style={{ minWidth: '120px', marginBottom: '10px' }}
                  disabled={applying === job.id}
                >
                  {applying === job.id ? 'Applying...' : 'Apply Now'}
                </button>
                <div>
                  <button className="btn btn-secondary" style={{ background: '#f3f4f6', color: '#374151', padding: '6px 12px' }}>
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No jobs found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default JobSearch;
