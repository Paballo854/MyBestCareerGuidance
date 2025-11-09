import React, { useState, useEffect } from 'react';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  useEffect(() => {
    // Mock data - will connect to backend
    setJobs([
      {
        id: 1,
        title: 'Junior Software Developer',
        company: 'Tech Solutions Ltd',
        location: 'Maseru, Lesotho',
        type: 'Full-time',
        salary: 'M8,000 - M12,000',
        requirements: 'BSc in IT/Computer Science, Knowledge of JavaScript, React, Node.js',
        description: 'We are looking for a passionate Junior Software Developer to design, develop and maintain software applications.',
        postedDate: '2025-01-10',
        deadline: '2025-02-15'
      },
      {
        id: 2,
        title: 'IT Support Specialist',
        company: 'Bank of Lesotho',
        location: 'Maseru, Lesotho',
        type: 'Full-time',
        salary: 'M10,000 - M15,000',
        requirements: 'Diploma in IT, Troubleshooting skills, Customer service experience',
        description: 'Provide technical support to bank staff and maintain IT infrastructure.',
        postedDate: '2025-01-12',
        deadline: '2025-02-20'
      },
      {
        id: 3,
        title: 'Data Analyst Intern',
        company: 'Lesotho Stats',
        location: 'Maseru, Lesotho',
        type: 'Internship',
        salary: 'M4,000 - M6,000',
        requirements: 'Currently pursuing degree in IT/Statistics, Excel skills, Analytical thinking',
        description: '6-month internship opportunity for data analysis and reporting.',
        postedDate: '2025-01-08',
        deadline: '2025-01-30'
      }
    ]);
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCompany === '' || job.company === filterCompany)
  );

  const handleApply = (jobId) => {
    alert('Application submitted for job ID: ' + jobId + ' - This will connect to your backend');
    // Will connect to backend job application API
  };

  const companies = [...new Set(jobs.map(job => job.company))];

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
                    <strong>Company:</strong> {job.company}
                  </div>
                  <div>
                    <strong>Location:</strong> {job.location}
                  </div>
                  <div>
                    <strong>Type:</strong> {job.type}
                  </div>
                  <div>
                    <strong>Salary:</strong> {job.salary}
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
                    <strong>Posted:</strong> {job.postedDate}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {job.deadline}
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: '20px', textAlign: 'right' }}>
                <button
                  onClick={() => handleApply(job.id)}
                  className="btn btn-primary"
                  style={{ minWidth: '120px', marginBottom: '10px' }}
                >
                  Apply Now
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
