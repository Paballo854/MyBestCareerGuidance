import React, { useState, useEffect } from 'react';

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    name: 'Tech Solutions Lesotho',
    email: 'hr@techsolutions.ls',
    industry: 'Information Technology',
    size: '50-100',
    founded: '2018',
    website: 'www.techsolutions.ls',
    phone: '+266 2834 5678',
    address: 'Maseru, Lesotho',
    description: 'Leading technology solutions provider in Lesotho, specializing in software development, IT consulting, and digital transformation services.',
    mission: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    values: ['Innovation', 'Quality', 'Customer Focus', 'Integrity'],
    contactPerson: 'Mr. Thabo Mokoena',
    contactEmail: 'thabo.mokoena@techsolutions.ls',
    contactPhone: '+266 2834 5678'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState({});

  useEffect(() => {
    setEditedCompany(company);
  }, [company]);

  const handleSave = () => {
    setCompany(editedCompany);
    setIsEditing(false);
    alert('Company profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedCompany(company);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditedCompany({
      ...editedCompany,
      [e.target.name]: e.target.value
    });
  };

  const handleArrayChange = (field, value) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setEditedCompany({
      ...editedCompany,
      [field]: values
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          Company Profile
        </h2>
        {!isEditing ? (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Company Information */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              Company Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedCompany.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.name}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Industry</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="industry"
                    value={editedCompany.industry}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.industry}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Company Size</label>
                {isEditing ? (
                  <select
                    name="size"
                    value={editedCompany.size}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="50-100">50-100 employees</option>
                    <option value="100-500">100-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.size} employees
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Year Founded</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="founded"
                    value={editedCompany.founded}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.founded}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={editedCompany.website}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.website}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              Contact Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Person</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="contactPerson"
                    value={editedCompany.contactPerson}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.contactPerson}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="contactEmail"
                    value={editedCompany.contactEmail}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.contactEmail}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="contactPhone"
                    value={editedCompany.contactPhone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.contactPhone}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Company Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedCompany.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.email}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedCompany.address}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                ) : (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                    {company.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div style={{ marginTop: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Company Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={editedCompany.description}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                resize: 'vertical'
              }}
            />
          ) : (
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px', lineHeight: '1.6' }}>
              {company.description}
            </div>
          )}
        </div>

        {/* Mission Statement */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mission Statement</label>
          {isEditing ? (
            <textarea
              name="mission"
              value={editedCompany.mission}
              onChange={handleInputChange}
              rows="3"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                resize: 'vertical'
              }}
            />
          ) : (
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px', lineHeight: '1.6' }}>
              {company.mission}
            </div>
          )}
        </div>

        {/* Company Values */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Company Values</label>
          {isEditing ? (
            <textarea
              value={editedCompany.values?.join(', ')}
              onChange={(e) => handleArrayChange('values', e.target.value)}
              rows="2"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                resize: 'vertical'
              }}
              placeholder="Enter values separated by commas"
            />
          ) : (
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {company.values.map((value, index) => (
                  <span key={index} style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
