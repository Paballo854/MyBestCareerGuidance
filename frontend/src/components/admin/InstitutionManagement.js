import React, { useState, useEffect } from 'react';

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    // Mock data - will connect to backend
    setInstitutions([
      {
        id: 1,
        name: 'Limkokwing University of Creative Technology',
        email: 'admin@limkokwing.ac.ls',
        type: 'Private University',
        status: 'approved',
        registrationDate: '2024-01-10',
        contactPerson: 'Dr. Thabiso Monyamane',
        contactEmail: 'admissions@limkokwing.ac.ls',
        contactPhone: '+266 2231 3781',
        address: 'Limkokwing University, Maseru, Lesotho',
        courses: 8,
        students: 1250,
        verified: true
      },
      {
        id: 2,
        name: 'National University of Lesotho',
        email: 'admin@nul.ls',
        type: 'Public University',
        status: 'approved',
        registrationDate: '2024-02-15',
        contactPerson: 'Prof. Lerato Molapo',
        contactEmail: 'admissions@nul.ls',
        contactPhone: '+266 2231 2111',
        address: 'Roma, Maseru, Lesotho',
        courses: 12,
        students: 8500,
        verified: true
      }
    ]);
  }, []);

  const filteredInstitutions = institutions.filter(inst => 
    filterStatus === '' || inst.status === filterStatus
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
          Institution Management
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Total: {institutions.length} institutions
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

      <div style={{ display: 'grid', gridTemplateColumns: selectedInstitution ? '1fr 400px' : '1fr', gap: '25px' }}>
        {/* Institutions List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Institutions ({filteredInstitutions.length})
          </h3>
          
          {filteredInstitutions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No institutions found matching your filter criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredInstitutions.map((inst) => (
                <div 
                  key={inst.id}
                  onClick={() => setSelectedInstitution(inst)}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    background: selectedInstitution?.id === inst.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {inst.name}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <strong>Type:</strong> {inst.type}
                        </div>
                        <div>
                          <strong>Contact:</strong> {inst.contactPerson}
                        </div>
                        <div>
                          <strong>Email:</strong> {inst.contactEmail}
                        </div>
                        <div>
                          <strong>Courses:</strong> {inst.courses}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getStatusColor(inst.status) + '20',
                        color: getStatusColor(inst.status)
                      }}>
                        {inst.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Institution Details Sidebar */}
        {selectedInstitution && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Institution Details
              </h3>
              <button
                onClick={() => setSelectedInstitution(null)}
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
              <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedInstitution.name}</p>
              <p style={{ marginBottom: '5px' }}><strong>Type:</strong> {selectedInstitution.type}</p>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedInstitution.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Address:</strong> {selectedInstitution.address}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Person:</strong> {selectedInstitution.contactPerson}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Email:</strong> {selectedInstitution.contactEmail}</p>
              <p style={{ marginBottom: '5px' }}><strong>Contact Phone:</strong> {selectedInstitution.contactPhone}</p>
              <p style={{ marginBottom: '5px' }}><strong>Courses:</strong> {selectedInstitution.courses}</p>
              <p><strong>Students:</strong> {selectedInstitution.students}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionManagement;
