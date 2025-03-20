import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import aboutSectionImage from './images/catAndDog.png';
import mainImg from './images/home.jpg';

const Dashboard = () => {
  const navigate = useNavigate();

  // State for popup visibility and content
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', description: '' });
  const popupRef = useRef(null); // Ref to track popup element

  // Define service paths to match ServiceDetails.js
  const servicePaths = {
    'Nearby Pet Shops': '/service-details',
    'Nearby Doctors': '/service-details',
    'Report Missing Pet': '/service-details',
    'Missing Pets': '/service-details',
    'Training Videos': '/service-details',
    'Pet ID': '/service-details',
    'Pet First Aid Guide ': '/service-details',
    'Pet Names': '/service-details',
    'Find Pets': '/service-details',
    'Find Shelters': '/service-details',
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/signin', { replace: true });
      }
    });
  }, [navigate]);

  const scrollToServices = () => {
    const servicesSection = document.querySelector('.dash-services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Improved scroll animation using Intersection Observer (for other sections)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dash-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.dash-animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // Memoized function to handle "Learn More" click
  const handleLearnMoreClick = useCallback((title, description) => {
    console.log('Attempting to open popup with:', { title, description }); // Debug log
    setPopupContent({ title, description });
    setIsPopupOpen(true); // Directly set to true
  }, []);

  // Effect to ensure popup renders when state changes
  useEffect(() => {
    console.log('Popup state changed to:', isPopupOpen); // Debug log
    if (isPopupOpen) {
      if (popupRef.current) {
        console.log('Popup element is present in DOM:', popupRef.current); // Debug log
        popupRef.current.focus(); // Force focus to ensure visibility
      } else {
        console.warn('Popup element not found in DOM'); // Debug log
      }
    }
  }, [isPopupOpen]);

  // Function to close the popup
  const closePopup = () => {
    console.log('Closing popup'); // Debug log
    setIsPopupOpen(false);
    setPopupContent({ title: '', description: '' });
  };

  // Function to navigate to Service Details
  const navigateToServiceDetails = (title) => {
    console.log('Navigating with popup content:', popupContent); // Debug log
    const path = servicePaths[title] || '/';
    console.log('Navigating to:', path);
    if (path) {
      navigate(path);
      closePopup();
    } else {
      console.error('Navigation failed: Path not found for title', title);
    }
  };

  // Services data
  const services = [
    {
      title: 'Nearby Pet Shops',
      icon: 'https://img.icons8.com/?size=160&id=ms997L51gqVd&format=png',
      description: 'Find the best pet shops near your location.',
      details: 'Discover local pet shops to get supplies, toys, and food for your furry friend. Our feature helps you locate the best shops with ease, ensuring your pet’s needs are met!',
    },
    {
      title: 'Nearby Doctors',
      icon: 'https://img.icons8.com/color/96/000000/veterinarian.png',
      description: 'Locate trusted veterinarians in your area.',
      details: 'Find trusted veterinarians near you for regular checkups or emergencies. Our feature connects you with qualified professionals to keep your pet healthy.',
    },
    {
      title: 'Report Missing Pet',
      icon: 'https://img.icons8.com/color/96/000000/dog-footprint.png',
      description: 'Alert the community if your pet goes missing.',
      details: 'If your pet goes missing, use our platform to alert the community. Share details and photos to increase the chances of finding your beloved companion quickly.',
    },
    {
      title: 'Missing Pets',
      icon: 'https://img.icons8.com/color/96/000000/dog-tag.png',
      description: 'Check our list of reported missing pets.',
      details: 'Browse our list of reported missing pets to help reunite them with their owners. If you spot a missing pet, you can contact the owner directly through our platform.',
    },
    {
      title: 'Training Videos',
      icon: 'https://img.icons8.com/color/96/000000/video-playlist.png',
      description: 'Access videos to train your pet effectively.',
      details: 'Watch our expertly curated training videos to teach your pet new tricks and behaviors. From basic obedience to advanced skills, we’ve got you covered!',
    },
    {
      title: 'Pet ID',
      icon: 'https://img.icons8.com/?size=100&id=106513&format=png',
      description: 'Store all the Medical History of your Pet.',
      details: 'Set up reminders for your pet’s vaccinations to ensure they stay protected. We’ll notify you when it’s time for their next shot, keeping their health on track.',
    },
    {
      title: 'Pet First Aid Guide',
      icon: 'https://img.icons8.com/?size=96&id=81644&format=png',
      description: 'A Perfect guide to rescue your pet in emergencies.',
      details: 'Find local shelters to help pets in need or to surrender a pet responsibly. We provide a list of trusted shelters to ensure pets get the care they deserve.',
    },
    {
      title: 'Pet Names',
      icon: 'https://img.icons8.com/color/96/000000/name.png',
      description: 'Get inspired with unique pet name ideas.',
      details: 'Looking for the perfect name for your new pet? Explore our curated list of unique and creative pet names to find one that suits your furry friend’s personality!',
    },
    {
      title: 'Find Pets',
      icon: 'https://img.icons8.com/color/96/000000/pets.png',
      description: 'Discover adoptable pets in your area.',
      details: 'Looking to adopt a pet? Browse our list of adoptable pets in your area and find your new best friend. We connect you with shelters and foster homes!',
    },
    {
      title: 'Find Shelters',
      icon: 'https://img.icons8.com/color/96/000000/animal-shelter.png',
      description: 'Locate shelters for pets in need.',
      details: 'Find local shelters to help pets in need or to surrender a pet responsibly. We provide a list of trusted shelters to ensure pets get the care they deserve.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const container = document.querySelector('.dash-services-slide');
    container.scrollLeft -= 320; // Adjust based on card width
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
  };

  const handleNext = () => {
    const container = document.querySelector('.dash-services-slide');
    container.scrollLeft += 320; // Adjust based on card width
    setCurrentIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="dash-dashboard-container">
      {/* Hero Section with Slide-In Animation */}
      <section className="dash-hero-section dash-animate-on-scroll dash-slide-in-left">
        <div className="dash-video-container">
          <video autoPlay loop muted playsInline className="dash-hero-video">
            <source src="/videos/home-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            <img src="https://images.pexels.com/photos/1084165/pexels-photo-1084165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
            </video>
        </div>
        <div className="dash-hero-content dash-animate-on-scroll dash-fade-in-scale">
          <h1 className="dash-hero-title">Welcome to Petverse</h1>
          <p className="dash-hero-tagline dash-wave-animation">Comprehensive Care for Your Furry Friends</p>
          <p className="dash-hero-description dash-wave-animation">
            At Petverse, we provide top-notch pet care services to ensure your pets live happy, healthy lives. Explore our offerings today!
          </p>
          <button className="dash-hero-cta-button dash-bounce-in" onClick={scrollToServices}>
            Discover Our Services
          </button>
        </div>
      </section>

      {/* Why Choose Us Section with Fade-In and Scale Animation */}
      <section className="dash-why-choose-section dash-animate-on-scroll dash-fade-in">
        <h2 className="dash-section-title dash-scale-in">Why Choose Petverse?</h2>
        <div className="dash-why-choose-grid">
          <div className="dash-why-choose-card dash-animate-on-scroll dash-slide-in-left">
            <span className="dash-why-choose-icon">🐾</span>
            <h3>Expert Care</h3>
            <p>Our team of professionals ensures your pet receives the best care possible.</p>
          </div>
          <div className="dash-why-choose-card dash-animate-on-scroll dash-fade-in">
            <span className="dash-why-choose-icon">❤️</span>
            <h3>Compassionate Service</h3>
            <p>We treat every pet like family, with love and dedication.</p>
          </div>
          <div className="dash-why-choose-card dash-animate-on-scroll dash-slide-in-right">
            <span className="dash-why-choose-icon">🏥</span>
            <h3>Comprehensive Solutions</h3>
            <p>From grooming to microchipping, we offer all the services your pet needs.</p>
          </div>
        </div>
      </section>

      {/* What We Offer Section with Carousel */}
      <section className="dash-services-section dash-animate-on-scroll dash-fade-in">
        <h2 className="dash-section-title dash-scale-in">What We Offer</h2>
        <div className="dash-services-carousel">
          <button className="dash-carousel-prev dash-animate-on-scroll dash-fade-in" onClick={handlePrev}>
            ❮
          </button>
          <div className="dash-services-slide">
            {services.map((service, index) => (
              <div key={index} className="dash-service-card dash-animate-on-scroll dash-fade-in">
                <div className="dash-service-icon">
                  <img src={service.icon} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button
                  className="dash-service-cta-button dash-bounce-in"
                  onClick={() => handleLearnMoreClick(service.title, service.details)}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
          <button className="dash-carousel-next dash-animate-on-scroll dash-fade-in" onClick={handleNext}>
            ❯
          </button>
          <div className="dash-carousel-dots">
            {services.map((_, index) => (
              <span
                key={index}
                className={`dash-dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => {
                  const container = document.querySelector('.dash-services-slide');
                  container.scrollLeft = index * 320; // Adjust based on card width
                  setCurrentIndex(index);
                }}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section with Fade-In and Slide Animation */}
      <section className="dash-about-section dash-animate-on-scroll dash-fade-in">
        <div className="dash-about-content dash-animate-on-scroll dash-slide-in-left">
          <h2 className="dash-section-title">Caring for Your Pets Like Family</h2>
          <p>
            At Petverse, we’re dedicated to providing the highest quality care for your pets. With over 25 years of experience, our team is passionate about ensuring your furry friends live happy, healthy lives.
          </p>
          <p className="dash-highlight-text">
            We believe in treating every pet with the same love and attention we give to our own.
          </p>
          <button className="dash-about-more-btn dash-bounce-in" onClick={() => navigate('/about')}>
            Learn More About Us
          </button>
        </div>
        <div className="dash-about-image dash-animate-on-scroll dash-slide-in-right">
          <img src={aboutSectionImage} alt="catAndDog" />
        </div>
      </section>

      {/* Testimonials Section with Fade-In and Staggered Animation */}
      <section className="dash-testimonials-section dash-animate-on-scroll dash-fade-in">
        <h2 className="dash-section-title dash-scale-in">What Our Clients Say</h2>
        <div className="dash-testimonials-grid">
          <div className="dash-testimonial-card dash-animate-on-scroll dash-fade-in-delay-1">
            <p>"Petverse helped me find a great vet nearby. My dog is thriving!" - Sarah L.</p>
          </div>
          <div className="dash-testimonial-card dash-animate-on-scroll dash-fade-in-delay-2">
            <p>"The missing pets list helped me reunite with my lost cat!" - James P.</p>
          </div>
          <div className="dash-testimonial-card dash-animate-on-scroll dash-fade-in-delay-3">
            <p>"Thanks to the vaccination reminders, my pet is always on schedule!" - Emily R.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner with Fade-In and Bounce Animation */}
      <section className="dash-cta-banner dash-animate-on-scroll dash-fade-in">
        <div className="dash-cta-content">
          <h2 className="dash-cta-title dash-scale-in">Ready to Care for Your Pet?</h2>
          <p>Join the Petverse community and give your pet the best care possible!</p>
          <button className="dash-cta-button dash-bounce-in" onClick={() => navigate('/contact')}>
            Contact Us Today
          </button>
        </div>
      </section>

      {/* Popup for Learn More */}
      <div className={`dash-popup-overlay ${isPopupOpen ? 'active' : ''}`} onClick={closePopup} ref={popupRef}>
        <div className="dash-popup-content" onClick={(e) => e.stopPropagation()}>
          <h2>{popupContent.title}</h2>
          <p>{popupContent.description}</p>
          <div className="dash-popup-button-group">
            <button
              className="dash-popup-go-to-services-button"
              onClick={() => navigateToServiceDetails(popupContent.title)}
            >
              Go to Services
            </button>
            <button className="dash-popup-exit-button" onClick={closePopup}>
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;