import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where, orderBy, updateDoc, doc, addDoc } from "firebase/firestore";
import "./MissingPets.css";
import missingPetsvideo from "./videos/missing-pets-video.mp4"

function MissingPets() {
  const [missingPets, setMissingPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sighting, setSighting] = useState({ petId: "", location: "", description: "" });
  const [sightingSubmitted, setSightingSubmitted] = useState(false);
  const [volunteer, setVolunteer] = useState({ name: "", email: "", message: "" });
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchMissingPets();
    if (videoRef.current) {
      console.log("Video element mounted:", {
        src: videoRef.current.currentSrc,
        networkState: videoRef.current.networkState,
        readyState: videoRef.current.readyState,
        error: videoRef.current.error,
      });
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Failed to play video on mount:", error);
          setVideoError(true);
        });
      }
    }
  }, []);

  const fetchMissingPets = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "petAlerts"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Missing Pets from Firestore:", pets);
      setMissingPets(pets);
      setFilteredPets(pets);
    } catch (error) {
      console.error("Error fetching missing pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsFound = async (petId) => {
    try {
      const alertRef = doc(db, "petAlerts", petId);
      await updateDoc(alertRef, { status: "found" });
      setMissingPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      setFilteredPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error("Error updating pet status:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterPets(query, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterPets(searchQuery, status);
  };

  const filterPets = (query, status) => {
    let filtered = missingPets;
    if (query) {
      filtered = filtered.filter(
        (pet) =>
          pet.title.toLowerCase().includes(query) ||
          (pet.description && pet.description.toLowerCase().includes(query))
      );
    }
    if (status !== "all") {
      filtered = filtered.filter((pet) => pet.status === status);
    }
    setFilteredPets(filtered);
  };

  const sharePetAlert = (pet) => {
    const shareText = `Help find ${pet.title}! Last seen: ${pet.description}. Check details on RoxVet: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `Missing Pet: ${pet.title}`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      alert("Share this link: " + shareText);
    }
  };

  const contactOwner = (pet) => {
    alert(`Contacting owner for ${pet.title}. This feature will be implemented soon!`);
  };

  const handleSightingChange = (e) => {
    const { name, value } = e.target;
    setSighting((prev) => ({ ...prev, [name]: value }));
  };

  const submitSighting = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sightings"), {
        petId: sighting.petId,
        location: sighting.location,
        description: sighting.description,
        timestamp: new Date(),
      });
      setSighting({ petId: "", location: "", description: "" });
      setSightingSubmitted(true);
      setTimeout(() => setSightingSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting sighting:", error);
    }
  };

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteer((prev) => ({ ...prev, [name]: value }));
  };

  const submitVolunteer = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), {
        name: volunteer.name,
        email: volunteer.email,
        message: volunteer.message,
        timestamp: new Date(),
      });
      setVolunteer({ name: "", email: "", message: "" });
      setVolunteerSubmitted(true);
      setTimeout(() => setVolunteerSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
    }
  };

  const scrollToPets = () => {
    const petsResults = document.querySelector(".missing-pets-results");
    if (petsResults) {
      petsResults.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setTimeout(() => {
        const petsResultsRetry = document.querySelector(".missing-pets-results");
        if (petsResultsRetry) petsResultsRetry.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  };

  const navigateToPostAlert = () => {
    window.location.href = "/post-alert";
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e.target.error);
    console.error("Video source:", e.target.currentSrc);
    console.error("Network state:", e.target.networkState);
    console.error("Ready state:", e.target.readyState);
    setVideoError(true);
  };

  return (
    <div className="missing-pets-container">
      {/* Hero Section with Video Background */}
      <section className="missing-pets-hero">
        {!videoError ? (
          <video
            key="missing-pets-video"
            ref={videoRef}
            className="missing-pets-hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
          >
            <source src={missingPetsvideo} type="video/mp4" />
          </video>
        ) : (
          <div className="missing-pets-hero-fallback-container">
            <img
              src="/fallback-image.jpg"
              alt="Fallback for video"
              className="missing-pets-hero-fallback"
            />
            <p className="missing-pets-video-error">
              Video failed to load. Check the console for details or ensure the file is accessible.
            </p>
          </div>
        )}
        <div className="missing-pets-hero-overlay"></div>
        <div className="missing-pets-hero-content">
          <h1 className="missing-pets-hero-title">Unite to Find Lost Pets</h1>
          <p className="missing-pets-hero-subtitle">
            Join the Petverse community to report sightings, share alerts, and bring pets home safely.
          </p>
          <button className="missing-pets-hero-cta" onClick={scrollToPets}>
            Explore Missing Pets
          </button>
        </div>
      </section>

      <h2 className="missing-pets-header">Missing Pets</h2>

      {/* Filter and Search Bar */}
      <section className="missing-pets-filter-section">
        <input
          type="text"
          placeholder="Search by pet name or location..."
          value={searchQuery}
          onChange={handleSearch}
          className="missing-pets-search-input"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="missing-pets-status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="missing">Missing</option>
          <option value="found">Found</option>
        </select>
      </section>

      {/* Missing Pets List */}
      {loading ? (
        <div className="missing-pets-loading">
          <div className="missing-pets-spinner"></div>
          <p>Loading missing pets...</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="missing-pets-no-results">
          <p>No matching pets found. Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="missing-pets-results">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="missing-pets-card">
              <div className="missing-pets-card-image-container">
                {pet.imageUrl ? (
                  <img
                    src={pet.imageUrl}
                    alt={pet.title}
                    className="missing-pets-card-image"
                    onError={(e) => {
                      e.target.src = "/fallback-image.jpg"; // Fallback image if the URL fails
                    }}
                  />
                ) : (
                  <div className="missing-pets-card-image-placeholder">No Image Available</div>
                )}
              </div>
              <div className="missing-pets-card-content">
                <h3 className="missing-pets-card-title">{pet.title}</h3>
                <p className="missing-pets-card-text">{pet.description}</p>
                <div className="missing-pets-card-actions">
                  <button
                    className="missing-pets-card-button"
                    onClick={() => markAsFound(pet.id)}
                  >
                    Mark as Found
                  </button>
                  <button
                    className="missing-pets-card-button secondary"
                    onClick={() => contactOwner(pet)}
                  >
                    Contact Owner
                  </button>
                  <button
                    className="missing-pets-card-button secondary"
                    onClick={() => sharePetAlert(pet)}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report a Sighting Form */}
      <section className="missing-pets-sighting-section">
        <h3 className="missing-pets-section-title">Report a Sighting</h3>
        <form className="missing-pets-sighting-form" onSubmit={submitSighting}>
          <select
            name="petId"
            value={sighting.petId}
            onChange={handleSightingChange}
            className="missing-pets-input"
            required
          >
            <option value="">Select a Pet</option>
            {filteredPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="location"
            value={sighting.location}
            onChange={handleSightingChange}
            placeholder="Location (e.g., Central Park)"
            className="missing-pets-input"
            required
          />
          <textarea
            name="description"
            value={sighting.description}
            onChange={handleSightingChange}
            placeholder="Describe the sighting (e.g., time, behavior)"
            className="missing-pets-textarea"
            required
          />
          <button type="submit" className="missing-pets-button">
            Submit Sighting
          </button>
          {sightingSubmitted && <p className="missing-pets-success">Sighting reported! Thank you!</p>}
        </form>
      </section>

      {/* Volunteer Signup Form */}
      <section className="missing-pets-volunteer-section">
        <h3 className="missing-pets-section-title">Join Our Volunteer Team</h3>
        <form className="missing-pets-volunteer-form" onSubmit={submitVolunteer}>
          <input
            type="text"
            name="name"
            value={volunteer.name}
            onChange={handleVolunteerChange}
            placeholder="Your Name"
            className="missing-pets-input"
            required
          />
          <input
            type="email"
            name="email"
            value={volunteer.email}
            onChange={handleVolunteerChange}
            placeholder="Your Email"
            className="missing-pets-input"
            required
          />
          <textarea
            name="message"
            value={volunteer.message}
            onChange={handleVolunteerChange}
            placeholder="Why do you want to volunteer?"
            className="missing-pets-textarea"
            required
          />
          <button type="submit" className="missing-pets-button">
            Sign Up to Volunteer
          </button>
          {volunteerSubmitted && <p className="missing-pets-success">Thank you for signing up!</p>}
        </form>
      </section>

      {/* Success Stories Section */}
      <section className="missing-pets-success-stories">
        <h3 className="missing-pets-section-title">Success Stories</h3>
        <div className="missing-pets-story">
          <p>
            "Thanks to RoxVet, I found my cat Luna within 48 hours! A kind neighbor spotted her and reported the sighting." - Sarah M.
          </p>
        </div>
        <div className="missing-pets-story">
          <p>
            "Max was missing for a week, but the RoxVet community helped us reunite. I’m so grateful!" - John P.
          </p>
        </div>
      </section>

      {/* Community Guidelines Section */}
      <section className="missing-pets-guidelines-section">
        <h3 className="missing-pets-section-title">Community Guidelines</h3>
        <ul className="missing-pets-guidelines-list">
          <li>Always verify sightings before contacting owners.</li>
          <li>Be respectful and empathetic in communications.</li>
          <li>Share accurate information to help others effectively.</li>
          <li>Volunteer responsibly and follow safety protocols.</li>
        </ul>
      </section>

      {/* Pet Safety Resources Section */}
      <section className="missing-pets-resources-section">
        <h3 className="missing-pets-section-title">Pet Safety Resources</h3>
        <ul className="missing-pets-resources-list">
          <li><a href="#">How to Prevent Your Pet from Getting Lost</a></li>
          <li><a href="#">What to Do If Your Pet Goes Missing</a></li>
          <li><a href="#">Microchipping Your Pet: A Guide</a></li>
          <li><a href="#">Training Tips for Recall Commands</a></li>
        </ul>
      </section>

      {/* CTA Banner with Navigation to PostAlert */}
      <section className="missing-pets-cta-banner">
        <div className="missing-pets-cta-content">
          <h3 className="missing-pets-cta-title">Help More Pets Find Their Way Home!</h3>
          <p>Post your own alert or share this page to support the RoxVet community.</p>
          <button className="missing-pets-cta-button" onClick={navigateToPostAlert}>
            Post an Alert
          </button>
        </div>
      </section>
    </div>
  );
}

export default MissingPets;