import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const result = await login(formData);
            
            if (result.success) {
                // REDIRECT TO DASHBOARD
                console.log('Redirecting to dashboard...');
                const dashboardPath = '/' + formData.role + '/dashboard';
                navigate(dashboardPath);
            }
        } catch (error) {
            setErrors({ submit: error.message || 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '40px 35px',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        Sign in to your CareerGuide account
                    </p>
                </div>

                {errors.submit && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        border: '1px solid #fecaca',
                        fontSize: '0.9rem'
                    }}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
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
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                background: 'white'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = errors.email ? '#ef4444' : '#667eea';
                                e.target.style.background = '#f8fafc';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb';
                                e.target.style.background = 'white';
                            }}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <div style={{
                                color: '#ef4444',
                                fontSize: '0.85rem',
                                marginTop: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                ⚠️ {errors.email}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <label style={{
                                fontWeight: '600',
                                color: '#374151',
                                fontSize: '0.95rem'
                            }}>
                                Password *
                            </label>
                            <a href="/forgot-password" style={{
                                color: '#667eea',
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: errors.password ? '2px solid #ef4444' : '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                background: 'white'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = errors.password ? '#ef4444' : '#667eea';
                                e.target.style.background = '#f8fafc';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb';
                                e.target.style.background = 'white';
                            }}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <div style={{
                                color: '#ef4444',
                                fontSize: '0.85rem',
                                marginTop: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                ⚠️ {errors.password}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '0.95rem'
                        }}>
                            I am a *
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
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.background = '#f8fafc';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.background = 'white';
                            }}
                        >
                            <option value="student">🎓 Student</option>
                            <option value="institute">🏫 Institution</option>
                            <option value="company">💼 Company</option>
                            <option value="admin">⚙️ Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            background: isLoading 
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '16px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: isLoading ? 0.8 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid transparent',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%'
                                }}></div>
                                Signing In...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

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
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.color = '#5a67d8'}
                            onMouseOut={(e) => e.target.style.color = '#667eea'}
                        >
                            Create account
                        </Link>
                    </p>
                </div>

                <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '10px',
                    padding: '15px',
                    marginTop: '25px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#0369a1',
                        fontSize: '0.85rem',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        💡 Demo: Use any email/password to test the login
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
