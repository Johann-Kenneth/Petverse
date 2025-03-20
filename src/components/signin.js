import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './authStyles.css';
import googleLogo from './images/google_logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User already signed in:', user.uid);
        // Redirect to sign-in page if already authenticated to enforce manual sign-in
        navigate('/dashboard', { replace: true });
      } else {
        console.log('No user signed in');
        setInfoMessage('Please sign in to continue.');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          name: 'No name provided',
          email: user.email,
          bio: '',
          profilePic: ''
        },
        { merge: true }
      );

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Email Sign-In Error:', err);
      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setInfoMessage('');
    try {
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          name: user.displayName || 'No name provided',
          email: user.email,
          bio: '',
          profilePic: user.photoURL || ''
        },
        { merge: true }
      );

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError(`Failed to sign in with Google: ${err.message}`);
    }
  };

  return (
    <div className="auth-container pet-theme">
      <video autoPlay muted loop className="auth-video">
        <source src="./videos/signin-video.mp4" type="video/mp4" />
        <p>Your browser does not support the video tag. If you see this, the video may not be loading due to a path issue.</p>
      </video>
      <div className="auth-overlay"></div>
      <div className="auth-card slide-in">
        <h2>Sign In</h2>
        {infoMessage && <p style={{ color: 'blue', textAlign: 'center', marginBottom: '15px' }}>{infoMessage}</p>}
        <form onSubmit={handleEmailSignIn}>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" style={{ display: 'block', width: '100%' }}>
            Sign In
          </button>
        </form>
        <button
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '10px' }}
        >
          <img src={googleLogo} alt="Google Logo" className="google-logo" />
          Sign in with Google
        </button>
        <p style={{ marginTop: '10px' }}>
          Don't have an account?{' '}
          <span className="signup-link" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;