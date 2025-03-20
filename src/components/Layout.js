// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Adjust the import path to your Navbar component
import Footer from './Footer'; // Adjust the import path to your Footer component
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the import path to your firebase config

const Layout = ({ children, userName }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(userName || 'Guest');

  // Update display name if userName prop changes
  useEffect(() => {
    setDisplayName(userName || 'Guest');
  }, [userName]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear browser storage to prevent Google session caching
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      navigate('/signin'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <Navbar
        userName={displayName}
        onLogout={handleLogout} // Pass the logout handler to Navbar
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;