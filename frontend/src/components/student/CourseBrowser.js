import React, { useState, useEffect } from 'react';

const CourseBrowser = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState('');

  useEffect(() => {
    // This will be connected to your backend
    // For now, using mock data
    setCourses([
      {
        id: 1,
        name: 'BSc in Information Technology',
        institution: 'Limkokwing University',
        duration: '4 years',
        requirements: 'High School Diploma',
        availableSeats: 50
      },
      {
        id: 2, 
        name: 'Diploma in Business IT',
        institution: 'National University of Lesotho',
        duration: '2 years',
        requirements: 'High School Certificate',
        availableSeats: 30
      },
      {
        id: 3,
        name: 'BSc in Computer Science',
        institution: 'Botho University',
        duration: '4 years',
        requirements: 'Mathematics and Science background',
        availableSeats: 40
      }
    ]);
    setLoading(false);
  }, []);

  const handleApply = (courseId) => {
    alert('Application submitted for course ID: ' + courseId + ' - This will connect to your backend');
    // Will connect to: studentAPI.applyForCourse({ courseId })
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</div>;
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        Browse Available Courses
      </h2>
      
      {/* Filter Section */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Filter by Institution:</label>
          <select 
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          >
            <option value="">All Institutions</option>
            <option value="Limkokwing University">Limkokwing University</option>
            <option value="National University of Lesotho">National University of Lesotho</option>
            <option value="Botho University">Botho University</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {courses
          .filter(course => !selectedInstitution || course.institution === selectedInstitution)
          .map(course => (
            <div key={course.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                    {course.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Institution:</strong> {course.institution}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Requirements:</strong> {course.requirements}
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Available Seats:</strong> {course.availableSeats}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(course.id)}
                  className="btn btn-primary"
                  style={{ minWidth: '100px' }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
      </div>

      {courses.filter(course => !selectedInstitution || course.institution === selectedInstitution).length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No courses found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default CourseBrowser;
