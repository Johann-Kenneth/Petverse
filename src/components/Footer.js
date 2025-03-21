import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Petverse</h4>
          <p>Providing top-notch pet care services.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/service-details">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@Petverse.com</p>
          <p>Phone: +91 9745882509</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Petverse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;