import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShoppingBag, Users, Truck, ShieldCheck, BarChart3, Sprout } from 'lucide-react';
import splashBg from '../assets/splash-bg.jpg';

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ background: '#C6F6D5', minHeight: '100vh' }}>
      
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
          <span className="nav-link active" style={{ color: '#2F855A', fontWeight: 'bold' }}>Features</span>
          <span className="nav-link" onClick={() => navigate('/contact')}>Contact</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Join Us</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" style={{ paddingBottom: '2rem' }}>
        <div className="hero-content" style={{ marginTop: '5rem', zIndex: 2, position: 'relative' }}>
            <h1 className="title-text">
                Platform Features
            </h1>
            <p className="subtitle-text" style={{ maxWidth: '700px' }}>
                Discover how AgriBridge empowers farmers and buyers with cutting-edge tools for a seamless agricultural ecosystem.
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
                background: 'linear-gradient(180deg, #C6F6D5 0%, rgba(198, 246, 213, 0.8) 50%, #C6F6D5 100%)' 
            }}></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container" style={{ padding: '0 2rem 4rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Feature 1 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#E6FFFA', marginBottom: '1rem' }}>
                    <ShoppingBag color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Direct Marketplace</h3>
                <p style={{ color: '#4A5568' }}>Sell produce directly to buyers without intermediaries. Set your own prices and manage your inventory with ease.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#F0FFF4', marginBottom: '1rem' }}>
                    <Truck color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Logistics Support</h3>
                <p style={{ color: '#4A5568' }}>Integrated logistics solutions to ensure your produce reaches the buyer fresh and on time. Real-time tracking available.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#EBF8FF', marginBottom: '1rem' }}>
                    <ShieldCheck color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Secure Payments</h3>
                <p style={{ color: '#4A5568' }}>Fast and secure payment processing. Multiple payment options supported for convenience and trust.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#FFF5F5', marginBottom: '1rem' }}>
                    <BarChart3 color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Market Insights</h3>
                <p style={{ color: '#4A5568' }}>Access real-time market data and price trends to make informed decisions about what to plant and when to sell.</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#FFFFF0', marginBottom: '1rem' }}>
                    <Users color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Community Forum</h3>
                <p style={{ color: '#4A5568' }}>Connect with other farmers, share knowledge, ask questions, and build a supportive agricultural community.</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
                <div className="feature-icon-box" style={{ background: '#F7FAFC', marginBottom: '1rem' }}>
                    <Sprout color="#2F855A" size={28} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Sustainable Practices</h3>
                <p style={{ color: '#4A5568' }}>Resources and guides on eco-friendly farming techniques to help you grow sustainably and responsibly.</p>
            </div>

        </div>

        {/* CTA Section */}
        <div style={{ background: '#2F855A', borderRadius: '20px', padding: '3rem', marginTop: '4rem', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Grow with Us?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.9 }}>
                Join thousands of farmers and buyers already transforming their business with AgriBridge.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/signup')} style={{ background: 'white', color: '#2F855A' }}>
                    Get Started Free
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/contact')} style={{ background: 'transparent', border: '2px solid white' }}>
                    Contact Sales
                </button>
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

export default Features;
