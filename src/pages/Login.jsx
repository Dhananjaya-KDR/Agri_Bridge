import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username) {
        setError("Username is required");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }) // Password sent but ignored by simple backend
        });

        const data = await response.json();

        if (response.ok) {
            // Simple role based redirect for demo
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.role === 'farmer') {
                navigate('/farmer-panel');
            } else {
                navigate('/buyer-panel');
            }
        } else {
            setError(data.error || "Login failed");
        }
    } catch (err) {
        console.error("Login Error:", err);
        setError("Network error. Ensure backend is running.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="title-text" style={{ fontSize: '3rem', marginBottom: '3rem', textShadow: '0 4px 4px rgba(0,0,0,0.3)' }}>
        LOG IN
      </h1>

      <div className="flex-col gap-4">
        <input 
            type="text" 
            placeholder="User name" 
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', width: '200px' }}
            onClick={handleLogin}
        >
            Log in
        </button>
      </div>
    </div>
  );
};

export default Login;
