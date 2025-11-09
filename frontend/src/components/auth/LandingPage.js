import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
          My Best Career Guidance
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
            Login
          </Link>
          <Link to="/register" style={{ 
            color: '#667eea', 
            textDecoration: 'none', 
            fontWeight: '500',
            background: 'white',
            padding: '10px 25px',
            borderRadius: '25px'
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Career Guidance & Employment Platform
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '40px',
          maxWidth: '800px',
          lineHeight: '1.6'
        }}>
          Lesotho's comprehensive platform connecting students with higher education institutions 
          and career opportunities. Discover, apply, and succeed in your professional journey.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{
            background: 'white',
            color: '#667eea',
            padding: '15px 40px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '30px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Start Your Journey
          </Link>
          <a href="#partner-institutions" style={{
            background: 'transparent',
            color: 'white',
            padding: '15px 40px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '30px',
            textDecoration: 'none',
            border: '2px solid white'
          }}>
            Partner Institutions
          </a>
        </div>
      </div>

      {/* Partner Institutions Section */}
      <div id="partner-institutions" style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '80px 20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '50px',
          fontWeight: 'bold'
        }}>
          Partner Institutions
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          flexWrap: 'wrap',
          alignItems: 'center',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* National University of Lesotho */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '300px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '10px'
            }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/National_University_of_Lesotho_logo.svg/1200px-National_University_of_Lesotho_logo.svg.png" 
                alt="National University of Lesotho"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style=\"color: #667eea; font-size: 2rem; font-weight: bold;\">NUL</div>';
                }}
              />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '600' }}>
              National University of Lesotho
            </h3>
            <p style={{ opacity: '0.9', lineHeight: '1.5' }}>
              Lesotho's premier public university offering diverse academic programs and research opportunities.
            </p>
          </div>

          {/* Lesotho College of Education */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '300px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '10px'
            }}>
              <img 
                src="https://www.lce.edu.ls/images/logo.png" 
                alt="Lesotho College of Education"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style=\"color: #667eea; font-size: 2rem; font-weight: bold;\">LCE</div>';
                }}
              />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '600' }}>
              Lesotho College of Education
            </h3>
            <p style={{ opacity: '0.9', lineHeight: '1.5' }}>
              Leading institution for teacher education and educational development in Lesotho.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          flexWrap: 'wrap',
          alignItems: 'center',
          maxWidth: '1000px',
          margin: '40px auto 0'
        }}>
          {/* Limkokwing University */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '300px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '10px'
            }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Limkokwing_University_logo.svg/1200px-Limkokwing_University_logo.svg.png" 
                alt="Limkokwing University"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style=\"color: #667eea; font-size: 2rem; font-weight: bold;\">LU</div>';
                }}
              />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '600' }}>
              Limkokwing University
            </h3>
            <p style={{ opacity: '0.9', lineHeight: '1.5' }}>
              Innovative university focusing on creativity, innovation, and technology education.
            </p>
          </div>

          {/* Botho University */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '300px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '10px'
            }}>
              <img 
                src="https://bothocollege.ac.bw/wp-content/uploads/2022/06/Botho-University-Logo-Full-Color-RGB-1.png" 
                alt="Botho University"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style=\"color: #667eea; font-size: 2rem; font-weight: bold;\">BU</div>';
                }}
              />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '600' }}>
              Botho University
            </h3>
            <p style={{ opacity: '0.9', lineHeight: '1.5' }}>
              Quality education provider with focus on business and technology programs.
            </p>
          </div>
        </div>
      </div>

      {/* System Overview Section */}
      <div style={{
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '50px', fontWeight: 'bold' }}>
          How Our System Works
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* For Students */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>For Students</h3>
            <p style={{ lineHeight: '1.6', opacity: '0.9' }}>
              Browse institutions, apply to courses, track applications, and launch your career with comprehensive guidance.
            </p>
          </div>

          {/* For Institutions */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏫</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>For Institutions</h3>
            <p style={{ lineHeight: '1.6', opacity: '0.9' }}>
              Manage courses, review applications, connect with students, and streamline admission processes.
            </p>
          </div>

          {/* For Companies */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '2020px' }}>💼</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>For Companies</h3>
            <p style={{ lineHeight: '1.6', opacity: '0.9' }}>
              Find qualified graduates, post job opportunities, and connect with ready-to-work talent.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '60px 20px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 'bold' }}>
          Join Lesotho's Leading Career Platform
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: '0.9' }}>
          Connect with top institutions and launch your career journey today
        </p>
        <Link to="/register" style={{
          background: 'white',
          color: '#667eea',
          padding: '15px 40px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderRadius: '30px',
          textDecoration: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          Get Started Now
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
          My Best Career Guidance Platform
        </p>
        <p style={{ opacity: '0.8' }}>
          Connecting Students with Lesotho's Top Institutions • National University of Lesotho • Lesotho College of Education
        </p>
        <p style={{ marginTop: '20px', opacity: '0.6' }}>
          &copy; 2024 Career Guidance System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
