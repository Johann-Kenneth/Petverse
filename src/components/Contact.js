import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailCache, setEmailCache] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = async (email, maxRetries = 3) => {
    const apiKey = '5de1948291f5446eab7955da36c1df3f';
    console.log('Validating email:', email, 'with API Key:', apiKey);
    if (emailCache[email]) return emailCache[email];

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
        );
        if (!response.ok) {
          console.log(`Attempt ${attempt} failed with status: ${response.status}`);
          if (response.status === 429 && attempt < maxRetries) {
            const retryAfter = response.headers.get('Retry-After') || 5;
            console.log(`Rate limit hit. Retrying after ${retryAfter} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
            continue;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Abstract API Full Response:', data);
        const isValid = data.deliverability === 'DELIVERABLE' ||
                        (data.is_valid_format && !data.is_disposable_email);
        setEmailCache((prev) => ({ ...prev, [email]: isValid }));
        return isValid;
      } catch (error) {
        console.error('Email validation error:', error.message);
        if (attempt === maxRetries) return false;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus('');

    const isEmailValid = await validateEmail(formData.email);
    if (!isEmailValid) {
      setFormStatus('Invalid email address. Please use a valid email.');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    const web3formsAccessKey = 'f52156e4-e240-446a-8e52-846482b1135c';
    formDataToSend.append('access_key', web3formsAccessKey);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('message', formData.message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (data.success) {
        setFormStatus('Thank you for your message! We’ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('Failed to send message. Please try again later.');
        console.error('Web3Forms error:', data);
      }
    } catch (error) {
      setFormStatus('An error occurred. Please try again later.');
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setFormStatus(''), 5000);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Petverse</h1>
      <p className="contact-intro">
        We’re here to help you with any questions, concerns, or feedback. Reach out to us through the options below.
      </p>

      {/* Contact Us Section */}
      <section id="contact-us" className="contact-section">
        <h2>Contact Us</h2>
        <p>
          Have a question or need assistance? Our team is ready to support you with all your pet-related needs.
        </p>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <p><strong>Email:</strong> <a href="mailto:support@petverse.com">petverse7@gmail.com</a></p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <p><strong>Phone:</strong> +91 9745882509</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">⏰</span>
            <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM (EST)</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="contact-section">
        <h2>Send Us a Message</h2>
        <p>
          Fill out the form below, and we’ll get back to you as soon as possible.
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Your Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Your Message"
              rows="5"
            />
          </div>
          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
          {formStatus && <p className="form-status">{formStatus}</p>}
        </form>
      </section>

      {/* Support Section */}
      <section id="support" className="contact-section">
        <h2>Support</h2>
        <p>
          Find answers to common questions or get personalized help by submitting a support ticket.
        </p>
        <div className="support-content">
          <div className="support-faq">
            <h3>Frequently Asked Questions</h3>
            <ul>
              <li>
                <strong>How do I report a missing pet?</strong><br />
                Visit our <a href="/missing-pets">Missing Pets</a> page, sign in, and fill out the form with your pet’s details.
              </li>
              <li>
                <strong>What should I do if I find a lost pet?</strong><br />
                Check for a collar or microchip, then post on Petverse to help find the owner.
              </li>
              <li>
                <strong>How can I volunteer with Petverse?</strong><br />
                Email us at <a href="mailto:volunteer@petverse.com">volunteer@petverse.com</a> to learn about opportunities.
              </li>
              <li>
                <strong>How do I update my account information?</strong><br />
                Go to your <a href="/profile">Profile</a> page and edit your details.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="contact-section">
        <h2>Locations</h2>
        <p>
          Petverse operates in multiple regions to support pet owners across the country. Visit us at one of our offices:
        </p>
        <div className="locations-grid">
          <div className="location-item">
            <h3>Coimbatore, CBE</h3>
            <p>Saravanampatti<br />Coimbatore</p>
            <p><strong>Phone:</strong> +91 9055878120</p>
          </div>
          <div className="location-item">
            <h3>Palakkad, PKD </h3>
            <p>Ottapalam<br />Palakkad</p>
            <p><strong>Phone:</strong> +91 9855772887</p>
          </div>
          <div className="location-item">
            <h3>Kochi, COK</h3>
            <p>Fort Kochi<br />Ernakulam</p>
            <p><strong>Phone:</strong> +91 7839478388</p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section id="social-media" className="contact-section">
        <h2>Connect With Us</h2>
        <p>
          Follow us on social media for updates, pet tips, and community stories:
        </p>
        <div className="social-links">
          <a href="https://twitter.com/petverse" target="_blank" rel="noopener noreferrer" className="social-link">
            🐦 Twitter
          </a>
          <a href="https://facebook.com/petverse" target="_blank" rel="noopener noreferrer" className="social-link">
            📘 Facebook
          </a>
          <a href="https://instagram.com/petverse" target="_blank" rel="noopener noreferrer" className="social-link">
            📸 Instagram
          </a>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Join the Petverse Community</h2>
        <p>
          Sign up today to access our tools, connect with pet lovers, and help pets in need.
        </p>
        <a href="/signup" className="cta-button">Get Started</a>
      </section>
    </div>
  );
};

export default Contact;