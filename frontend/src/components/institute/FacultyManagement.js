import React, { useState, useEffect } from 'react';
import { instituteAPI } from '../../services/api';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    description: '',
    dean: '',
    contactEmail: '',
    departments: []
  });

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      setLoading(true);
      const response = await instituteAPI.getFaculties();
      if (response.success && response.faculties) {
        setFaculty(response.faculties || []);
      }
    } catch (error) {
      console.error('Error loading faculties:', error);
      alert('Failed to load faculties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name) {
      alert('Please fill in the faculty name (required field).');
      return;
    }

    try {
      const facultyData = {
        name: newFaculty.name,
        description: newFaculty.description || '',
        dean: newFaculty.dean || '',
        contactEmail: newFaculty.contactEmail || '',
        departments: newFaculty.departments || []
      };

      const response = await instituteAPI.addFaculty(facultyData);
      if (response.success) {
        alert('Faculty added successfully!');
        setNewFaculty({
          name: '',
          description: '',
          dean: '',
          contactEmail: '',
          departments: []
        });
        setShowAddForm(false);
        loadFaculties();
      } else {
        alert(response.message || 'Failed to add faculty. Please try again.');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert(error.response?.data?.message || 'Failed to add faculty. Please try again.');
    }
  };

  const handleUpdateFaculty = async (facultyId, updateData) => {
    try {
      const response = await instituteAPI.updateFaculty({
        facultyId,
        ...updateData
      });
      if (response.success) {
        alert('Faculty updated successfully!');
        loadFaculties();
      } else {
        alert(response.message || 'Failed to update faculty. Please try again.');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert(error.response?.data?.message || 'Failed to update faculty. Please try again.');
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await instituteAPI.deleteFaculty(facultyId);
      if (response.success) {
        alert('Faculty deleted successfully!');
        loadFaculties();
      } else {
        alert(response.message || 'Failed to delete faculty. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      alert(error.response?.data?.message || 'Failed to delete faculty. Please try again.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Faculty Management
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          Add Faculty Member
        </button>
      </div>

      {/* Add Faculty Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Add New Faculty
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Faculty Name *
              </label>
              <input
                type="text"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="e.g., Faculty of Information Technology"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={newFaculty.description}
                onChange={(e) => setNewFaculty({...newFaculty, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Faculty description..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Dean
                </label>
                <input
                  type="text"
                  value={newFaculty.dean}
                  onChange={(e) => setNewFaculty({...newFaculty, dean: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="Dean's name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newFaculty.contactEmail}
                  onChange={(e) => setNewFaculty({...newFaculty, contactEmail: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="faculty@institution.ls"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Departments (comma-separated)
              </label>
              <input
                type="text"
                value={newFaculty.departments.join(', ')}
                onChange={(e) => setNewFaculty({...newFaculty, departments: e.target.value.split(',').map(d => d.trim()).filter(d => d)})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="Department 1, Department 2, Department 3"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
                style={{ background: '#f3f4f6', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFaculty}
                className="btn btn-primary"
              >
                Add Faculty Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Faculty List */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Faculties ({faculty.length})
        </h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Loading faculties...
          </div>
        ) : faculty.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No faculties added yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {faculty.map((member) => (
              <div key={member.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                      {member.name}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: member.isActive !== false ? '#10b98120' : '#ef444420',
                        color: member.isActive !== false ? '#10b981' : '#ef4444',
                        marginLeft: '10px'
                      }}>
                        {member.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </h4>
                    {member.description && (
                      <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                        {member.description}
                      </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                      {member.dean && (
                        <div>
                          <strong>Dean:</strong> {member.dean}
                        </div>
                      )}
                      {member.contactEmail && (
                        <div>
                          <strong>Contact Email:</strong> {member.contactEmail}
                        </div>
                      )}
                      <div>
                        <strong>Courses:</strong> {member.coursesCount || 0}
                      </div>
                      {member.departments && member.departments.length > 0 && (
                        <div>
                          <strong>Departments:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                            {member.departments.map((dept, index) => (
                              <span key={index} style={{
                                background: '#f3f4f6',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px'
                              }}>
                                {dept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button 
                      onClick={() => handleUpdateFaculty(member.id, { isActive: !member.isActive })}
                      className="btn btn-secondary" 
                      style={{ background: member.isActive !== false ? '#f59e0b' : '#10b981', color: 'white', padding: '6px 12px' }}
                    >
                      {member.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDeleteFaculty(member.id)}
                      className="btn btn-secondary" 
                      style={{ background: '#ef4444', color: 'white', padding: '6px 12px' }}
                    >
                      Delete
                    </button>
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

export default FacultyManagement;
