import React, { useEffect, useState, useRef } from "react";
import { fetchPetShelters } from "../utils/petfinderAPI";
import "./PetShelters.css";
import petShelterVideo from './videos/find-shelter-video.mp4'

const PetShelters = () => {
  const [shelters, setShelters] = useState([]);
  const [location, setLocation] = useState("10001");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadShelters = async () => {
      setLoading(true);
      try {
        const data = await fetchPetShelters(location);
        console.log("Fetched shelters data:", data);
        setShelters(data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      } finally {
        setLoading(false);
      }
    };
    loadShelters();
  }, [location]);

  const scrollToSearch = () => {
    const searchSection = document.querySelector(".pet-search-section");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const featuredShelter = shelters.length > 0 ? shelters[0] : null;

  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("pet-visible");
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(animateOnScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    const elements = document.querySelectorAll(".pet-animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pet-shelters-container">
      {/* Hero Banner */}
      <section className="pet-hero-banner">
        <video className="pet-hero-video" autoPlay loop muted playsInline>
          <source src={petShelterVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="pet-hero-overlay"></div> {/* Overlay for readability */}
        <div className="pet-hero-content">
          <h1 className="pet-hero-title">Discover Pet Shelters Near You</h1>
          <p className="pet-hero-tagline">
            Connect with shelters to adopt, volunteer, or donate with Petverse’s shelter finder.
          </p>
          <button className="pet-hero-cta-button" onClick={scrollToSearch}>
            Find Shelters Now
          </button>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      {featuredShelter && (
        <section className="pet-shelter-spotlight-section pet-animate-on-scroll">
          <h2 className="pet-section-title">Shelter Spotlight</h2>
          <div className="pet-shelter-spotlight-card">
            <div className="pet-shelter-spotlight-content">
              <h3 className="pet-shelter-spotlight-title">{featuredShelter.name}</h3>
              <p className="pet-shelter-spotlight-text">
                {featuredShelter.address?.city || "Unknown city"},{" "}
                {featuredShelter.address?.state || "Unknown state"}
              </p>
              <p className="pet-shelter-spotlight-text">
                Phone: {featuredShelter.phone || "N/A"}
              </p>
              <p className="pet-shelter-spotlight-text">
                Website:{" "}
                {featuredShelter.website ? (
                  <a href={featuredShelter.website} target="_blank" rel="noopener noreferrer" className="pet-link">
                    {featuredShelter.website}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="pet-benefits-section pet-animate-on-scroll">
        <h2 className="pet-section-title">Why Support Shelters?</h2>
        <div className="pet-benefits-grid">
          <div className="pet-benefit-card">
            <span className="pet-benefit-icon">🐾</span>
            <h3>Save Lives</h3>
            <p>Help shelters rescue and care for animals in need.</p>
          </div>
          <div className="pet-benefit-card">
            <span className="pet-benefit-icon">🤝</span>
            <h3>Community Impact</h3>
            <p>Support local efforts to reduce pet homelessness.</p>
          </div>
          <div className="pet-benefit-card">
            <span className="pet-benefit-icon">❤️</span>
            <h3>Find Companions</h3>
            <p>Meet pets ready for adoption at shelters.</p>
          </div>
        </div>
      </section>

      <section className="pet-search-section pet-animate-on-scroll">
        <h2 className="pet-section-title">Find Pet Shelters</h2>
        <div className="pet-search-bar">
          <div className="pet-input-group">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder=" "
            />
            <label>Location (e.g., '10001' or 'New York, NY')</label>
          </div>
        </div>
        {loading ? (
          <div className="pet-loading">
            <div className="pet-spinner"></div>
            <p>Loading shelters...</p>
          </div>
        ) : (
          <div className="pet-results">
            {shelters.length > 0 ? (
              shelters.map((shelter) => (
                <div key={shelter.id} className="pet-shelter-card">
                  <div className="pet-shelter-content">
                    <h3 className="pet-shelter-title">{shelter.name}</h3>
                    <p className="pet-shelter-text">
                      {shelter.address?.city || "Unknown city"},{" "}
                      {shelter.address?.state || "Unknown state"}
                    </p>
                    <p className="pet-shelter-text">Phone: {shelter.phone || "N/A"}</p>
                    <p className="pet-shelter-text">
                      Website:{" "}
                      {shelter.website ? (
                        <a
                          href={shelter.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pet-link"
                        >
                          {shelter.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="pet-no-results">No shelters found in this location.</p>
            )}
          </div>
        )}
      </section>

      <section className="pet-shelter-tips-section pet-animate-on-scroll">
        <h2 className="pet-section-title">Shelter Tips</h2>
        <ul className="pet-tips-list">
          <li>Call ahead to confirm shelter hours and adoption policies.</li>
          <li>Bring identification when visiting or adopting.</li>
          <li>Consider donating supplies like food or blankets.</li>
          <li>Volunteer your time to help with shelter activities.</li>
        </ul>
      </section>

      <section className="pet-community-stories-section pet-animate-on-scroll">
        <h2 className="pet-section-title">Community Stories</h2>
        <div className="pet-stories-grid">
          <div className="pet-story-card">
            <p>"Volunteering at a shelter changed my life—I met so many amazing animals!" - John D.</p>
          </div>
          <div className="pet-story-card">
            <p>"I donated to a shelter via Petverse, and it felt great to make a difference!" - Lisa T.</p>
          </div>
          <div className="pet-story-card">
            <p>"Finding my dog at a shelter listed on Petverse was the best decision ever!" - Mike R.</p>
          </div>
        </div>
      </section>

      <section className="pet-cta-banner">
        <div className="pet-cta-content">
          <h3 className="pet-cta-title">Get Involved Today!</h3>
          <p>Volunteer, donate, or adopt—support shelters with Petverse!</p>
          <button className="pet-cta-button">Take Action</button>
        </div>
      </section>
    </div>
  );
};

export default PetShelters;