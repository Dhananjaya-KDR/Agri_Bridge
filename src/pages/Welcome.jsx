import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Leaf, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import splashBg from '../assets/splash-bg.jpg';

const Welcome = () => {
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    const email = prompt(`[${provider} Simulation] Enter your registered email to login:`);
    if (!email) return;

    try {
        const response = await fetch('http://localhost:5000/api/social-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`Logged in as ${data.user.name} via ${provider}`);
            if (data.user.role === 'farmer') navigate('/farmer-panel');
            else navigate('/buyer-panel');
        } else {
             if(confirm("User not found. Do you want to sign up?")) navigate('/signup');
        }
    } catch (error) {
        console.error("Social login error", error);
        alert("Login failed. Check backend connection.");
    }
  };

  return (
    <div className="page-container" style={{ background: '#F0FFF4' }}>
      
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#2F855A', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <Leaf color="white" size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2F855A' }}>AgriBridge</span>
        </div>

        {/* Removed invalid inline media query style. Using nav-links class which can handle media queries in CSS file if needed. 
            For now, displaying none is safer if that was intent, or flex to show. 
            The previous code had style={{ display: 'none', md: { display: 'flex' } }} which is invalid.
            I will set it to display: flex just to be visible, or use the class */}
        <div className="nav-links" style={{ display: 'flex' }}> 
          <span className="nav-link">Home</span>
          <span className="nav-link" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</span>
          <span className="nav-link" onClick={() => navigate('/features')} style={{ cursor: 'pointer' }}>Features</span>
          <span className="nav-link" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Join Us</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content" style={{ marginTop: '5rem' }}>
            <h1 className="title-text">
                Connecting Farmers,<br />Empowering Growth
            </h1>
            <p className="subtitle-text">
                Every connection made today creates a ripple of positive change for our agricultural future.
                Seamlessly linking farmers to buyers.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" style={{ width: 'fit-content', padding: '16px 40px', fontSize: '1.1rem' }}>
                    Our Approach
                </button>

                {/* Integrated Social Login */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 600 }}>Or continue with:</span>
                    <div className="social-icons-row" style={{ marginTop: 0 }}>
                        <div className="icon-box" onClick={() => handleSocialLogin('Facebook')} style={{ width: 40, height: 40, borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                            <Facebook size={20} />
                        </div>
                        <div className="icon-box" onClick={() => handleSocialLogin('Instagram')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                            <Instagram size={20} />
                        </div>
                        <div className="icon-box" onClick={() => handleSocialLogin('Google')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="features-container" style={{ marginTop: '2.5rem' }}>
                <div className="feature-card">
                    <div className="feature-icon-box" style={{ background: '#E6FFFA' }}>
                        <ShoppingBag color="#2F855A" size={32} />
                    </div>
                    <h3>Market Access</h3>
                    <p>Direct farmer-to-buyer connection.</p>
                </div>
                <div className="feature-card large">
                    <div className="feature-icon-box" style={{ background: '#C6F6D5' }}>
                         <Leaf color="#22543D" size={32} />
                    </div>
                    <h3>Sustainable</h3>
                    <p>Eco-friendly farming practices.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-box" style={{ background: '#E6FFFA' }}>
                        <Users color="#2F855A" size={32} />
                    </div>
                    <h3>Community</h3>
                    <p>Grow together with local support.</p>
                </div>
            </div>
        </div>

        {/* Background Image Container */}
        <div className="hero-image-container">
            <img src={splashBg} alt="Background" className="hero-img" />
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(90deg, #F0FFF4 0%, rgba(240, 255, 244, 0.8) 20%, rgba(240, 255, 244, 0) 100%)' 
            }}></div>
        </div>
      </div>

    </div>
  );
};

export default Welcome;
