import React, { useState, useEffect } from 'react';
import { instituteAPI } from '../../services/api';

const InstituteProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    type: '',
    established: '',
    description: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    location: ''
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
      const response = await instituteAPI.getProfile();
      if (response.success && response.profile) {
        const p = response.profile;
        setProfile({
          name: p.lastName || p.name || p.institution?.name || '',
          email: p.email || '',
          phone: p.phone || '',
          address: p.location || p.address || p.institution?.location || '',
          website: p.website || p.institution?.website || '',
          type: p.type || '',
          established: p.established || '',
          description: p.description || p.institution?.description || '',
          contactPerson: p.contactPerson || '',
          contactEmail: p.contactEmail || p.institution?.contactEmail || '',
          contactPhone: p.contactPhone || '',
          location: p.location || p.institution?.location || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile. Please try again.');
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
      const profileData = {
        name: profile.name,
        location: profile.address || profile.location,
        description: profile.description,
        contactEmail: profile.contactEmail,
        phone: profile.phone,
        website: profile.website
      };

      const response = await instituteAPI.updateProfile(profileData);
      if (response.success) {
        alert('Institute profile updated successfully!');
        setIsEditing(false);
        loadProfile();
      } else {
        alert(response.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading institute profile...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Institute Profile
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn btn-primary"
          disabled={loading}
        >
          {isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
        </button>
      </div>

      <div className="card">
        {/* Basic Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            Basic Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Institution Name *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                Institution Type *
              </label>
              <select
                value={profile.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: isEditing ? 'white' : '#f9fafb'
                }}
              >
                <option value="">Select Type</option>
                <option value="Public University">Public University</option>
                <option value="Private University">Private University</option>
                <option value="College">College</option>
                <option value="Technical Institute">Technical Institute</option>
                <option value="Vocational School">Vocational School</option>
              </select>
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
                Phone Number *
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
                Year Established
              </label>
              <input
                type="number"
                value={profile.established}
                onChange={(e) => handleInputChange('established', e.target.value)}
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
                Website
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
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
              Address *
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

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
              Institution Description
            </label>
            <textarea
              value={profile.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minHeight: '100px',
                resize: 'vertical',
                background: isEditing ? 'white' : '#f9fafb'
              }}
              placeholder="Describe your institution, programs, and unique features..."
            />
          </div>
        </div>

        {/* Contact Person Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            Admissions Contact Person
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Contact Person Name *
              </label>
              <input
                type="text"
                value={profile.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
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
                Contact Email *
              </label>
              <input
                type="email"
                value={profile.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
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
                Contact Phone *
              </label>
              <input
                type="tel"
                value={profile.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              style={{ background: '#f3f4f6', color: '#374151' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={loading}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Statistics Card */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Institution Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>8</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Active Courses</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>45</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Applications</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fffbeb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>15</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Admitted Students</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fef2f2', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>5</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteProfile;
