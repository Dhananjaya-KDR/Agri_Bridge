import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Send } from 'lucide-react';
import splashBg from '../assets/splash-bg.jpg';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-container" style={{ background: '#F0FFF4', minHeight: '100vh' }}>
      
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/welcome')}>
            <div style={{ background: '#2F855A', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <Leaf color="white" size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2F855A' }}>AgriBridge</span>
        </div>

        <div className="nav-links" style={{ display: 'flex' }}> 
          <span className="nav-link" onClick={() => navigate('/welcome')}>Home</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About Us</span>
          <span className="nav-link" onClick={() => navigate('/features')} style={{ cursor: 'pointer' }}>Features</span>
          <span className="nav-link active" style={{ color: '#2F855A', fontWeight: 'bold' }}>Contact</span>
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
                Get in Touch
            </h1>
            <p className="subtitle-text" style={{ maxWidth: '700px' }}>
                Have questions, suggestions, or just want to say hello? We'd love to hear from you.
            </p>
        </div>

        {/* Background Overlay */}
        <div className="hero-image-container" style={{ height: '50vh' }}>
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

      {/* Content Section */}
      <div className="container" style={{ padding: '0 2rem 4rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3, marginTop: '-5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="feature-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '1.5rem', textAlign: 'left', padding: '1.5rem' }}>
                    <div className="feature-icon-box" style={{ background: '#E6FFFA', margin: 0 }}>
                        <Mail color="#2F855A" size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Email Us</h3>
                        <p style={{ margin: 0, color: '#4A5568' }}>support@agribridge.com</p>
                    </div>
                </div>

                <div className="feature-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '1.5rem', textAlign: 'left', padding: '1.5rem' }}>
                    <div className="feature-icon-box" style={{ background: '#E6FFFA', margin: 0 }}>
                        <Phone color="#2F855A" size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Call Us</h3>
                        <p style={{ margin: 0, color: '#4A5568' }}>+1 (555) 123-4567</p>
                    </div>
                </div>

                <div className="feature-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '1.5rem', textAlign: 'left', padding: '1.5rem' }}>
                    <div className="feature-icon-box" style={{ background: '#E6FFFA', margin: 0 }}>
                        <MapPin color="#2F855A" size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Visit Us</h3>
                        <p style={{ margin: 0, color: '#4A5568' }}>123 Green Valley Road,<br/>Harvest City, HC 90210</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#2D3748', marginBottom: '1.5rem' }}>Send a Message</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A5568', fontWeight: '500' }}>Your Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1rem', outline: 'none' }} 
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A5568', fontWeight: '500' }}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1rem', outline: 'none' }} 
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A5568', fontWeight: '500' }}>Subject</label>
                        <input 
                            type="text" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1rem', outline: 'none' }} 
                            placeholder="How can we help?"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A5568', fontWeight: '500' }}>Message</label>
                        <textarea 
                            name="message" 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                            rows="4" 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
                            placeholder="Your message here..."
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        Send Message <Send size={18} />
                    </button>
                </form>
            </div>

        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: '#2F855A', color: 'white', padding: '2rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} AgriBridge. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Contact;
