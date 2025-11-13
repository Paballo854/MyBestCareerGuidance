import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const CourseBrowser = () => {
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState('');

  useEffect(() => {
    loadCoursesAndInstitutions();
  }, []);

  const loadCoursesAndInstitutions = async () => {
    try {
      setLoading(true);
      
      // Load courses from backend
      const coursesResponse = await studentAPI.getCourses();
      if (coursesResponse.success && coursesResponse.courses) {
        setCourses(coursesResponse.courses);
      } else {
        setCourses([]);
      }
      
      // Load institutions from backend
      const institutionsResponse = await studentAPI.getInstitutions();
      if (institutionsResponse.success && institutionsResponse.institutions) {
        setInstitutions(institutionsResponse.institutions);
      } else {
        setInstitutions([]);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load courses. Please try again.');
      setCourses([]);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (course) => {
    try {
      setApplying(course.id);
      
      const applicationData = {
        courseId: course.id,
        institutionId: course.institutionId
      };

      const response = await studentAPI.applyForCourse(applicationData);
      
      alert(response.message || 'Application submitted successfully!');
      
      // Reload applications to show the new one
      loadCoursesAndInstitutions();
      
    } catch (error) {
      console.error('Application error:', error);
      
      if (error.response?.data?.error) {
        alert('Application failed: ' + error.response.data.error);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading courses...</div>
      </div>
    );
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
            {institutions.map(inst => (
              <option key={inst.id} value={inst.name}>{inst.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {courses
          .filter(course => !selectedInstitution || course.institutionName === selectedInstitution)
          .map(course => (
            <div key={course.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                    {course.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Institution:</strong> {course.institutionName || course.institution}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Requirements:</strong> {course.requirements}
                  </p>
                  {course.requiredSubjects && course.requiredSubjects.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#6b7280' }}>Required Subjects: </strong>
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
                    <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                      <strong>Minimum Grade:</strong> {course.minimumGrade}%
                    </p>
                  )}
                  {course.additionalRequirements && course.additionalRequirements.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#6b7280' }}>Additional Requirements: </strong>
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
                  <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                    <strong>Available Seats:</strong> {course.availableSeats || 'Not specified'}
                  </p>
                  {course.description && (
                    <p style={{ color: '#6b7280', marginBottom: '5px' }}>
                      <strong>Description:</strong> {course.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleApply(course)}
                  className="btn btn-primary"
                  style={{ minWidth: '100px' }}
                  disabled={applying === course.id}
                >
                  {applying === course.id ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
      </div>

      {courses.filter(course => !selectedInstitution || course.institutionName === selectedInstitution).length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No courses found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default CourseBrowser;
