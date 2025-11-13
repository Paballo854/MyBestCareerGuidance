import React, { useState, useEffect } from 'react';
import { instituteAPI } from '../../services/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    name: '',
    duration: '',
    requirements: '',
    availableSeats: '',
    description: '',
    facultyId: '',
    field: '',
    qualification: '',
    fees: '',
    requiredSubjects: '',
    minimumGrade: '',
    additionalRequirements: ''
  });
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    loadCourses();
    loadFaculties();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await instituteAPI.getCourses();
      if (response.success && response.courses) {
        setCourses(response.courses || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFaculties = async () => {
    try {
      const response = await instituteAPI.getFaculties();
      if (response.success && response.faculties) {
        setFaculties(response.faculties || []);
      }
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.duration || !newCourse.requirements || !newCourse.availableSeats || !newCourse.facultyId || !newCourse.field) {
      alert('Please fill in all required fields (Name, Duration, Requirements, Available Seats, Faculty, Field).');
      return;
    }

    try {
      // Process required subjects (convert comma-separated string to array)
      const requiredSubjects = newCourse.requiredSubjects
        ? newCourse.requiredSubjects.split(',').map(s => s.trim().toUpperCase()).filter(s => s)
        : [];

      // Process additional requirements (convert comma-separated string to array)
      const additionalRequirements = newCourse.additionalRequirements
        ? newCourse.additionalRequirements.split(',').map(r => r.trim()).filter(r => r)
        : [];

      // Process minimum grade (convert to number if provided)
      const minimumGrade = newCourse.minimumGrade ? parseFloat(newCourse.minimumGrade) : null;

      const courseData = {
        name: newCourse.name,
        description: newCourse.description || '',
        facultyId: newCourse.facultyId,
        field: newCourse.field,
        qualification: newCourse.qualification || 'Certificate',
        requirements: newCourse.requirements,
        duration: newCourse.duration,
        fees: newCourse.fees || 'Contact for details',
        availableSeats: parseInt(newCourse.availableSeats) || 50,
        requiredSubjects: requiredSubjects.length > 0 ? requiredSubjects : undefined,
        minimumGrade: minimumGrade || undefined,
        additionalRequirements: additionalRequirements.length > 0 ? additionalRequirements : undefined
      };

      const response = await instituteAPI.addCourse(courseData);
      if (response.success) {
        alert('Course added successfully!');
        setNewCourse({
          name: '',
          duration: '',
          requirements: '',
          availableSeats: '',
          description: '',
          facultyId: '',
          field: '',
          qualification: '',
          fees: '',
          requiredSubjects: '',
          minimumGrade: '',
          additionalRequirements: ''
        });
        setShowAddForm(false);
        loadCourses();
      } else {
        alert(response.message || 'Failed to add course. Please try again.');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert(error.response?.data?.message || 'Failed to add course. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await instituteAPI.deleteCourse(courseId);
      if (response.success) {
        alert('Course deleted successfully!');
        loadCourses();
      } else {
        alert(response.message || 'Failed to delete course. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Failed to delete course. Please try again.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Course Management
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          Add New Course
        </button>
      </div>

      {/* Add Course Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Add New Course
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Course Name *
              </label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="e.g., BSc in Information Technology"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Faculty *
                </label>
                <select
                  value={newCourse.facultyId}
                  onChange={(e) => setNewCourse({...newCourse, facultyId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                >
                  <option value="">Select Faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Field *
                </label>
                <input
                  type="text"
                  value={newCourse.field}
                  onChange={(e) => setNewCourse({...newCourse, field: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Information Technology"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Duration *
                </label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., 4 years"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Available Seats *
                </label>
                <input
                  type="number"
                  value={newCourse.availableSeats}
                  onChange={(e) => setNewCourse({...newCourse, availableSeats: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., 50"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Qualification
                </label>
                <input
                  type="text"
                  value={newCourse.qualification}
                  onChange={(e) => setNewCourse({...newCourse, qualification: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Certificate, Diploma, Degree"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Fees
                </label>
                <input
                  type="text"
                  value={newCourse.fees}
                  onChange={(e) => setNewCourse({...newCourse, fees: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., Contact for details"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                General Requirements *
              </label>
              <input
                type="text"
                value={newCourse.requirements}
                onChange={(e) => setNewCourse({...newCourse, requirements: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="e.g., High School Diploma"
              />
            </div>
            
            {/* Subject Symbols / Required Subjects */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Required Subject Symbols (comma-separated)
              </label>
              <input
                type="text"
                value={newCourse.requiredSubjects}
                onChange={(e) => setNewCourse({...newCourse, requiredSubjects: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="e.g., MATH, PHYSICS, CHEMISTRY, ENGLISH"
              />
              <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Enter subject symbols separated by commas (e.g., MATH, PHYSICS, CHEMISTRY)
              </small>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Minimum Grade (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newCourse.minimumGrade}
                  onChange={(e) => setNewCourse({...newCourse, minimumGrade: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., 60"
                />
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Minimum grade percentage required (0-100)
                </small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Additional Requirements (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCourse.additionalRequirements}
                  onChange={(e) => setNewCourse({...newCourse, additionalRequirements: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  placeholder="e.g., IELTS, TOEFL, Portfolio"
                />
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Certificates or other requirements
                </small>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Course description and details..."
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
                onClick={handleAddCourse}
                className="btn btn-primary"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Your Courses ({courses.length})
        </h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No courses added yet. Click "Add New Course" to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {courses.map(course => (
              <div key={course.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                      {course.name}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong>Faculty:</strong> {course.facultyName || 'N/A'}
                      </div>
                      <div>
                        <strong>Field:</strong> {course.field || 'N/A'}
                      </div>
                      <div>
                        <strong>Duration:</strong> {course.duration || 'N/A'}
                      </div>
                      <div>
                        <strong>Requirements:</strong> {course.requirements || 'N/A'}
                      </div>
                      <div>
                        <strong>Available Seats:</strong> {course.availableSeats || 0}
                      </div>
                      <div>
                        <strong>Qualification:</strong> {course.qualification || 'N/A'}
                      </div>
                    </div>
                    {course.requiredSubjects && course.requiredSubjects.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Required Subjects:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                          {course.requiredSubjects.map((subject, idx) => (
                            <span key={idx} style={{
                              background: '#3b82f6',
                              color: 'white',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {course.minimumGrade && (
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Minimum Grade:</strong> {course.minimumGrade}%
                      </div>
                    )}
                    {course.additionalRequirements && course.additionalRequirements.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Additional Requirements:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                          {course.additionalRequirements.map((req, idx) => (
                            <span key={idx} style={{
                              background: '#10b981',
                              color: 'white',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {course.description && (
                      <p style={{ color: '#6b7280', marginBottom: '10px' }}>
                        <strong>Description:</strong> {course.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ background: '#3b82f6', color: 'white', padding: '8px 16px' }}
                    >
                      View Applications
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="btn btn-secondary"
                      style={{ background: '#ef4444', color: 'white', padding: '8px 16px' }}
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

export default CourseManagement;
