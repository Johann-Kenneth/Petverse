import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Pages.css';

const Pages = () => {
  const location = useLocation();

  // Scroll to the section based on the query parameter
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

  return (
    <div className="pages-container">
      <h1>Explore Petverse</h1>
      <p className="pages-intro">
        Discover a variety of resources, stories, and tools to help you and your pets thrive in the Petverse community.
      </p>

      {/* Missing Pets Section */}
      <section id="missing-pets" className="pages-section">
        <h2>Missing Pets</h2>
        <p>
          Losing a pet can be a heartbreaking experience, but the Petverse community is here to help. Visit our Missing Pets page to report a lost pet, browse current alerts, or help reunite pets with their owners.
        </p>
        <div className="missing-pets-content">
          <div className="missing-pets-info">
            <h3>How It Works</h3>
            <ul>
              <li><strong>Report a Missing Pet:</strong> Submit details like your pet’s name, breed, last seen location, and a photo to create an alert.</li>
              <li><strong>Browse Alerts:</strong> Check active missing pet alerts in your area and share them with your network.</li>
              <li><strong>Community Support:</strong> Get notified if someone spots your pet through our community-driven platform.</li>
            </ul>
            <a href="/missing-pets" className="section-link">Go to Missing Pets</a>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" className="pages-section">
        <h2>Success Stories</h2>
        <p>
          The Petverse community has brought countless pets back to their loving homes. Here are some heartwarming stories of pets reunited with their families:
        </p>
        <div className="success-stories-grid">
          <div className="story-card">
            <h3>Luna's Journey Home</h3>
            <p>
              "Luna was found within 48 hours thanks to a neighbor's sighting! We posted her details on Petverse, and the community shared her alert widely. We’re so grateful!" - Sarah M.
            </p>
          </div>
          <div className="story-card">
            <h3>Max’s Happy Reunion</h3>
            <p>
              "Max came home after a week, all because of Petverse! A kind stranger spotted him and contacted us through the platform. Thank you, Petverse!" - John P.
            </p>
          </div>
          <div className="story-card">
            <h3>Buddy Finds His Way Back</h3>
            <p>
              "Buddy went missing during a thunderstorm, but thanks to Petverse, we found him safe at a local shelter. The alerts helped us connect quickly!" - Emily R.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="pages-section">
        <h2>Resources</h2>
        <p>
          Equip yourself with the knowledge to keep your pets safe and happy. Explore our curated guides and tips:
        </p>
        <div className="resources-grid">
          <div className="resource-item">
            <h3>How to Prevent Your Pet from Getting Lost</h3>
            <p>
              Learn practical steps like securing your yard, using a leash in public, and ensuring your pet has proper identification tags.
            </p>
          </div>
          <div className="resource-item">
            <h3>What to Do If Your Pet Goes Missing</h3>
            <p>
              Follow our step-by-step guide: notify local shelters, post on Petverse, and create flyers to spread the word.
            </p>
          </div>
          <div className="resource-item">
            <h3>Microchipping Your Pet: A Guide</h3>
            <p>
              Understand the benefits of microchipping, how it works, and how to register your pet’s microchip for quick recovery.
            </p>
          </div>
          <div className="resource-item">
            <h3>Training Tips for Pet Safety</h3>
            <p>
              Teach your pet basic commands like "stay" and "come" to prevent them from wandering off in dangerous situations.
            </p>
          </div>
        </div>
      </section>

      {/* New Section: Pet Care Tips */}
      <section id="pet-care-tips" className="pages-section">
        <h2>Pet Care Tips</h2>
        <p>
          Keep your pets healthy and happy with these expert tips:
        </p>
        <ul>
          <li><strong>Regular Vet Checkups:</strong> Schedule annual visits to catch health issues early.</li>
          <li><strong>Balanced Diet:</strong> Feed your pet high-quality food appropriate for their age and breed.</li>
          <li><strong>Exercise Needs:</strong> Ensure your pet gets enough physical activity to stay fit.</li>
          <li><strong>Mental Stimulation:</strong> Use toys and games to keep your pet’s mind active.</li>
        </ul>
      </section>

      {/* New Section: Community Events */}
      <section id="community-events" className="pages-section">
        <h2>Community Events</h2>
        <p>
          Join local events to connect with other pet lovers and support the Petverse community:
        </p>
        <div className="events-grid">
          <div className="event-item">
            <h3>Pet Adoption Fair</h3>
            <p>
              Date: May 15, 2025<br />
              Location: Palakkad, PKD<br />
              Meet adoptable pets and learn about the adoption process.
            </p>
          </div>
          <div className="event-item">
            <h3>Pet Safety Workshop</h3>
            <p>
              Date: May 10, 2025<br />
              Location: Coimbatore, CBE<br />
              Learn tips to keep your pet safe during emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Join the Petverse Community</h2>
        <p>
          Sign up today to access all our tools, connect with pet lovers, and help pets in need.
        </p>
        <a href="/signup" className="cta-button">Get Started</a>
      </section>
    </div>
  );
};

export default Pages;