import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState(1); // 1: Email, 2: Verify Code, 3: Registration Form
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Step 1: Check email and send code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    clearError();

    if (!formData.email) {
      setEmailError('Email is required');
      setEmailLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError('Invalid email format');
      setEmailLoading(false);
      return;
    }

    try {
      const result = await authAPI.checkEmailAndSendCode(formData.email);
      
      if (result.success) {
        setVerifiedEmail(formData.email);
        setStep(2);
      } else {
        setEmailError(result.message || 'Failed to send verification code');
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to check email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyError('Please enter a valid 6-digit code');
      setVerifyLoading(false);
      return;
    }

    try {
      const result = await authAPI.verifyPreRegistrationEmail(verifiedEmail, verificationCode);
      
      if (result.success) {
        setStep(3); // Proceed to registration form
      } else {
        setVerifyError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setVerifyError('');
    try {
      const result = await authAPI.checkEmailAndSendCode(verifiedEmail);
      if (result.success) {
        setVerifyError(''); // Clear any errors
        alert('Verification code resent! Please check your email.');
      }
    } catch (err) {
      setVerifyError('Failed to resend code. Please try again.');
    }
  };

  // Validation functions
  const validateName = (name, fieldName) => {
    const nameRegex = /^[A-Za-z\s]+$/;

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

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return validateName(value, 'First name');
      case 'lastName':
        return validateName(value, 'Last name');
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Step 3: Complete registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'phone') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;

    if (!hasErrors) {
      // Ensure email matches verified email
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: verifiedEmail, // Use verified email
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      };

      const result = await register(userData);

      if (result.success) {
        // Store token and user
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // Redirect to dashboard
        const dashboardPath = '/' + result.user.role + '/dashboard';
        navigate(dashboardPath);
      }
    }
  };

  const handleNameKeyPress = (e) => {
    const charCode = e.charCode;
    if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32)) {
      e.preventDefault();
    }
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '14px 16px',
    border: errors[fieldName] ? '2px solid #ef4444' : '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    background: 'white'
  });

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    padding: '20px'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '40px 35px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  // Step 1: Email Entry
  const renderEmailStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Verify Your Email
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          Enter your email address to get started
        </p>
      </div>

      {emailError && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #fecaca',
          fontSize: '0.9rem'
        }}>
          {emailError}
        </div>
      )}

      <form onSubmit={handleEmailSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.95rem'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={getInputStyle('email')}
            placeholder="Enter your email address"
            disabled={emailLoading}
          />
        </div>

        <button
          type="submit"
          disabled={emailLoading}
          style={{
            width: '100%',
            background: emailLoading 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: emailLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: emailLoading ? 0.8 : 1
          }}
        >
          {emailLoading ? 'Checking...' : 'Send Verification Code'}
        </button>
      </form>
    </>
  );

  // Step 2: Verification Code
  const renderVerifyStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Enter Verification Code
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          We sent a 6-digit code to <strong>{verifiedEmail}</strong>
        </p>
      </div>

      {verifyError && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #fecaca',
          fontSize: '0.9rem'
        }}>
          {verifyError}
        </div>
      )}

      <form onSubmit={handleVerifyCode}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.95rem'
          }}>
            Verification Code *
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
            }}
            required
            style={{
              ...getInputStyle('code'),
              textAlign: 'center',
              fontSize: '1.5rem',
              letterSpacing: '8px',
              fontFamily: 'monospace'
            }}
            placeholder="000000"
            maxLength={6}
            disabled={verifyLoading}
          />
        </div>

        <button
          type="submit"
          disabled={verifyLoading || verificationCode.length !== 6}
          style={{
            width: '100%',
            background: (verifyLoading || verificationCode.length !== 6)
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: (verifyLoading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: (verifyLoading || verificationCode.length !== 6) ? 0.8 : 1,
            marginBottom: '15px'
          }}
        >
          {verifyLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={handleResendCode}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#667eea',
            padding: '12px',
            border: '2px solid #667eea',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Resend Code
        </button>

        <button
          type="button"
          onClick={() => {
            setStep(1);
            setVerificationCode('');
            setVerifyError('');
          }}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#6b7280',
            padding: '12px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          ← Change Email
        </button>
      </form>
    </>
  );

  // Step 3: Registration Form
  const renderRegistrationForm = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Create Account
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          Complete your registration
        </p>
        <p style={{
          color: '#10b981',
          fontSize: '0.9rem',
          marginTop: '8px',
          fontWeight: '600'
        }}>
          ✓ Email verified: {verifiedEmail}
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #fecaca',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleNameKeyPress}
              required
              style={getInputStyle('firstName')}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '6px'
              }}>
                ⚠️ {errors.firstName}
              </div>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleNameKeyPress}
              required
              style={getInputStyle('lastName')}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '6px'
              }}>
                ⚠️ {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.95rem'
          }}>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={getInputStyle('phone')}
            placeholder="Enter your phone number"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.95rem'
          }}>
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
            <option value="student">🎓 Student</option>
            <option value="institute">🏫 Institution</option>
            <option value="company">💼 Company</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={getInputStyle('password')}
              placeholder="Create password"
            />
            {errors.password && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '6px'
              }}>
                ⚠️ {errors.password}
              </div>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.95rem'
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={getInputStyle('confirmPassword')}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '6px'
              }}>
                ⚠️ {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.8 : 1
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </>
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {step === 1 && renderEmailStep()}
        {step === 2 && renderVerifyStep()}
        {step === 3 && renderRegistrationForm()}

        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '25px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
