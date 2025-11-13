import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    institutions: 0,
    companies: 0,
    successfulApplications: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      students: 1250,
      institutions: 8,
      companies: 45,
      successfulApplications: 890
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(targetStats).forEach(key => {
      let current = 0;
      const increment = targetStats[key] / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetStats[key]) {
          current = targetStats[key];
          clearInterval(timer);
        }
        setStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      color: 'white'
    }}>
      {/* Enhanced Navigation with Home, About, Contact */}
      <nav style={{
        padding: '20px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #fff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CareerGuide
        </div>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          {/* Home Link */}
          <a href="#home" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Home
          </a>
          
          {/* About Link */}
          <a href="#about" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}>
            About
          </a>
          
          {/* Contact Link */}
          <a href="#contact" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Contact
          </a>
          
          <a href="#statistics" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Statistics
          </a>
          <Link to="/login" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Login
          </Link>
          <Link to="/register" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600',
            background: 'white',
            padding: '12px 28px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Home Section */}
      <div id="home" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 'bold',
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          lineHeight: '1.2'
        }}>
          Transform Your Career Journey in{' '}
          <span style={{
            background: 'linear-gradient(45deg, #ffd89b, #19547b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Lesotho</span>
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          marginBottom: '48px',
          maxWidth: '800px',
          lineHeight: '1.6',
          opacity: '0.95'
        }}>
          Lesotho's premier platform connecting ambitious students with top higher education institutions
          and leading employers. Your journey to academic and professional success starts here.
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link to="/register" style={{
            background: 'linear-gradient(45deg, #fff, #f0f4ff)',
            color: '#667eea',
            padding: '16px 42px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '30px',
            textDecoration: 'none',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}>
            Start Your Journey
          </Link>
          <a href="#features" style={{
            background: 'transparent',
            color: 'white',
            padding: '16px 42px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '30px',
            textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = 'rgba(255,255,255,0.5)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Explore Features
          </a>
        </div>
      </div>

      {/* Statistics Section */}
      <div id="statistics" style={{
        background: 'rgba(255,255,255,0.08)',
        padding: '80px 20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          marginBottom: '60px',
          fontWeight: 'bold'
        }}>
          Trusted by Lesotho's Education Community
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {[
            { number: stats.students, label: 'Active Students' },
            { number: stats.institutions, label: 'Partner Institutions' },
            { number: stats.companies, label: 'Partner Companies' },
            { number: stats.successfulApplications, label: 'Successful Applications' }
          ].map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.1)',
              padding: '30px 20px',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                background: 'linear-gradient(45deg, #fff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {stat.number}+
              </div>
              <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Why Choose CareerGuide?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '50px',
          opacity: '0.9',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Discover the features that make CareerGuide Lesotho's most trusted education platform
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { 
              title: 'One-Click Applications', 
              desc: 'Apply to multiple institutions simultaneously with just one click. Save time and increase your chances of acceptance.' 
            },
            { 
              title: 'Real-time Tracking', 
              desc: 'Track your application status in real-time. Get instant notifications when institutions review your application.' 
            },
            { 
              title: 'Smart Career Matching', 
              desc: 'Our AI-powered system matches you with programs and careers that align with your skills and interests.' 
            },
            { 
              title: 'Job Placement Support', 
              desc: 'Connect with top employers and access exclusive job opportunities after completing your studies.' 
            },
            { 
              title: 'Comprehensive Program Database', 
              desc: 'Access detailed information about all available programs, requirements, and deadlines across Lesotho.' 
            },
            { 
              title: 'Scholarship Opportunities', 
              desc: 'Discover and apply for scholarships and financial aid opportunities tailored for Basotho students.' 
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '30px 25px',
              borderRadius: '20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{ 
                fontSize: '1.4rem', 
                marginBottom: '15px', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                lineHeight: '1.6', 
                opacity: '0.9',
                fontSize: '1rem'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" style={{
        background: 'rgba(255,255,255,0.08)',
        padding: '80px 20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Success Stories from Our Students
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '50px',
          opacity: '0.9',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Hear from students who transformed their futures with CareerGuide
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { 
              name: 'Thato Mokoena', 
              story: 'CareerGuide made my university application process so smooth! I applied to three institutions and got accepted into my dream Computer Science program at NUL. The real-time tracking kept me updated every step of the way.', 
              role: 'Computer Science Student at NUL',
              achievement: 'Accepted into Top Choice Program'
            },
            { 
              name: 'Mpho Seatile', 
              story: 'As a first-generation student, I was lost about where to apply. CareerGuide matched me with perfect teaching programs, and I discovered Lesotho College of Education. The platform even helped me find scholarship opportunities!', 
              role: 'Education Student at LCE',
              achievement: 'Secured Full Scholarship'
            },
            { 
              name: 'Lerato Molapo', 
              story: 'I connected with Botho University through CareerGuide and received a partial scholarship! The platform helped me compare programs and make an informed decision about my business administration degree.', 
              role: 'Business Administration Student',
              achievement: 'Connected with Ideal University'
            }
          ].map((testimonial, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '35px 30px',
              borderRadius: '20px',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}>
              {/* Testimonial Text */}
              <p style={{
                fontStyle: 'italic',
                marginBottom: '25px',
                lineHeight: '1.7',
                fontSize: '1.05rem',
                position: 'relative'
              }}>
                "{testimonial.story}"
              </p>
              
              {/* Student Info */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '20px'
              }}>
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  fontSize: '1.2rem'
                }}>
                  {testimonial.name}
                </h4>
                <p style={{
                  opacity: '0.9',
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  {testimonial.role}
                </p>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 15px',
                  borderRadius: '15px',
                  display: 'inline-block',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {testimonial.achievement}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust Badges */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            Trusted by Education Partners Across Lesotho
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{
              opacity: '0.8',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 20px',
              borderRadius: '10px'
            }}>
              Ministry of Education Certified
            </div>
            <div style={{
              opacity: '0.8',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 20px',
              borderRadius: '10px'
            }}>
              Lesotho Qualifications Council
            </div>
            <div style={{
              opacity: '0.8',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 20px',
              borderRadius: '10px'
            }}>
              98% Student Satisfaction
            </div>
          </div>
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
          {/* National University of Lesotho - FULL IMAGE CARD */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '0',
            borderRadius: '20px',
            minWidth: '400px',
            maxWidth: '500px',
            height: '500px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            {/* Full Background Image */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/images/NATIONAL UNIVERSITY OF LESOTHO.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative'
            }}>
              {/* Dark Overlay for Better Text Readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '15px', 
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  National University of Lesotho
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  marginBottom: '0'
                }}>
                  Lesotho's premier public university offering diverse academic programs and research opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Lesotho College of Education - FULL IMAGE CARD */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '0',
            borderRadius: '20px',
            minWidth: '400px',
            maxWidth: '500px',
            height: '500px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            {/* Full Background Image */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/images/LESOTHO COLLEGE OF EDUCATION.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative'
            }}>
              {/* Dark Overlay for Better Text Readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '15px', 
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Lesotho College of Education
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  marginBottom: '0'
                }}>
                  Leading institution for teacher education and educational development in Lesotho.
                </p>
              </div>
            </div>
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
          {/* Limkokwing University - FULL IMAGE CARD */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '0',
            borderRadius: '20px',
            minWidth: '400px',
            maxWidth: '500px',
            height: '500px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            {/* Full Background Image */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/images/LIMKOKWING.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative'
            }}>
              {/* Dark Overlay for Better Text Readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '15px', 
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Limkokwing University
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  marginBottom: '0'
                }}>
                  Innovative university focusing on creativity, innovation, and technology education.
                </p>
              </div>
            </div>
          </div>

          {/* Botho University - FULL IMAGE CARD */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '0',
            borderRadius: '20px',
            minWidth: '400px',
            maxWidth: '500px',
            height: '500px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          }}>
            {/* Full Background Image */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/images/BOTHO UNIVERSITY.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative'
            }}>
              {/* Dark Overlay for Better Text Readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '15px', 
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Botho University
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  marginBottom: '0'
                }}>
                  Quality education provider with focus on business and technology programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" style={{
        background: 'rgba(255,255,255,0.08)',
        padding: '80px 20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '40px',
          fontWeight: 'bold'
        }}>
          About CareerGuide
        </h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'left',
          fontSize: '1.1rem',
          lineHeight: '1.7'
        }}>
          <p style={{ marginBottom: '20px' }}>
            CareerGuide is Lesotho's premier digital platform dedicated to transforming the educational and career landscape 
            by seamlessly connecting students with higher education institutions and future employers.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Our mission is to bridge the gap between academic aspirations and professional opportunities, 
            empowering Basotho youth to make informed decisions about their future careers.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Through our innovative platform, we provide comprehensive guidance, real-time application tracking, 
            and direct connections with Lesotho's top educational institutions and leading companies.
          </p>
          <p>
            Join us in building a brighter future for Lesotho's next generation of professionals, 
            leaders, and innovators.
          </p>
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
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}>
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
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}>
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
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>For Companies</h3>
            <p style={{ lineHeight: '1.6', opacity: '0.9' }}>
              Find qualified graduates, post job opportunities, and connect with ready-to-work talent.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" style={{
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
          Contact Us
        </h2>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.15)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: '600' }}>Email</h3>
            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>paballosetlaba@gmail.com</p>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: '600' }}>Phone</h3>
            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>59452460 / 50486606</p>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: '600' }}>Address</h3>
            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>Maseru, Lesotho</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: '600' }}>Business Hours</h3>
            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>Monday - Friday: 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* Enhanced Final CTA */}
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '80px 20px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '24px',
          fontWeight: 'bold'
        }}>
          Ready to Transform Your Future?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: '0.9',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Join thousands of students and institutions already using CareerGuide to achieve their academic and professional goals.
        </p>
        <Link to="/register" style={{
          background: 'linear-gradient(45deg, #fff, #f0f4ff)',
          color: '#667eea',
          padding: '16px 45px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderRadius: '30px',
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          display: 'inline-block'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}>
          Get Started Now
        </Link>
      </div>

      {/* Enhanced Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '50px 20px 30px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', fontWeight: '600' }}>CareerGuide</h4>
            <p style={{ opacity: '0.8', lineHeight: '1.6' }}>
              Lesotho's leading platform connecting students with higher education and career opportunities.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: '600' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#home" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Home</a>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>About</a>
              <a href="#features" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Features</a>
              <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Testimonials</a>
              <a href="#contact" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Contact</a>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Register</Link>
              <a href="#partner-institutions" style={{ color: 'white', textDecoration: 'none', opacity: '0.8' }}>Institutions</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <p style={{ marginBottom: '8px', fontSize: '1rem', opacity: '0.8' }}>
            CareerGuide - Lesotho's Career & Education Platform
          </p>
          <p style={{ opacity: '0.6', fontSize: '0.9rem' }}>
            &copy; 2024 Career Guidance System. Connecting Students with Lesotho's Top Institutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
