import React, { useState, useEffect } from 'react';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    qualifications: '',
    courses: []
  });

  useEffect(() => {
    // Mock data - will connect to backend
    setFaculty([
      {
        id: 1,
        name: 'Dr. Thabiso Monyamane',
        email: 'thabiso.monyamane@limkokwing.ac.ls',
        phone: '+266 2231 3783',
        department: 'Information Technology',
        position: 'Head of Department',
        qualifications: 'PhD in Computer Science, MSc in Software Engineering',
        courses: ['BSc in IT', 'Software Engineering'],
        joinDate: '2015-03-15',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Prof. Lerato Molapo',
        email: 'lerato.molapo@limkokwing.ac.ls',
        phone: '+266 2231 3784',
        department: 'Computer Science',
        position: 'Professor',
        qualifications: 'PhD in Artificial Intelligence, MSc in Data Science',
        courses: ['AI Fundamentals', 'Machine Learning'],
        joinDate: '2018-08-01',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Mr. Tsepo Khotle',
        email: 'tsepo.khotle@limkokwing.ac.ls',
        phone: '+266 2231 3785',
        department: 'Information Technology',
        position: 'Lecturer',
        qualifications: 'MSc in Information Systems, BSc in IT',
        courses: ['Web Development', 'Database Systems'],
        joinDate: '2020-01-10',
        status: 'Active'
      }
    ]);
  }, []);

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email && newFaculty.department && newFaculty.position) {
      const facultyMember = {
        id: faculty.length + 1,
        ...newFaculty,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setFaculty([...faculty, facultyMember]);
      setNewFaculty({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        qualifications: '',
        courses: []
      });
      setShowAddForm(false);
      alert('Faculty member added successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleStatusChange = (facultyId, newStatus) => {
    setFaculty(prev => prev.map(member => 
      member.id === facultyId ? { ...member, status: newStatus } : member
    ));
    alert('Faculty status updated to: ' + newStatus);
  };

  const departments = ['Information Technology', 'Computer Science', 'Business IT', 'Software Engineering', 'Data Science'];
  const positions = ['Head of Department', 'Professor', 'Associate Professor', 'Lecturer', 'Assistant Lecturer', 'Visiting Faculty'];

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
            Add New Faculty Member
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Full Name *
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
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newFaculty.phone}
                  onChange={(e) => setNewFaculty({...newFaculty, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="+266 XXX XXX XXX"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Department *
                </label>
                <select
                  value={newFaculty.department}
                  onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Position *
                </label>
                <select
                  value={newFaculty.position}
                  onChange={(e) => setNewFaculty({...newFaculty, position: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                >
                  <option value="">Select Position</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Qualifications
                </label>
                <input
                  type="text"
                  value={newFaculty.qualifications}
                  onChange={(e) => setNewFaculty({...newFaculty, qualifications: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="PhD in Computer Science, MSc in IT"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Assigned Courses
              </label>
              <input
                type="text"
                value={newFaculty.courses.join(', ')}
                onChange={(e) => setNewFaculty({...newFaculty, courses: e.target.value.split(', ')})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="Course 1, Course 2, Course 3"
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
          Faculty Members ({faculty.length})
        </h3>
        
        {faculty.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No faculty members added yet.
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
                        background: member.status === 'Active' ? '#10b98120' : '#ef444420',
                        color: member.status === 'Active' ? '#10b981' : '#ef4444',
                        marginLeft: '10px'
                      }}>
                        {member.status}
                      </span>
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong>Position:</strong> {member.position}
                      </div>
                      <div>
                        <strong>Department:</strong> {member.department}
                      </div>
                      <div>
                        <strong>Email:</strong> {member.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {member.phone}
                      </div>
                    </div>
                    {member.qualifications && (
                      <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                        <strong>Qualifications:</strong> {member.qualifications}
                      </p>
                    )}
                    {member.courses.length > 0 && (
                      <div>
                        <strong>Courses:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                          {member.courses.map((course, index) => (
                            <span key={index} style={{
                              background: '#f3f4f6',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}>
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                      <strong>Joined:</strong> {member.joinDate}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <select
                      value={member.status}
                      onChange={(e) => handleStatusChange(member.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <button className="btn btn-secondary" style={{ background: '#3b82f6', color: 'white', padding: '6px 12px' }}>
                      Edit
                    </button>
                    <button className="btn btn-secondary" style={{ background: '#ef4444', color: 'white', padding: '6px 12px' }}>
                      Remove
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
