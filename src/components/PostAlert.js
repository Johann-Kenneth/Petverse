import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Import Firestore
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore"; // Firestore methods
import Navbar from './Navbar';
import "./PostAlert.css";
import postAlertVideo from './videos/post-alert-video.mp4'
const PostAlert = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("missing");
  const [userId, setUserId] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollDirection, setScrollDirection] = useState('down');
  const [uploading, setUploading] = useState(false);

  // Sample user testimonials
  const userTestimonials = [
    { user: 'Sarah M.', service: 'Report Lost Pet', rating: 4.9, comment: 'Posting an alert on Petverse helped me find my dog within 24 hours!' },
    { user: 'John P.', service: 'Report Lost Pet', rating: 4.7, comment: 'The community support was amazing. Thank you, Petverse!' },
    { user: 'Emily R.', service: 'Report Lost Pet', rating: 4.5, comment: 'The process was so simple, and I got quick responses.' },
    { user: 'Michael T.', service: 'Report Lost Pet', rating: 4.8, comment: 'Highly recommend using Petverse to report a missing pet!' },
    { user: 'Anna L.', service: 'Report Lost Pet', rating: 4.6, comment: 'Found my cat thanks to the Petverse community alert system!' },
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % userTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [userTestimonials.length]);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollDirection(scrollTop > lastScrollTop ? 'down' : 'up');
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

      const sections = document.querySelectorAll('.animate-on-scroll');
      const newVisibleSections = {};
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        newVisibleSections[section.id] = isVisible;
        if (isVisible) {
          section.classList.add('visible');
        }
      });
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePost = async () => {
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    if (!userId) {
      alert("You must be signed in to post an alert");
      return;
    }

    setUploading(true);

    try {
      // Save the pet alert to Firestore
      await addDoc(collection(db, "petAlerts"), {
        title,
        description,
        status,
        userId,
        timestamp: new Date(), // Add timestamp for sorting
      });

      alert("Pet alert posted successfully!");
      setUploading(false);
      navigate("/missing-pets");
    } catch (error) {
      console.error("Error posting alert:", error);
      alert("An error occurred. Please try again.");
      setUploading(false);
    }
  };

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

  const handleScrollToForm = () => {
    const formSection = document.querySelector('.service-description');
    if (formSection) {
      const navbarHeight = 60; // Adjust based on your navbar height
      const offsetTop = formSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="post-alert-container">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section animate-on-scroll" id="hero-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={postAlertVideo} type="video/mp4" />
          <img
            src="/fallback-image.jpg"
            alt="Fallback for video"
            className="hero-fallback"
          />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>We’re Here to Help Find Your Missing Pet</h1>
          <p className="hero-description">
            Losing a pet is heartbreaking, but you’re not alone. Petverse’s alert system connects you with a caring community to help bring your pet home. Share details below, and let’s get started.
          </p>
          <button className="hero-cta-btn" onClick={handleScrollToForm}>
            Report Now <span>▶</span>
          </button>
        </div>
      </section>

      <div className="content-wrapper">
        <main className="main-content">
          <section className="service-description animate-on-scroll" id="form-section">
            <h2>Report a Missing Pet</h2>
            <p>
              Use Petverse to report your lost pet and connect with a community ready to help. Provide details like a description and location to increase your chances of a reunion.
            </p>
            <div className="alert-form-container">
              <div className="alert-step">
                <h3>Step 1: Enter Pet Details</h3>
                <input
                  className="alert-input"
                  type="text"
                  placeholder="Pet Name or Alert Title (e.g., Missing Dog - Max)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="alert-textarea"
                  placeholder="Description (e.g., Last seen near Central Park, brown fur, blue collar)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                className="alert-button"
                onClick={handlePost}
                disabled={uploading}
              >
                {uploading ? "Posting..." : "Submit Alert"}
              </button>
            </div>

            {/* Benefits */}
            <div className="service-benefits">
              <h3>Why Use Petverse to Report?</h3>
              <ul>
                <li>Instant community alerts for faster searches.</li>
                <li>Support from pet lovers across your area.</li>
                <li>Track responses in real-time.</li>
                <li>Free to use with a dedicated support team.</li>
              </ul>
            </div>

            {/* Tips */}
            <div className="service-tips">
              <h3>Tips for Success</h3>
              <ul>
                <li>Include unique identifiers (e.g., collar, markings).</li>
                <li>Check back often for community updates.</li>
                <li>Share the alert on social media for wider reach.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works-section animate-on-scroll" id="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-grid">
          <div className="how-it-works-card">
            <h3>1. Fill Out the Form</h3>
            <p>Add your pet’s details, including name and description to create an alert.</p>
          </div>
          <div className="how-it-works-card">
            <h3>2. Alert the Community</h3>
            <p>Your alert is instantly shared with the Petverse community in your area.</p>
          </div>
          <div className="how-it-works-card">
            <h3>3. Receive Updates</h3>
            <p>Get notified if someone spots your pet or has information to share.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section animate-on-scroll" id="testimonial-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className={`testimonial-card ${visibleSections['testimonial-section'] ? 'fade-in-up' : ''}`}>
          <p>"I posted an alert for my missing cat, and within hours, someone from the Petverse community spotted her! Thank you!"</p>
          <span>- Lisa K. <span className="rating-value">(4.8/5)</span></span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section animate-on-scroll" id="faq-section">
        <h2 className="post-section-title">Frequently Asked Questions</h2>
        <div className={`faq-content ${visibleSections['faq-section'] ? 'fade-in-up' : ''}`}>
          <details>
            <summary>How soon will my alert be visible?</summary>
            <p>Your alert will be visible to the Petverse community immediately after posting.</p>
          </details>
          <details>
            <summary>Can I update my alert if I get new information?</summary>
            <p>Yes, you can edit your alert from your account dashboard at any time.</p>
          </details>
          <details>
            <summary>What happens after I post an alert?</summary>
            <p>The Petverse community will be notified, and you’ll receive updates if someone spots your pet.</p>
          </details>
          <details>
            <summary>Is there a cost to post an alert?</summary>
            <p>No, posting an alert on Petverse is completely free!</p>
          </details>
        </div>
      </section>

      {/* Additional Tips Section */}
      <section className="additional-tips-section animate-on-scroll" id="additional-tips-section">
        <h2 className="section-title">Additional Tips to Find Your Pet</h2>
        <div className="tips-content">
          <ul>
            <li><strong>Contact Local Shelters:</strong> Check with nearby shelters and vet clinics regularly.</li>
            <li><strong>Post Flyers:</strong> Create and distribute flyers in your neighborhood with your pet’s photo.</li>
            <li><strong>Use Social Media:</strong> Share your Petverse alert on platforms like Facebook and Instagram.</li>
            <li><strong>Stay Hopeful:</strong> Many pets are found weeks or even months later—don’t give up!</li>
          </ul>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner animate-on-scroll" id="cta-section">
        <div className={`cta-content ${visibleSections['cta-section'] ? 'fade-in-up' : ''}`}>
          <h2>Need More Help?</h2>
          <p>Contact our support team or explore other services to care for your pet.</p>
          <button className="cta-btn" onClick={() => navigate('/contact')}>
            Contact Support
          </button>
        </div>
      </section>

      {/* User Ratings Section */}
      <section className="user-ratings-section animate-on-scroll" id="ratings-section">
        <h2 className="post-section-title">User Ratings</h2>
        <div className={`testimonial-carousel ${visibleSections['ratings-section'] ? 'fade-in-up' : ''}`}>
          <div key={currentTestimonialIndex} className="testimonial-slide slide-in-out">
            <div className="rating-card">
              <h4>{userTestimonials[currentTestimonialIndex].user}</h4>
              <p className="service-name">Service: {userTestimonials[currentTestimonialIndex].service}</p>
              {renderStars(userTestimonials[currentTestimonialIndex].rating)}
              <p>{userTestimonials[currentTestimonialIndex].comment}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Support Section */}
      <section className="community-support-section animate-on-scroll" id="community-support-section">
        <h2 className="section-title">Join Our Supportive Community</h2>
        <p>
          At Petverse, we believe in the power of community. By posting an alert, you’re joining thousands of pet lovers who are ready to help you find your missing pet. Together, we can make a difference.
        </p>
        <button className="community-btn" onClick={() => navigate('/missing-pets')}>
          See Missing Pets
        </button>
      </section>
    </div>
  );
};

export default PostAlert;