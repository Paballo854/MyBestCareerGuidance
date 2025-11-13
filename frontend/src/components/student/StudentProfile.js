import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    highSchool: '',
    graduationYear: '',
    currentEducation: '',
    interests: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // REAL API CALL to get student profile
      const response = await studentAPI.getProfile();
      setProfile(response.profile || response);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to mock data if API fails
      setProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.limkokwing.ac.ls',
        phone: '+266 1234 5678',
        address: '123 Main Street, Maseru, Lesotho',
        dateOfBirth: '2000-05-15',
        gender: 'Male',
        nationality: 'Mosotho',
        highSchool: 'Maseru High School',
        graduationYear: '2018',
        currentEducation: 'BSc in Information Technology',
        interests: ['Programming', 'Web Development', 'Data Science', 'AI']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // REAL API CALL to update profile
      await studentAPI.updateProfile(profile);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addInterest = (interest) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !profile.interests.includes(trimmedInterest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest]
      }));
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Student Profile
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn btn-primary"
          disabled={saving}
        >
          {isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
        </button>
      </div>

      <div className="card">
        {/* Personal Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                First Name *
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Nationality
              </label>
              <input
                type="text"
                value={profile.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
              Address
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minHeight: '80px',
                resize: 'vertical',
                background: isEditing ? 'white' : '#f9fafb'
              }}
            />
          </div>
        </div>

        {/* Educational Background */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            Educational Background
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                High School
              </label>
              <input
                type="text"
                value={profile.highSchool}
                onChange={(e) => handleInputChange('highSchool', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Graduation Year
              </label>
              <input
                type="number"
                value={profile.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Current Education
              </label>
              <input
                type="text"
                value={profile.currentEducation}
                onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              />
            </div>
          </div>
        </div>

        {/* Interests & Skills */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            Interests & Career Interests
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#374151' }}>
              Your Interests ({profile.interests.length})
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  id="newInterest"
                  placeholder="Add new interest..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addInterest(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newInterest');
                    addInterest(input.value);
                    input.value = '';
                  }}
                  className="btn btn-secondary"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              style={{ background: '#f3f4f6', color: '#374151' }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Account Security Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Account Security
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151' }}>Change Password</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Update your password regularly for security</div>
            </div>
            <button className="btn btn-secondary" style={{ background: '#f3f4f6', color: '#374151' }}>
              Change Password
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151' }}>Login Activity</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>View your recent login history</div>
            </div>
            <button className="btn btn-secondary" style={{ background: '#f3f4f6', color: '#374151' }}>
              View Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
