import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import splashBg from '../assets/splash-bg.jpg';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Image with Opacity */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${splashBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6, // Reduced opacity as requested
          zIndex: 0
        }}
      />
      
      {/* Content Overlay */}
      <div className="splash-border" style={{ position: 'relative', zIndex: 1, border: 'none' }}>
        <div style={{ marginBottom: 'auto', marginTop: 'auto', textAlign: 'center' }}>
            <h1 className="title-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#000', textShadow: 'none' }}>
                AgriBridge
            </h1>
            <p className="subtitle-text" style={{ color: '#333' }}>SRI LANKA</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
