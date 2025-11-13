import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    duration: '',
    requirements: '',
    tuitionFee: '',
    availableSeats: '',
    applicationDeadline: '',
    intake: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    description: '',
    website: ''
  });

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getInstitutions();
      if (response.success && response.institutions) {
        setInstitutions(response.institutions.map(inst => ({
          ...inst,
          registrationDate: inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : 'N/A',
          status: inst.status || 'active'
        })));
      }
    } catch (error) {
      console.error('Error loading institutions:', error);
      alert('Failed to load institutions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.addInstitution(formData);
      if (response.success) {
        alert('Institution added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', email: '', address: '', phone: '', description: '', website: '' });
        await loadInstitutions();
      } else {
        alert(response.message || 'Failed to add institution.');
      }
    } catch (error) {
      console.error('Error adding institution:', error);
      alert(error.response?.data?.message || 'Failed to add institution. Please try again.');
    }
  };

  const handleUpdateInstitution = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.updateInstitution(selectedInstitution.id, formData);
      if (response.success) {
        alert('Institution updated successfully!');
        setShowEditForm(false);
        setSelectedInstitution(null);
        setFormData({ name: '', email: '', address: '', phone: '', description: '', website: '' });
        await loadInstitutions();
      } else {
        alert(response.message || 'Failed to update institution.');
      }
    } catch (error) {
      console.error('Error updating institution:', error);
      alert(error.response?.data?.message || 'Failed to update institution. Please try again.');
    }
  };

  const handleDeleteInstitution = async (institutionId) => {
    if (!window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await adminAPI.deleteInstitution(institutionId);
      if (response.success) {
        alert('Institution deleted successfully!');
        setSelectedInstitution(null);
        await loadInstitutions();
      } else {
        alert(response.message || 'Failed to delete institution.');
      }
    } catch (error) {
      console.error('Error deleting institution:', error);
      alert(error.response?.data?.message || 'Failed to delete institution. Please try again.');
    }
  };

  const openEditForm = (institution) => {
    setSelectedInstitution(institution);
    loadFacultiesForInstitution(institution.id);
    setFormData({
      name: institution.name || '',
      email: institution.email || '',
      address: institution.address || '',
      phone: institution.phone || '',
      description: institution.description || '',
      website: institution.website || ''
    });
    setShowEditForm(true);
  };

  const loadFacultiesForInstitution = async (institutionId) => {
    try {
      const response = await adminAPI.getFaculties(institutionId);
      if (response.success) {
        setFaculties(response.faculties || []);
      } else {
        setFaculties([]);
      }
    } catch (e) {
      console.error('Failed to load faculties:', e);
      setFaculties([]);
    }
  };

  const loadCoursesForFaculty = async (facultyId) => {
    try {
      const response = await adminAPI.getCoursesByFaculty(facultyId);
      if (response.success) {
        setCourses(response.courses || []);
      } else {
        setCourses([]);
      }
    } catch (e) {
      console.error('Failed to load courses:', e);
      setCourses([]);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!selectedFacultyId) {
      alert('Please select a faculty.');
      return;
    }
    try {
      const payload = {
        name: courseForm.name,
        description: courseForm.description,
        duration: courseForm.duration,
        requirements: courseForm.requirements,
        tuitionFee: courseForm.tuitionFee,
        availableSeats: courseForm.availableSeats,
        applicationDeadline: courseForm.applicationDeadline,
        intake: courseForm.intake,
      };
      const response = await adminAPI.addCourseToFaculty(selectedFacultyId, payload);
      if (response.success) {
        alert('Course added successfully!');
        setCourseForm({
          name: '',
          description: '',
          duration: '',
          requirements: '',
          tuitionFee: '',
          availableSeats: '',
          applicationDeadline: '',
          intake: ''
        });
        setShowAddCourseForm(false);
        await loadCoursesForFaculty(selectedFacultyId);
      } else {
        alert(response.message || 'Failed to add course.');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert(error.response?.data?.message || 'Failed to add course. Please try again.');
    }
  };

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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>
            Total: {institutions.length} institutions
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(true);
              setFormData({ name: '', email: '', address: '', phone: '', description: '', website: '' });
            }}
          >
            Add Institution
          </button>
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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading institutions...
            </div>
          ) : filteredInstitutions.length === 0 ? (
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
                          <strong>Email:</strong> {inst.email || 'N/A'}
                        </div>
                        <div>
                          <strong>Phone:</strong> {inst.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>Address:</strong> {inst.address || 'N/A'}
                        </div>
                        <div>
                          <strong>Website:</strong> {inst.website || 'N/A'}
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
        {selectedInstitution && !showEditForm && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Institution Details
              </h3>
              <button
                onClick={() => {
                  setSelectedInstitution(null);
                  setShowEditForm(false);
                }}
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
              <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedInstitution.name}</p>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedInstitution.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Address:</strong> {selectedInstitution.address || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Phone:</strong> {selectedInstitution.phone || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Website:</strong> {selectedInstitution.website || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Description:</strong> {selectedInstitution.description || 'N/A'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Status:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: getStatusColor(selectedInstitution.status) + '20',
                  color: getStatusColor(selectedInstitution.status),
                  marginLeft: '8px'
                }}>
                  {selectedInstitution.status}
                </span>
              </p>
              <p><strong>Registered:</strong> {selectedInstitution.registrationDate}</p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => openEditForm(selectedInstitution)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Edit Institution
              </button>
              <button
                onClick={async () => {
                  await loadFacultiesForInstitution(selectedInstitution.id);
                  setShowAddCourseForm(true);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', background: '#10b981', color: 'white' }}
              >
                Add Course
              </button>
              <button
                onClick={() => handleDeleteInstitution(selectedInstitution.id)}
                className="btn btn-secondary"
                style={{ width: '100%', background: '#ef4444', color: 'white' }}
              >
                Delete Institution
              </button>
            </div>

            {/* Add Course Form */}
            {showAddCourseForm && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>
                  Add Course to Institution
                </h4>
                <form onSubmit={handleAddCourse}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Faculty *
                      </label>
                      <select
                        value={selectedFacultyId}
                        onChange={async (e) => {
                          setSelectedFacultyId(e.target.value);
                          if (e.target.value) {
                            await loadCoursesForFaculty(e.target.value);
                          } else {
                            setCourses([]);
                          }
                        }}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        required
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={courseForm.name}
                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        placeholder="e.g., 4 years"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={courseForm.availableSeats}
                        onChange={(e) => setCourseForm({ ...courseForm, availableSeats: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Requirements
                      </label>
                      <input
                        type="text"
                        value={courseForm.requirements}
                        onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        placeholder="General entry requirements"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Tuition Fee
                      </label>
                      <input
                        type="text"
                        value={courseForm.tuitionFee}
                        onChange={(e) => setCourseForm({ ...courseForm, tuitionFee: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        placeholder="e.g., LSL 25,000 / year"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={courseForm.applicationDeadline}
                        onChange={(e) => setCourseForm({ ...courseForm, applicationDeadline: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Intake
                      </label>
                      <input
                        type="text"
                        value={courseForm.intake}
                        onChange={(e) => setCourseForm({ ...courseForm, intake: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        placeholder="e.g., January / July"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Description
                      </label>
                      <textarea
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        rows="3"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        Add Course
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCourseForm(false)}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                {/* Existing Courses under selected faculty */}
                {selectedFacultyId && (
                  <div style={{ marginTop: '20px' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                      Existing Courses
                    </h5>
                    {courses.length === 0 ? (
                      <div style={{ color: '#6b7280' }}>No courses found for this faculty.</div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {courses.map(c => (
                          <div key={c.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 600 }}>{c.name}</div>
                                <div style={{ color: '#6b7280', fontSize: '12px' }}>{c.duration} • Seats: {c.availableSeats || 0}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  className="btn btn-secondary"
                                  style={{ background: '#ef4444', color: 'white' }}
                                  onClick={async () => {
                                    if (!window.confirm('Delete this course?')) return;
                                    try {
                                      const resp = await adminAPI.deleteCourse(c.id);
                                      if (resp.success) {
                                        await loadCoursesForFaculty(selectedFacultyId);
                                      } else {
                                        alert(resp.message || 'Failed to delete course.');
                                      }
                                    } catch (err) {
                                      alert(err.response?.data?.message || 'Failed to delete course.');
                                    }
                                  }}
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
                )}
              </div>
            )}
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && selectedInstitution && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Edit Institution
              </h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedInstitution(null);
                }}
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
            <form onSubmit={handleUpdateInstitution}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setSelectedInstitution(null);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Add Form Modal */}
        {showAddForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '500px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  Add New Institution
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', email: '', address: '', phone: '', description: '', website: '' });
                  }}
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
              <form onSubmit={handleAddInstitution}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Website</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Add Institution
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ name: '', email: '', address: '', phone: '', description: '', website: '' });
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionManagement;
