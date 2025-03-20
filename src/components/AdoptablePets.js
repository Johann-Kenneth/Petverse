import React, { useEffect, useState } from "react";
import { fetchAdoptablePets } from "../utils/petfinderAPI";
import adoptablePetsImage from './images/adoptable-pets.png';
import "./AdoptablePets.css";

const AdoptablePets = () => {
  const [pets, setPets] = useState([]);
  const [location, setLocation] = useState("10001");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      const data = await fetchAdoptablePets(location);
      setPets(data);
      setLoading(false);
    };
    loadPets();
  }, [location]);

  const scrollToSearch = () => {
    const searchSection = document.querySelector(".adoptable-search-section");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const featuredPet = pets.length > 0 ? pets[0] : null;

  return (
    <div className="adoptable-pets-container">
      {/* Hero Banner */}
      <section className="adoptable-hero-banner">
        <div className="adoptable-hero-content">
          <h1 className="adoptable-hero-title">Find Your New Best Friend</h1>
          <p className="adoptable-hero-tagline">
            Discover adoptable pets in your area and give a loving home to a pet in need with Petverse.
          </p>
          <button className="adoptable-hero-cta-button" onClick={scrollToSearch}>
            Search for Pets
          </button>
        </div>
        <div className="adoptable-hero-image">
          <img src={adoptablePetsImage} alt="Adoptable Pets" />
        </div>
      </section>

      {/* Adoption Benefits Section */}
      <section className="adoptable-adoption-benefits-section">
        <h2 className="adoptable-section-title">Why Adopt a Pet?</h2>
        <div className="adoptable-benefits-container">
          <div className="adoptable-benefit-card">
            <span className="adoptable-benefit-icon">🏡</span>
            <h3>Save a Life</h3>
            <p>Give a pet a second chance by adopting from a shelter.</p>
          </div>
          <div className="adoptable-benefit-card">
            <span className="adoptable-benefit-icon">🐕</span>
            <h3>Unconditional Love</h3>
            <p>Experience the joy and companionship of a loyal pet.</p>
          </div>
          <div className="adoptable-benefit-card">
            <span className="adoptable-benefit-icon">🌍</span>
            <h3>Support Shelters</h3>
            <p>Help reduce shelter overcrowding and support rescue efforts.</p>
          </div>
        </div>
      </section>

      {/* Featured Pet Section */}
      {featuredPet && (
        <section className="adoptable-featured-pet-section">
          <h2 className="adoptable-section-title">Featured Pet</h2>
          <div className="adoptable-featured-pet-card">
            <img
              src={featuredPet.photos?.[0]?.medium || "https://via.placeholder.com/300"}
              alt={featuredPet.name}
              className="adoptable-featured-pet-image"
            />
            <div className="adoptable-featured-pet-info">
              <h3 className="adoptable-featured-pet-title">{featuredPet.name}</h3>
              <p className="adoptable-featured-pet-text">{featuredPet.breeds?.primary || "Unknown breed"}</p>
              <p className="adoptable-featured-pet-text">
                {featuredPet.contact?.address?.city || "Unknown city"},{" "}
                {featuredPet.contact?.address?.state || "Unknown state"}
              </p>
              <p className="adoptable-featured-pet-text">
                Email:{" "}
                {featuredPet.contact?.email ? (
                  <a href={`mailto:${featuredPet.contact.email}`} className="adoptable-link">
                    {featuredPet.contact.email}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="adoptable-search-section">
        <h2 className="adoptable-section-title">Find Adoptable Pets</h2>
        <div className="adoptable-search-bar">
          <div className="adoptable-input-group">
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
          <div className="adoptable-loading">
            <div className="adoptable-spinner"></div>
            <p>Loading pets...</p>
          </div>
        ) : (
          <div className="adoptable-results">
            {pets.length > 0 ? (
              pets.map((pet) => (
                <div key={pet.id} className="adoptable-pet-card">
                  <img
                    src={pet.photos?.[0]?.medium || "https://via.placeholder.com/150"}
                    alt={pet.name}
                    className="adoptable-pet-image"
                  />
                  <div className="adoptable-pet-content">
                    <h3 className="adoptable-pet-title">{pet.name}</h3>
                    <p className="adoptable-pet-text">{pet.breeds?.primary || "Unknown breed"}</p>
                    <p className="adoptable-pet-text">
                      {pet.contact?.address?.city || "Unknown city"},{" "}
                      {pet.contact?.address?.state || "Unknown state"}
                    </p>
                    <p className="adoptable-pet-text">
                      Phone: {pet.contact?.phone || "N/A"}
                    </p>
                    <p className="adoptable-pet-text">
                      Email:{" "}
                      {pet.contact?.email ? (
                        <a href={`mailto:${pet.contact.email}`} className="adoptable-link">
                          {pet.contact.email}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="adoptable-no-results">No pets found in this location.</p>
            )}
          </div>
        )}
      </section>

      {/* Adoption Tips Section */}
      <section className="adoptable-adoption-tips-section">
        <h2 className="adoptable-section-title">Adoption Tips</h2>
        <ul className="adoptable-tips-list">
          <li>Visit the shelter to meet the pet in person before deciding.</li>
          <li>Ensure your home is pet-ready with supplies and a safe space.</li>
          <li>Be patient as your new pet adjusts to their new environment.</li>
          <li>Schedule a vet checkup shortly after adoption.</li>
        </ul>
      </section>

      {/* Success Stories Section */}
      <section className="adoptable-success-stories-section">
        <h2 className="adoptable-section-title">Adoption Success Stories</h2>
        <div className="adoptable-stories-container">
          <div className="adoptable-story-card">
            <p>"I adopted Max from a shelter using Petverse, and he’s been my best friend ever since!" - Anna K.</p>
          </div>
          <div className="adoptable-story-card">
            <p>"Finding Luna through Petverse was a life-changing experience. She’s brought so much joy!" - David M.</p>
          </div>
          <div className="adoptable-story-card">
            <p>"Thanks to Petverse, I found my perfect match in a sweet cat named Whiskers!" - Emily R.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="adoptable-cta-banner">
        <div className="adoptable-cta-content">
          <h3 className="adoptable-cta-title">Share Your Adoption Story!</h3>
          <p>Join the Petverse community and tell us about your new furry friend!</p>
          <button className="adoptable-cta-button">Share Your Story</button>
        </div>
      </section>
    </div>
  );
};

export default AdoptablePets;