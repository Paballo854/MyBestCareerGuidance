import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set role from URL parameter if provided
  React.useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && ['student', 'institute', 'company', 'admin'].includes(roleFromUrl)) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [searchParams]);

  const validateName = (name) => {
    return /^[A-Za-z\s\-']+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName') {
      if (value === '' || validateName(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
        if (errors[name]) {
          setErrors({
            ...errors,
            [name]: ''
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear submit error when user starts typing
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    
    const newErrors = {};

    // Validate all fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name should only contain letters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name should only contain letters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Prepare data for backend (remove confirmPassword)
      const { confirmPassword, ...submitData } = formData;
      
      const result = await register(submitData);
      
      if (result.success) {
        // Redirect based on user role
        const redirectPath = getDashboardPath(result.user.role);
        navigate(redirectPath);
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div className="card" style={{maxWidth: '500px', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>
            Create Account
          </h2>
          <p style={{color: '#6b7280'}}>Join our career guidance platform</p>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              I am a:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'white',
                opacity: loading ? 0.6 : 1
              }}
            >
              <option value="student">Student</option>
              <option value="institute">Institution</option>
              <option value="company">Company</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Name Fields */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.firstName ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1
                }}
                placeholder="First name"
              />
              {errors.firstName && (
                <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{errors.firstName}</p>
              )}
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.lastName ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1
                }}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
              placeholder="Create a password"
            />
            {errors.password && (
              <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.confirmPassword ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{errors.confirmPassword}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{width: '100%', marginBottom: '16px', opacity: loading ? 0.6 : 1}}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{textAlign: 'center', color: '#6b7280'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500'}}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
