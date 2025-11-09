import React, { useState, useEffect } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    duration: '',
    requirements: '',
    availableSeats: '',
    description: ''
  });

  useEffect(() => {
    // Mock data - will connect to backend
    setCourses([
      {
        id: 1,
        name: 'BSc in Information Technology',
        duration: '4 years',
        requirements: 'High School Diploma',
        availableSeats: 50,
        description: 'Comprehensive IT degree covering programming, networking, and systems analysis.',
        applications: 15
      },
      {
        id: 2,
        name: 'Diploma in Software Engineering',
        duration: '2 years',
        requirements: 'High School Certificate',
        availableSeats: 30,
        description: 'Focused on software development methodologies and programming skills.',
        applications: 8
      }
    ]);
  }, []);

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.duration && newCourse.requirements && newCourse.availableSeats) {
      const course = {
        id: courses.length + 1,
        ...newCourse,
        applications: 0
      };
      setCourses([...courses, course]);
      setNewCourse({
        name: '',
        duration: '',
        requirements: '',
        availableSeats: '',
        description: ''
      });
      setShowAddForm(false);
      alert('Course added successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
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
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Requirements *
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
        
        {courses.length === 0 ? (
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
                        <strong>Duration:</strong> {course.duration}
                      </div>
                      <div>
                        <strong>Requirements:</strong> {course.requirements}
                      </div>
                      <div>
                        <strong>Available Seats:</strong> {course.availableSeats}
                      </div>
                      <div>
                        <strong>Applications:</strong> {course.applications}
                      </div>
                    </div>
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
