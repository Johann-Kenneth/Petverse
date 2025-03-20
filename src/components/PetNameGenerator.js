import { useState } from "react";
import axios from "axios"; // Import axios
import "./PetNameGenerator.css";

// Remove OpenAI import since we’re not using it anymore
// import { OpenAI } from "openai";

const PetNameGenerator = () => {
  const [petType, setPetType] = useState("");
  const [age, setAge] = useState("");
  const [traits, setTraits] = useState("");
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateNames = async () => {
    if (!petType || !age || !traits) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError(null);
    setNames([]);

    try {
      // Make the API call to jsongpt
      const response = await axios.get("https://api.jsongpt.com/json", {
        params: {
          prompt: `Generate 5 unique names for a ${age}-year-old ${traits} ${petType}. The names should be diverse, including cute, mythological, funny, and exotic options.`,
          names: "array of pet names",
        },
      });

      // Check if the response contains names
      if (!response.data.names || response.data.names.length === 0) {
        throw new Error("No names generated");
      }

      setNames(response.data.names);
    } catch (error) {
      console.error("Error generating pet names:", error.message);
      setError("Failed to generate names. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToGenerator = () => {
    const generatorSection = document.querySelector(".generator-section");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pet-name-generator-container">
      {/* Introductory Banner Section */}
      <section className="pet-name-intro-banner">
        <div className="video-container">
          <video autoPlay loop muted playsInline>
            <source src="/video/training-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="intro-content">
          <h1 className="intro-title">Find the Perfect Name for Your Pet!</h1>
          <p className="intro-tagline">
            Discover unique and personalized pet names tailored to your pet’s type, age, and personality with RoxVet’s Pet Name Generator.
          </p>
          <button className="intro-cta-button" onClick={scrollToGenerator}>
            Start Naming Now
          </button>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="why-use-section">
        <h2 className="why-use-title">Why Use Our Pet Name Generator?</h2>
        <div className="why-use-grid">
          <div className="why-use-item">
            <span className="why-use-icon">🐶</span>
            <h3>Personalized Suggestions</h3>
            <p>Get names that match your pet’s unique characteristics and traits.</p>
          </div>
          <div className="why-use-item">
            <span className="why-use-icon">✨</span>
            <h3>Endless Inspiration</h3>
            <p>Explore a variety of creative names to find the perfect fit.</p>
          </div>
          <div className="why-use-item">
            <span className="why-use-icon">💡</span>
            <h3>Quick & Easy</h3>
            <p>Generate names in seconds with just a few clicks.</p>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="generator-section">
        <div className="card">
          <h2>🐾 Find the Perfect Pet Name!</h2>

          <div className="input-group">
            <input
              type="text"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              placeholder=" "
            />
            <label>Pet Type (Dog, Cat, etc.)</label>
          </div>

          <div className="input-group">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder=" "
            />
            <label>Age of Your Pet</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              placeholder=" "
            />
            <label>Traits (Playful, Calm, etc.)</label>
          </div>

          <button
            className="generate-button"
            onClick={generateNames}
            disabled={loading}
          >
            {loading ? "Generating..." : "🎲 Generate Names"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {names.length > 0 && (
            <div className="results">
              <h3>Suggested Names:</h3>
              <ul>
                {names.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Naming Tips Section */}
      <section className="naming-tips-section">
        <h3 className="section-title">Tips for Choosing a Great Pet Name</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">📛</span>
            <p>Choose a name that’s easy to say and recognize for your pet.</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎶</span>
            <p>Pick a name with a distinct sound to avoid confusion with commands.</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">❤️</span>
            <p>Reflect your pet’s personality or appearance in the name.</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <p>Test the name for a few days to see if it feels right.</p>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-stories-section">
        <h3 className="section-title">Pet Naming Success Stories</h3>
        <div className="success-story">
          <p>
            "I found the perfect name, ‘Bouncy,’ for my playful puppy using RoxVet’s generator!" - Sarah L.
          </p>
        </div>
        <div className="success-story">
          <p>
            "Thanks to the generator, my calm cat is now called ‘Serenity.’ It suits her perfectly!" - James P.
          </p>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="resources-section">
        <h3 className="section-title">Explore More Pet Care Resources</h3>
        <ul className="resources-list">
          <li><a href="#">How to Train Your Pet with RoxVet Videos</a></li>
          <li><a href="#">Top 5 Tips for New Pet Owners</a></li>
          <li><a href="#">Understanding Your Pet’s Behavior</a></li>
          <li><a href="#">Pet Health and Wellness Guide</a></li>
        </ul>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h3 className="cta-title">Share Your Pet’s New Name!</h3>
          <p>Join the RoxVet community and share the name you chose for your pet!</p>
          <button className="cta-button">Share Your Story</button>
        </div>
      </section>
    </div>
  );
};

export default PetNameGenerator;