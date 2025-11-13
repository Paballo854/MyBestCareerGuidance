import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (/\d/.test(formData.firstName)) {
      errors.firstName = 'First name cannot contain numbers';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (/\d/.test(formData.lastName)) {
      errors.lastName = 'Last name cannot contain numbers';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (formData.phone && !/^\+?[0-9\s\-()]{8,}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
    clearError();
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'institute':
        return '/institute/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        navigate(getDashboardPath(result.user.role));
      } else if (result.error) {
        setSubmitError(result.error);
      }
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    }
  };

  const hasErrors = Object.values(formErrors).some(Boolean) || Boolean(submitError);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          
          <h1 style={{ fontSize: '1.9rem', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
            Create Your Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Sign up to explore courses, manage applications, and grow your career with confidence.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              I want to join as *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="student">Student</option>
              <option value="institute">Institution</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}
              >
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: formErrors.firstName ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              />
              {formErrors.firstName && (
                <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                  {formErrors.firstName}
                </span>
              )}
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}
              >
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: formErrors.lastName ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              />
              {formErrors.lastName && (
                <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                  {formErrors.lastName}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: formErrors.email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
            {formErrors.email && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                {formErrors.email}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: formErrors.password ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
            {formErrors.password && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                {formErrors.password}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: formErrors.confirmPassword ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
            {formErrors.confirmPassword && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                {formErrors.confirmPassword}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Phone Number (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: formErrors.phone ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white'
              }}
            />
            {formErrors.phone && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', display: 'block' }}>
                {formErrors.phone}
              </span>
            )}
          </div>

          {(submitError || error) && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>{submitError || error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || hasErrors}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
