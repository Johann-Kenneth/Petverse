// src/components/PetFoodRecommendation.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateContent } from '../utils/geminiConfig';
import './PetFoodRecommendation.css';

const PetFoodRecommendation = () => {
  const [petData, setPetData] = useState({
    petType: '',
    breed: '',
    age: '',
    size: '',
    activityLevel: '',
    healthConditions: '',
  });
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const content = {
    title: 'Pet Food Recommendation',
    description:
      'Unlock the secret to your pet’s optimal health with Petverse’s personalized food recommendation service. By analyzing your pet’s age, breed, size, activity level, and health conditions, our advanced system provides tailored dietary suggestions, including dry kibble, wet food, or raw diets, from trusted brands. Whether your pet needs a high-energy diet or a sensitive stomach solution, we’re here to guide you every step of the way!',
    backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1606923828922-8a55d098e7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    rating: 4.7,
    reviews: 90,
    benefits: [
      'Receive tailored food suggestions based on your pet’s specific profile.',
      'Explore a variety of diet types, including kibble, wet food, and raw diets.',
      'Access recommendations from a wide range of trusted brands.',
      'Get dietary tips to improve your pet’s health and energy levels.',
      'Enjoy a user-friendly process with quick, personalized results.',
    ],
    tips: [
      'Provide accurate details about your pet for the best recommendations.',
      'Consult your vet to align suggestions with your pet’s health plan.',
      'Introduce new food gradually to avoid digestive issues.',
      'Monitor your pet’s reaction to new diets and adjust as needed.',
      'Check for brand availability at local pet stores or online.',
    ],
  };

  const userTestimonials = [
    { user: 'Lisa K.', rating: 4.7, comment: 'The food recommendations transformed my dog’s health—perfectly tailored!' },
    { user: 'David R.', rating: 4.6, comment: 'My cat loves the wet food suggested by Petverse—great service!' },
    { user: 'Emma S.', rating: 4.8, comment: 'The tips helped me choose the right diet for my active puppy.' },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission with Gemini API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation('');

    const prompt = `
      Provide a detailed pet food recommendation for a pet with the following characteristics:
      - Pet Type: ${petData.petType || 'Not specified'}
      - Breed: ${petData.breed || 'Not specified'}
      - Age: ${petData.age || 'Not specified'}
      - Size: ${petData.size || 'Not specified'}
      - Activity Level: ${petData.activityLevel || 'Not specified'}
      - Health Conditions: ${petData.healthConditions || 'None'}
      
      Suggest specific types of food (e.g., dry kibble, wet food, raw diet), brands, and any additional dietary tips. Ensure the recommendation is tailored to the pet's needs, considering its age, breed, size, activity level, and health conditions. Do not apply any strict constraints or filters on the recommendations.
    `;

    try {
      const response = await generateContent(prompt);
      setRecommendation(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % userTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [userTestimonials.length]);

  // Scroll animation with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = {};
        entries.forEach((entry) => {
          newVisibleSections[entry.target.id] = entry.isIntersecting;
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
        setVisibleSections(newVisibleSections);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return (
      <div className="rating">
        {stars} <span className="rating-value">({rating}/5)</span>
      </div>
    );
  };

  // Parse recommendation text into structured components
  const renderRecommendation = (text) => {
    if (!text) return null;

    // Split the text into sections based on headings (##)
    const sections = text.split('##').filter((section) => section.trim() !== '');

    return sections.map((section, index) => {
      const lines = section.trim().split('\n').filter((line) => line.trim() !== '');
      const heading = index === 0 ? lines[0] : lines.shift(); // First section has no ## prefix

      // Process the remaining lines into paragraphs, lists, or subheadings
      const content = [];
      let currentList = null;

      lines.forEach((line, lineIndex) => {
        // Handle subheadings (e.g., **Dietary Needs:**, **Food Type Options:**)
        if (line.startsWith('**') && line.endsWith(':**')) {
          const subheading = line.replace(/\*\*/g, '').replace(':', '');
          content.push(<h4 key={`subheading-${lineIndex}`}>{subheading}</h4>);
          currentList = null; // Reset list if we're starting a new subheading
        }
        // Handle bullet points (e.g., * Brand Suggestions:)
        else if (line.startsWith('*')) {
          const cleanedLine = line.replace('*', '').trim();
          if (cleanedLine.endsWith(':')) {
            // If the bullet point is a sub-subheading (e.g., * Brand Suggestions:)
            content.push(<h5 key={`sub-subheading-${lineIndex}`}>{cleanedLine.replace(':', '')}</h5>);
            currentList = [];
          } else {
            // If it's a regular bullet point (e.g., * Orijen Large Breed Puppy:)
            if (!currentList) {
              currentList = [];
            }
            currentList.push(cleanedLine);
          }
        }
        // Handle paragraphs
        else {
          if (currentList) {
            // If we were building a list, push it before starting a new paragraph
            content.push(
              <ul key={`list-${lineIndex}`}>
                {currentList.map((item, i) => (
                  <li key={`item-${i}`}>{item}</li>
                ))}
              </ul>
            );
            currentList = null;
          }
          content.push(<p key={`paragraph-${lineIndex}`}>{line}</p>);
        }
      });

      // Push any remaining list
      if (currentList) {
        content.push(
          <ul key={`list-final`}>
            {currentList.map((item, i) => (
              <li key={`item-${i}`}>{item}</li>
            ))}
          </ul>
        );
      }

      return (
        <div key={`section-${index}`} className="recommendation-section">
          {heading && <h3>{heading}</h3>}
          {content}
        </div>
      );
    });
  };

  return (
    <div className="recommendation-container">
      {/* Top Banner with Background Video */}
      <section className="banner-section animate-on-scroll fade-in" id="banner-section">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="rec-banner-video"
          poster={content.fallbackImage}
        >
          <source src='/videos/pet-food-recommendation.mp4' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="rec-banner-content">
          <h1 className="banner-title">Welcome to {content.title}</h1>
          <p className="banner-description">
            Discover the perfect diet for your pet with tailored recommendations. Let’s get started!
          </p>
          <button className="banner-cta-btn slide-in-right" onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })}>
            Get Started
          </button>
        </div>
      </section>

      <div className="content-wrapper">
        <main className="main-content">
          <section className="service-description animate-on-scroll fade-in-up" id="form-section">
            <h2>{content.title}</h2>
            {renderStars(content.rating)}
            <p className="reviews">Based on {content.reviews} reviews</p>
            <p className="service-main-description">{content.description}</p>
            {content.benefits.length > 0 && (
              <div className="service-benefits">
                <h3>Why Choose This Service?</h3>
                <ul>
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.tips.length > 0 && (
              <div className="service-tips">
                <h3>Tips for Best Results</h3>
                <ul>
                  {content.tips.map((tip, index) => (
                    <li key={index} className="tip-item">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation Form */}
            <div className="recommendation-form-section">
              <h3>Get Your Recommendation</h3>
              <form className="recommendation-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="petType">Pet Type (e.g., Dog, Cat)</label>
                  <input
                    type="text"
                    id="petType"
                    name="petType"
                    value={petData.petType}
                    onChange={handleInputChange}
                    placeholder="e.g., Dog"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="breed">Breed</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={petData.breed}
                    onChange={handleInputChange}
                    placeholder="e.g., Labrador Retriever"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age (e.g., 2 years, 6 months)</label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={petData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="size">Size (e.g., Small, Medium, Large)</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={petData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., Medium"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="activityLevel">Activity Level (e.g., Low, Moderate, High)</label>
                  <input
                    type="text"
                    id="activityLevel"
                    name="activityLevel"
                    value={petData.activityLevel}
                    onChange={handleInputChange}
                    placeholder="e.g., Moderate"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="healthConditions">Health Conditions (e.g., Allergies, Obesity)</label>
                  <input
                    type="text"
                    id="healthConditions"
                    name="healthConditions"
                    value={petData.healthConditions}
                    onChange={handleInputChange}
                    placeholder="e.g., Allergies"
                  />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Generating Recommendation...' : 'Get Recommendation'}
                </button>
              </form>
              {loading && (
                <div className="loading-paw">
                  <div className="paw-print">🐾</div>
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
              {recommendation && (
                <div className="recommendation-result">
                  <h3>Your Recommendation</h3>
                  {renderRecommendation(recommendation)}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <section className="testimonial-section animate-on-scroll fade-in" id="testimonial-section">
        <h2 className="section-title scale-in">What Our Customers Say</h2>
        <div className="testimonial-card">
          <p>{userTestimonials[currentTestimonialIndex].comment}</p>
          <span>
            - {userTestimonials[currentTestimonialIndex].user} <span className="rating-value">({userTestimonials[currentTestimonialIndex].rating}/5)</span>
          </span>
        </div>
      </section>

      <section className="faq-section animate-on-scroll fade-in-up" id="faq-section">
        <h2 className="service-section-title scale-in">Frequently Asked Questions</h2>
        <div className="faq-content">
          <details>
            <summary>How does the recommendation process work?</summary>
            <p>Enter your pet’s details, and our system uses advanced algorithms to suggest personalized food options based on breed, age, and health needs.</p>
          </details>
          <details>
            <summary>Can I get recommendations for multiple pets?</summary>
            <p>Yes, you can submit details for each pet separately to receive individualized recommendations.</p>
          </details>
          <details>
            <summary>Are the recommended brands available locally?</summary>
            <p>We suggest popular brands, but availability may vary. Check with local pet stores or online retailers.</p>
          </details>
        </div>
      </section>

      <section className="cta-banner animate-on-scroll fade-in" id="cta-section">
        <div className="cta-content">
          <h2 className="section-title scale-in">Ready to Nourish Your Pet?</h2>
          <p>Explore more pet care services and join the Petverse community today!</p>
          <Link to="/service-details" className="cta-btn slide-in-right">
            Explore Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PetFoodRecommendation;