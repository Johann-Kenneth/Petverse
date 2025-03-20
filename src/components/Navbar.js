import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Navbar.css';

const Navbar = ({
  setActiveSection,
  signInModalOpen,
  setSignInModalOpen,
  signUpModalOpen,
  setSignUpModalOpen,
}) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu

  const timeoutRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    setUserData({});
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setUserData({});
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      setUser(null);
      setUserData({});
      setDropdownOpen(false);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownEnter = (dropdownSetter) => {
    clearTimeout(timeoutRefs.current[dropdownSetter]);
    dropdownSetter(true);
  };

  const handleDropdownLeave = (dropdownSetter) => {
    timeoutRefs.current[dropdownSetter] = setTimeout(() => {
      dropdownSetter(false);
    }, 200);
  };

  const handleActionWithAuthCheck = useCallback(
    (path) => {
      if (!user) {
        setSignInModalOpen(true);
      } else {
        navigate(path);
      }
      setMobileMenuOpen(false); // Close mobile menu on navigation
    },
    [navigate, user, setSignInModalOpen]
  );

  const handleServiceClick = () => {
    handleActionWithAuthCheck('/service-details');
    setServicesDropdownOpen(false);
  };

  const handleAboutClick = (section) => {
    handleActionWithAuthCheck(`/about?section=${section}`);
    setAboutDropdownOpen(false);
  };

  const handlePagesClick = (section) => {
    handleActionWithAuthCheck(`/pages?section=${section}`);
    setPagesDropdownOpen(false);
  };

  const handleContactClick = (section) => {
    handleActionWithAuthCheck(`/contact?section=${section}`);
    setContactDropdownOpen(false);
  };

  const openSignInModal = () => {
    setSignInModalOpen(true);
    setMobileMenuOpen(false);
  };

  const openSignUpModal = () => {
    setSignUpModalOpen(true);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          Petverse
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className={mobileMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={mobileMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={mobileMenuOpen ? 'bar open' : 'bar'}></span>
        </div>

        <div className={`navbar-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-links">
            <span
              className="nav-link"
              onClick={() => handleActionWithAuthCheck(user ? '/dashboard' : '/signin')}
            >
              Home
            </span>
            <div className="dropdown">
              <div
                className="dropdown-wrapper"
                onMouseEnter={() => handleDropdownEnter(setServicesDropdownOpen)}
                onMouseLeave={() => handleDropdownLeave(setServicesDropdownOpen)}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)} // For mobile touch
              >
                <span className="nav-link dropbtn">Services</span>
                {servicesDropdownOpen && (
                  <div className="dropdown-content">
                    <span onClick={handleServiceClick}>Service Details</span>
                  </div>
                )}
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-wrapper"
                onMouseEnter={() => handleDropdownEnter(setAboutDropdownOpen)}
                onMouseLeave={() => handleDropdownLeave(setAboutDropdownOpen)}
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              >
                <span className="nav-link dropbtn">About</span>
                {aboutDropdownOpen && (
                  <div className="dropdown-content">
                    <span onClick={() => handleAboutClick('our-story')}>Our Story</span>
                    <span onClick={() => handleAboutClick('team')}>Team</span>
                    <span onClick={() => handleAboutClick('mission-vision')}>
                      Mission & Vision
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-wrapper"
                onMouseEnter={() => handleDropdownEnter(setPagesDropdownOpen)}
                onMouseLeave={() => handleDropdownLeave(setPagesDropdownOpen)}
                onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
              >
                <span className="nav-link dropbtn">Pages</span>
                {pagesDropdownOpen && (
                  <div className="dropdown-content">
                    <span onClick={() => handlePagesClick('missing-pets')}>
                      Missing Pets
                    </span>
                    <span onClick={() => handlePagesClick('success-stories')}>
                      Success Stories
                    </span>
                    <span onClick={() => handlePagesClick('resources')}>
                      Resources
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-wrapper"
                onMouseEnter={() => handleDropdownEnter(setContactDropdownOpen)}
                onMouseLeave={() => handleDropdownLeave(setContactDropdownOpen)}
                onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
              >
                <span className="nav-link dropbtn">Contact</span>
                {contactDropdownOpen && (
                  <div className="dropdown-content">
                    <span onClick={() => handleContactClick('contact-us')}>
                      Contact Us
                    </span>
                    <span onClick={() => handleContactClick('support')}>
                      Support
                    </span>
                    <span onClick={() => handleContactClick('locations')}>
                      Locations
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {user ? (
            <div className="profile-menu">
              <div
                className="username-container"
                onClick={toggleDropdown}
                role="button"
                tabIndex="0"
              >
                <div className="card-front">
                  <span className="profile-name">{userData.name || 'User'}</span>
                </div>
                <div className="card-back">
                  <span className="pet-icon">🐾</span>
                </div>
              </div>
              {dropdownOpen && (
                <div className="dropdown-profile">
                  <div className="profile-header">
                    <img
                      src={userData.photoURL || 'https://via.placeholder.com/80'}
                      alt="Profile"
                      className="profile-pic"
                    />
                    <h3 className="profile-name">{userData.name || 'User'}</h3>
                    <p className="profile-bio">{userData.bio || 'No bio provided'}</p>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <span
                        className="profile-link"
                        onClick={() => handleActionWithAuthCheck('/profile')}
                      >
                        View Profile
                      </span>
                    </li>
                    <li>
                      <span
                        className="profile-link"
                        onClick={() => handleActionWithAuthCheck('/settings')}
                      >
                        Settings
                      </span>
                    </li>
                    <li onClick={handleLogout} className="logout-btn">
                      Logout
                    </li>
                  </ul>
                  <div className="social-icons">
                    <a href="#" className="social-link">
                      🐦
                    </a>
                    <a href="#" className="social-link">
                      📘
                    </a>
                    <a href="#" className="social-link">
                      📸
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-message">
              <span className="welcome-text">Welcome, Guest!</span>
              <button className="signin-button" onClick={openSignInModal}>
                Sign In
              </button>
              <button className="signup-button" onClick={openSignUpModal}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  setActiveSection: PropTypes.func,
  signInModalOpen: PropTypes.bool.isRequired,
  setSignInModalOpen: PropTypes.func.isRequired,
  signUpModalOpen: PropTypes.bool.isRequired,
  setSignUpModalOpen: PropTypes.func.isRequired,
};

export default Navbar;