import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCompanies();
      if (response.success && response.companies) {
        setCompanies(response.companies.map(company => ({
          ...company,
          registrationDate: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A',
          status: company.status || 'pending'
        })));
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      alert('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      const response = await adminAPI.approveCompany(companyId);
      if (response.success) {
        alert('Company approved successfully!');
        await loadCompanies();
        setSelectedCompany(null);
      } else {
        alert(response.message || 'Failed to approve company.');
      }
    } catch (error) {
      console.error('Error approving company:', error);
      alert(error.response?.data?.message || 'Failed to approve company. Please try again.');
    }
  };

  const handleSuspendCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to suspend this company?')) {
      return;
    }
    try {
      const response = await adminAPI.suspendCompany(companyId);
      if (response.success) {
        alert('Company suspended successfully!');
        await loadCompanies();
        setSelectedCompany(null);
      } else {
        alert(response.message || 'Failed to suspend company.');
      }
    } catch (error) {
      console.error('Error suspending company:', error);
      alert(error.response?.data?.message || 'Failed to suspend company. Please try again.');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await adminAPI.deleteCompany(companyId);
      if (response.success) {
        alert('Company deleted successfully!');
        setSelectedCompany(null);
        await loadCompanies();
      } else {
        alert(response.message || 'Failed to delete company.');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      alert(error.response?.data?.message || 'Failed to delete company. Please try again.');
    }
  };

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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading companies...
            </div>
          ) : filteredCompanies.length === 0 ? (
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
                          <strong>Industry:</strong> {company.industry || 'N/A'}
                        </div>
                        <div>
                          <strong>Email:</strong> {company.email || 'N/A'}
                        </div>
                        <div>
                          <strong>Address:</strong> {company.address || 'N/A'}
                        </div>
                        <div>
                          <strong>Website:</strong> {company.website || 'N/A'}
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

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
              <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedCompany.name}</p>
              <p style={{ marginBottom: '5px' }}><strong>Industry:</strong> {selectedCompany.industry || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedCompany.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Address:</strong> {selectedCompany.address || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Website:</strong> {selectedCompany.website || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Status:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: getStatusColor(selectedCompany.status) + '20',
                  color: getStatusColor(selectedCompany.status),
                  marginLeft: '8px'
                }}>
                  {selectedCompany.status}
                </span>
              </p>
              <p style={{ marginBottom: '5px' }}><strong>Registered:</strong> {selectedCompany.registrationDate}</p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedCompany.status !== 'approved' && (
                <button
                  onClick={() => handleApproveCompany(selectedCompany.id)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Approve Company
                </button>
              )}
              {selectedCompany.status !== 'suspended' && (
                <button
                  onClick={() => handleSuspendCompany(selectedCompany.id)}
                  className="btn btn-secondary"
                  style={{ width: '100%', background: '#f59e0b', color: 'white' }}
                >
                  Suspend Company
                </button>
              )}
              <button
                onClick={() => handleDeleteCompany(selectedCompany.id)}
                className="btn btn-secondary"
                style={{ width: '100%', background: '#ef4444', color: 'white' }}
              >
                Delete Company
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
