import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './authStyles.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Monitor auth state and redirect to dashboard only if user is authenticated and not signing up
  useEffect(() => {
    let unsubscribe;
    const checkAuthState = () => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        // Only redirect to dashboard if user is authenticated and not on the signup page during sign-up process
        if (user && !window.location.pathname.startsWith('/signup')) {
          navigate('/dashboard', { replace: true });
        }
      });
    };

    checkAuthState();
    return () => unsubscribe && unsubscribe(); // Cleanup subscription
  }, [navigate]);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Account created successfully!');
        navigate('/signin', { replace: true }); // Redirect to sign-in page after successful sign-up
      })
      .catch((error) => {
        setError(error.message); // Set error message instead of alert for better UX
      });
  };

  return (
    <div className="auth-container pet-theme">
      <video autoPlay muted loop className="auth-video">
        <source src="./videos/signin-video.mp4" type="video/mp4" />
        <p>Your browser does not support the video tag. If you see this, the video may not be loading due to a path issue.</p>
      </video>
      <div className="auth-overlay"></div>
      <div className="auth-card slide-in">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="styled-input"
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="styled-input"
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="styled-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" style={{ display: 'block', width: '100%' }}>
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '10px' }}>
          Already a member?{' '}
          <span className="signup-link" onClick={() => navigate('/signin')}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;