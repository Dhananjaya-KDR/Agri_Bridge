import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'buyer', // Default role for now, in real app maybe select it?
      location: '',
      contact: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
      if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
      }

      try {
          // Register user
          const response = await fetch('http://localhost:5000/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  name: formData.username,
                  email: formData.email,
                  role: formData.role, // You might want to add a selector UI for this
                  location: 'Sri Lanka', // Default or add input
                  contact: ''
              })
          });

          if (response.ok) {
              navigate('/login');
          } else {
              const data = await response.json();
              setError(data.error || "Registration failed");
          }
      } catch (err) {
          console.error("Signup Error:", err);
          setError("Network error");
      }
  };

  return (
    <div className="page-container">
      <h1 className="title-text" style={{ fontSize: '3rem', marginBottom: '2rem', textShadow: '0 4px 4px rgba(0,0,0,0.3)' }}>
        Sign up
      </h1>

      <div className="flex-col gap-4">
        <input 
            name="email"
            type="email" 
            placeholder="email" 
            className="input-field"
            value={formData.email}
            onChange={handleChange}
        />
        <input 
            name="username"
            type="text" 
            placeholder="User name" 
            className="input-field"
            value={formData.username}
            onChange={handleChange}
        />
        <input 
            name="password"
            type="password" 
            placeholder="New password" 
            className="input-field"
            value={formData.password}
            onChange={handleChange}
        />
        <input 
            name="confirmPassword"
            type="password" 
            placeholder="Conform password" 
            className="input-field"
            value={formData.confirmPassword}
            onChange={handleChange}
        />

        {/* Hidden Role Selector for now (or add UI if needed) */}
        <select 
            name="role" 
            className="input-field" 
            value={formData.role} 
            onChange={handleChange}
            style={{ color: '#555' }}
        >
            <option value="buyer">Buyer</option>
            <option value="farmer">Farmer</option>
        </select>

        {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

        <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', width: '200px' }}
            onClick={handleSignup}
        >
            Sign in
        </button>
      </div>
    </div>
  );
};

export default Signup;
