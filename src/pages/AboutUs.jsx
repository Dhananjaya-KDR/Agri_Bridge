import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Award, Target, Heart } from 'lucide-react';
import splashBg from '../assets/splash-bg.jpg'; // Reusing the splash background

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ background: '#F0FFF4', minHeight: '100vh' }}>
      
      {/* Navbar (Reused from Welcome.jsx for consistency) */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/welcome')}>
            <div style={{ background: '#2F855A', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <Leaf color="white" size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2F855A' }}>AgriBridge</span>
        </div>

        <div className="nav-links" style={{ display: 'flex' }}> 
          <span className="nav-link" onClick={() => navigate('/welcome')}>Home</span>
          <span className="nav-link active" style={{ color: '#2F855A', fontWeight: 'bold' }}>About Us</span>
          <span className="nav-link" onClick={() => navigate('/features')} style={{ cursor: 'pointer' }}>Features</span>
          <span className="nav-link" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Join Us</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" style={{ paddingBottom: '0' }}>
        <div className="hero-content" style={{ marginTop: '5rem', zIndex: 2, position: 'relative' }}>
            <h1 className="title-text">
                Cultivating Connections,<br />Harvesting Hope
            </h1>
            <p className="subtitle-text" style={{ maxWidth: '700px' }}>
                At AgriBridge, we believe that the future of agriculture lies in direct, transparent, and fair partnerships. We are more than just a platform; we are a movement to empower farmers and nourish communities.
            </p>
        </div>

        {/* Background Overlay */}
        <div className="hero-image-container" style={{ height: '60vh' }}>
            <img src={splashBg} alt="Background" className="hero-img" style={{ objectFit: 'cover', opacity: 0.2 }} />
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(180deg, #F0FFF4 0%, rgba(240, 255, 244, 0.8) 50%, #F0FFF4 100%)' 
            }}></div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container" style={{ padding: '0 2rem 4rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3, marginTop: '-5rem' }}>
        
        {/* Mission & Vision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="feature-card" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '2.5rem' }}>
                <div className="feature-icon-box" style={{ background: '#E6FFFA', marginBottom: '1.5rem' }}>
                    <Target color="#2F855A" size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2D3748' }}>Our Mission</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4A5568' }}>
                    To revolutionize the agricultural supply chain by eliminating intermediaries, ensuring fair prices for farmers, and providing fresh, high-quality produce directly to consumers and businesses.
                </p>
            </div>

            <div className="feature-card" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '2.5rem', background: '#2F855A', color: 'white' }}>
                <div className="feature-icon-box" style={{ background: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}>
                    <Leaf color="white" size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Our Vision</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
                    A world where every farmer thrives, every community has access to nutritious food, and agriculture is a sustainable, profitable, and respected stewardship of our planet.
                </p>
            </div>
        </div>

        {/* Core Values */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#2D3748', marginBottom: '1rem', fontWeight: '800' }}>Our Core Values</h2>
            <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '700px', margin: '0 auto 3rem' }}>The principles that guide every decision we make.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="feature-card">
                    <div className="feature-icon-box" style={{ background: '#E6FFFA' }}>
                        <Users color="#38B2AC" size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Community First</h3>
                    <p>Building strong, supportive networks between rural producers and urban consumers.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-box" style={{ background: '#F0FFF4' }}>
                        <Heart color="#48BB78" size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Integrity & Trust</h3>
                    <p>Transparency in pricing, sourcing, and relationships is the bedrock of our platform.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-box" style={{ background: '#EBF8FF' }}>
                        <Award color="#4299E1" size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Excellence</h3>
                    <p>Committing to the highest standards in technology, support, and produce quality.</p>
                </div>
            </div>
        </div>

        {/* Team Section (Optional placeholder) */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#2D3748', marginBottom: '1.5rem' }}>Join the Movement</h2>
                <p style={{ fontSize: '1.1rem', color: '#4A5568', maxWidth: '600px', marginBottom: '2rem' }}>
                    Check out our open positions to help shape the future of AgriBridge. Whether you're a developer, agronomist, or marketer, we have a place for you.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/signup')}>
                    View Opportunities
                </button>
            </div>
        </div>

      </div>

      {/* Footer (Simple) */}
      <footer style={{ background: '#2F855A', color: 'white', padding: '2rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} AgriBridge. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default AboutUs;
