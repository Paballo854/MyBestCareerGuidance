import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="gradient-bg" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      {/* Navigation */}
      <nav className="navbar" style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'white',
            borderRadius: '8px',
            marginRight: '8px'
          }}></div>
          <span style={{color: 'white', fontSize: '20px', fontWeight: 'bold'}}>
            CareerGuide
          </span>
        </div>
        <div style={{display: 'flex', gap: '16px'}}>
          <Link to="/login" style={{color: 'white', textDecoration: 'none', padding: '8px 16px'}}>
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{textDecoration: 'none'}}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{padding: '80px 20px', textAlign: 'center', color: 'white', flex: '1'}}>
        <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '24px'}}>
          Your Career Journey Starts Here
        </h1>
        <p style={{fontSize: '20px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px'}}>
          Connect with top institutions, discover your dream career, and launch your professional future.
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/register?role=student" className="btn btn-primary" style={{textDecoration: 'none'}}>
            Start as Student
          </Link>
          <Link to="/register?role=institute" className="btn btn-secondary" style={{textDecoration: 'none'}}>
            Join as Institute
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{background: 'white', padding: '80px 20px'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '64px'}}>
            <h2 style={{fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px'}}>
              How It Works
            </h2>
            <p style={{fontSize: '18px', color: '#6b7280'}}>Four roles, one powerful platform</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              {title: 'Students', desc: 'Discover institutions, apply for courses, and find jobs.'},
              {title: 'Institutions', desc: 'Manage courses and connect with qualified students.'},
              {title: 'Companies', desc: 'Post jobs and find qualified candidates.'},
              {title: 'Administrators', desc: 'Monitor system and manage users.'}
            ].map((feature, index) => (
              <div key={index} className="card">
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>📚</div>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center'}}>
                  {feature.title}
                </h3>
                <p style={{color: '#6b7280', textAlign: 'center'}}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        padding: '60px 20px 30px'
      }}>
        <div className="container">
          {/* Main Footer Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Company Info */}
            <div>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'white',
                  borderRadius: '8px',
                  marginRight: '12px'
                }}></div>
                <span style={{fontSize: '24px', fontWeight: 'bold'}}>CareerGuide</span>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px'}}>
                Empowering students and professionals to discover their career path and connect with opportunities that shape their future.
              </p>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>📘</div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>📷</div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>🐦</div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>Quick Links</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <Link to="/" style={{color: '#d1d5db', textDecoration: 'none'}}>Home</Link>
                <Link to="/about" style={{color: '#d1d5db', textDecoration: 'none'}}>About Us</Link>
                <Link to="/institutions" style={{color: '#d1d5db', textDecoration: 'none'}}>Institutions</Link>
                <Link to="/jobs" style={{color: '#d1d5db', textDecoration: 'none'}}>Job Board</Link>
                <Link to="/contact" style={{color: '#d1d5db', textDecoration: 'none'}}>Contact</Link>
              </div>
            </div>

            {/* User Types */}
            <div>
              <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>For Users</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <Link to="/register?role=student" style={{color: '#d1d5db', textDecoration: 'none'}}>Students</Link>
                <Link to="/register?role=institute" style={{color: '#d1d5db', textDecoration: 'none'}}>Institutions</Link>
                <Link to="/register?role=company" style={{color: '#d1d5db', textDecoration: 'none'}}>Companies</Link>
                <Link to="/login" style={{color: '#d1d5db', textDecoration: 'none'}}>Administrators</Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '20px'}}>Contact Us</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px', color: '#d1d5db'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>📧</span>
                  <span>info-careerguide@limkokwing.ac.ls</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>📞</span>
                  <span>+266 1234 5678</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>🏢</span>
                  <span>Limkokwing University, Maseru, Lesotho</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>👨‍🏫</span>
                  <span>Lecturers: Mr Thokoana & Mr Molaoa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center'}}>
              <Link to="/privacy" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '14px'}}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '14px'}}>
                Terms of Service
              </Link>
              <Link to="/cookies" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '14px'}}>
                Cookie Policy
              </Link>
            </div>
            <p style={{color: '#9ca3af', fontSize: '14px'}}>
              © 2025 CareerGuide - Faculty of Information & Communication Technology, Limkokwing University. 
              All rights reserved.
            </p>
            <p style={{color: '#9ca3af', fontSize: '12px'}}>
              BSc. in Information Technology | BSc. in Business Information Technology | Diploma in Information Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
