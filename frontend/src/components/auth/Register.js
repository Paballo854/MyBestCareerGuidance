import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Function to validate name fields (no numbers allowed)
  const validateName = (name, fieldName) => {
    const nameRegex = /^[A-Za-z\\s]+$/;
    
    if (!name) {
      return fieldName + ' is required';
    }
    
    if (!nameRegex.test(name)) {
      return fieldName + ' should not contain numbers or special characters';
    }
    
    if (name.length < 2) {
      return fieldName + ' should be at least 2 characters long';
    }
    
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'firstName' || name === 'lastName') {
      const fieldName = name === 'firstName' ? 'First Name' : 'Last Name';
      const error = validateName(value, fieldName);
      setErrors({
        ...errors,
        [name]: error
      });
    }

    if (errors[name] && value) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const firstNameError = validateName(formData.firstName, 'First Name');
    const lastNameError = validateName(formData.lastName, 'Last Name');
    
    const newErrors = {
      firstName: firstNameError,
      lastName: lastNameError,
      email: !formData.email ? 'Email is required' : '',
      password: !formData.password ? 'Password is required' : formData.password.length < 6 ? 'Password must be at least 6 characters' : '',
      confirmPassword: !formData.confirmPassword ? 'Please confirm your password' : formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      };

      const result = await register(userData);
      
      if (result.success) {
        const dashboardPath = '/' + result.user.role + '/dashboard';
        window.location.href = dashboardPath;
      }
    }
  };

  const handleNameKeyPress = (e) => {
    const charCode = e.charCode;
    if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32)) {
      e.preventDefault();
    }
  };

  const handleNamePaste = (e, fieldName) => {
    const pastedData = e.clipboardData.getData('text');
    const nameRegex = /^[A-Za-z\\s]+$/;
    
    if (!nameRegex.test(pastedData)) {
      e.preventDefault();
      alert(fieldName + ' should not contain numbers or special characters');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f3f4f6'
    }}>
      <div style={{ width: '450px', padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>
          Create Account
        </h2>
        
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onKeyPress={handleNameKeyPress}
                onPaste={(e) => handleNamePaste(e, 'First name')}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.firstName ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                  {errors.firstName}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onKeyPress={handleNameKeyPress}
                onPaste={(e) => handleNamePaste(e, 'Last name')}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.lastName ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none'
                }}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none'
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              placeholder="Enter your phone number"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="student">Student</option>
              <option value="institute">Institute</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none'
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none'
              }}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span style={{ color: '#6b7280' }}>Already have an account? </span>
          <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
