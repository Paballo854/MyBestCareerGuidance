import React, { useState, useEffect } from 'react';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Mock data - will connect to backend
    setCompanies([
      {
        id: 1,
        name: 'Tech Solutions Lesotho',
        email: 'hr@techsolutions.ls',
        industry: 'Information Technology',
        status: 'approved',
        registrationDate: '2024-06-15',
        contactPerson: 'Mr. Thabo Mokoena',
        contactEmail: 'thabo.mokoena@techsolutions.ls',
        contactPhone: '+266 2834 5678',
        address: 'Maseru, Lesotho',
        website: 'www.techsolutions.ls',
        jobPostings: 12,
        verified: true
      },
      {
        id: 2,
        name: 'ABC Corporation',
        email: 'careers@abccorp.ls',
        industry: 'Manufacturing',
        status: 'pending',
        registrationDate: '2025-01-05',
        contactPerson: 'Ms. Lerato Ntai',
        contactEmail: 'lerato.ntai@abccorp.ls',
        contactPhone: '+266 2234 7890',
        address: 'Maseru, Lesotho',
        website: 'www.abccorp.ls',
        jobPostings: 0,
        verified: false
      }
    ]);
  }, []);

  const filteredCompanies = companies.filter(company => 
    filterStatus === '' || company.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      case 'rejected': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Company Management
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Total: {companies.length} companies
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCompany ? '1fr 400px' : '1fr', gap: '25px' }}>
        {/* Companies List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Companies ({filteredCompanies.length})
          </h3>
          
          {filteredCompanies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No companies found matching your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredCompanies.map((company) => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    background: selectedCompany?.id === company.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {company.name}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <strong>Industry:</strong> {company.industry}
                        </div>
                        <div>
                          <strong>Contact:</strong> {company.contactPerson}
                        </div>
                        <div>
                          <strong>Email:</strong> {company.contactEmail}
                        </div>
                        <div>
                          <strong>Job Postings:</strong> {company.jobPostings}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getStatusColor(company.status) + '20',
                        color: getStatusColor(company.status)
                      }}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Details Sidebar */}
        {selectedCompany && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Company Details
              </h3>
              <button
                onClick={() => setSelectedCompany(null)}
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

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
              <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedCompany.name}</p>
              <p style={{ marginBottom: '5px' }}><strong>Industry:</strong> {selectedCompany.industry}</p>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedCompany.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Address:</strong> {selectedCompany.address}</p>
              <p style={{ marginBottom: '5px' }}><strong>Website:</strong> {selectedCompany.website}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Person:</strong> {selectedCompany.contactPerson}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Email:</strong> {selectedCompany.contactEmail}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Phone:</strong> {selectedCompany.contactPhone}</p>
              <p><strong>Job Postings:</strong> {selectedCompany.jobPostings}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
