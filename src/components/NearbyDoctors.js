import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { useNavigate, Link } from 'react-router-dom';
import './NearbyDoctors.css';
import nearbyDoctorVideo from './videos/pets-doctor-video.mp4'

// Custom vet icon
const vetIcon = new L.Icon({
  iconUrl: 'https://imgs.search.brave.com/jgXnWHK8TdaijD_DJyRRl6mudrzb5uIWH_EHzRlWhEI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4y/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvc29jaWFsLW1l/ZGlhLTgvNTEyL3Bv/aW50ZXIucG5n',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Custom user location icon
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const NearbyDoctors = () => {
  const [currentLocation, setCurrentLocation] = useState([20.5937, 78.9629]); // Default: Center of India
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false); // State to toggle "Learn More" content
  const navigate = useNavigate();

  // Fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        alert('Could not fetch location. Please allow location access.');
      }
    );
  }, []);

  // Fetch nearby veterinarians
  useEffect(() => {
    const fetchVeterinarians = async () => {
      const query = `[out:json];
        node["amenity"="veterinary"](${currentLocation[0] - 0.2},${currentLocation[1] - 0.2},${currentLocation[0] + 0.2},${currentLocation[1] + 0.2});
        out;`;

      const url = `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await axios.get(url);
        const fetchedVets = response.data.elements;

        console.log('Fetched Veterinarians:', fetchedVets);

        const vetsWithAddress = await Promise.all(
          fetchedVets.map(async (vet) => {
            const addressUrl = `https://nominatim.openstreetmap.org/reverse?lat=${vet.lat}&lon=${vet.lon}&format=json`;
            try {
              const addressResponse = await axios.get(addressUrl);
              const address = addressResponse.data.display_name;
              return { ...vet, address };
            } catch (error) {
              console.error('Error fetching address:', error);
              return { ...vet, address: 'Address not available' };
            }
          })
        );

        setVeterinarians(vetsWithAddress);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
        setLoading(false);
      }
    };

    fetchVeterinarians();
  }, [currentLocation]);

  // Animation effect for elements on scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element) => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVetSelect = (vet) => {
    setSelectedVet(vet);
    const map = document.querySelector('.map').leafletMap;
    if (map) map.setView([vet.lat, vet.lon], 14);
  };

  const handleFindVetClick = () => {
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
      const navbarHeight = 60; // Adjust based on your navbar height
      const offsetTop = mapSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Toggle "Learn More" content
  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div className="nearby-container">
      {/* Enhanced Hero Section with Removed Image */}
      <section className="hero-section animate-on-scroll">
        <div className="video-container">
          <video autoPlay loop muted playsInline>
            <source src={nearbyDoctorVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-content">
          <p className="welcome-text">🌟 Discover Expert Pet Care</p>
          <h2>Find Nearby Veterinarians</h2>
          <p className="hero-description">
            Locate trusted veterinarians near your location with Petverse. From routine checkups to emergency care, our network of skilled vets ensures your pets receive top-quality treatment. Explore a variety of specialists, including those for dental care, dermatology, and exotic pets, all tailored to keep your furry, feathered, or scaled friends healthy and happy!
          </p>
          <div className="button-container">
            <button className="book-schedule-btn" onClick={handleFindVetClick}>
              Find a Vet <span>▶</span>
            </button>
          </div>
        </div>
      </section>

      <section className="map-section animate-on-scroll">
        <div className="map-and-shops">
          <div className="map-container">
            <MapContainer center={currentLocation} zoom={14} className="map" scrollWheelZoom={false}>
              <MapUpdater center={currentLocation} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={currentLocation} icon={userIcon}>
                <Popup><b>You are here</b></Popup>
              </Marker>
              {veterinarians.map((vet, index) => (
                <Marker
                  key={index}
                  position={[vet.lat, vet.lon]}
                  icon={vetIcon}
                  eventHandlers={{
                    click: () => handleVetSelect(vet),
                  }}
                >
                  <Popup>
                    <div className="popup-container">
                      <h4>{vet.tags.name || 'Veterinary Clinic'}</h4>
                      <p>📍 {vet.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${vet.lat},${vet.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="directions-btn"
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <button
              className="location-btn"
              onClick={() => setCurrentLocation(currentLocation)}
            >
              📍
            </button>
          </div>

          <div className="shop-container animate-on-scroll">
            <h3 className="shop-title">Available Veterinarians</h3>
            {loading ? (
              <p className="loading-text">Loading nearby veterinarians...</p>
            ) : veterinarians.length > 0 ? (
              <div className="shop-grid">
                {veterinarians.map((vet, index) => (
                  <div
                    key={index}
                    className={`shop-card ${selectedVet && selectedVet.lat === vet.lat ? 'selected' : ''}`}
                    onClick={() => handleVetSelect(vet)}
                  >
                    <div className="shop-icon">🐾</div>
                    <h4>{vet.tags.name || 'Veterinary Clinic'}</h4>
                    <p className="shop-address">📍 {vet.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${vet.lat},${vet.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-btn"
                    >
                      Get Directions
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="loading-text">No nearby veterinarians found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Updated About Section with Toggleable Content */}
      <section className="about-shops-section animate-on-scroll">
        <div className="about-content">
          <p className="about-us-text">🌟 About Veterinarians</p>
          <h2>Why Choose a Local Vet?</h2>
          <p>
            Local veterinarians provide expert care and emergency services for your pets. Petverse connects you with professionals dedicated to your pet's health, offering personalized treatment plans and 24/7 support when needed.
          </p>
          <button className="about-more-btn" onClick={toggleMoreInfo}>
            {showMoreInfo ? 'Show Less' : 'Learn More'}
          </button>
          {showMoreInfo && (
            <div className="more-info-content">
              <h3>Benefits of Local Veterinary Care</h3>
              <ul>
                <li><strong>Expertise:</strong> Access to vets with specialized skills in various pet health fields.</li>
                <li><strong>Emergency Services:</strong> Many local vets offer round-the-clock care for urgent situations.</li>
                <li><strong>Personalized Care:</strong> Build a relationship with a vet who knows your pet’s history.</li>
                <li><strong>Convenience:</strong> Quick access to appointments without long travel times.</li>
              </ul>
              <h3>Tips for Visiting a Vet</h3>
              <p>
                Bring your pet’s medical history, prepare a list of questions, and ensure the clinic has emergency support. Check reviews and visit in person to assess cleanliness and staff expertise.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Added Services Section */}
      <section className="services-section animate-on-scroll">
        <h2 className="section-title">Our Veterinary Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Routine Checkups</h3>
            <p>Ensure your pet’s health with regular visits to a local vet for vaccinations and exams.</p>
          </div>
          <div className="service-card">
            <h3>Emergency Care</h3>
            <p>Access 24/7 emergency services for unexpected pet health issues.</p>
          </div>
          <div className="service-card">
            <h3>Specialized Treatments</h3>
            <p>Get expert care for dental, dermatological, or exotic pet needs.</p>
          </div>
        </div>
      </section>

      {/* Expanded Testimonials Section */}
      <section className="testimonials-section animate-on-scroll">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Found an amazing vet nearby thanks to Petverse!"</p>
            <span>- Emily R.</span>
          </div>
          <div className="testimonial-card">
            <p>"Quick and caring service for my pet's emergency."</p>
            <span>- Michael T.</span>
          </div>
          <div className="testimonial-card">
            <p>"The vet’s expertise saved my cat—highly recommend!"</p>
            <span>- Sarah L.</span>
          </div>
        </div>
      </section>

      {/* Added Tips Section */}
      <section className="tips-section animate-on-scroll">
        <h2 className="section-title">Pet Health Tips</h2>
        <div className="tips-content">
          <h3>Preparing for Your Vet Visit</h3>
          <ul>
            <li><strong>Medical History:</strong> Bring records of past treatments or vaccinations.</li>
            <li><strong>Questions:</strong> Ask about diet, behavior, or specific health concerns.</li>
            <li><strong>Comfort:</strong> Keep your pet calm with familiar items like a toy.</li>
            <li><strong>Follow-Up:</strong> Schedule regular checkups to monitor health progress.</li>
          </ul>
        </div>
      </section>

      {/* Added CTA Section */}
      <section className="nearby-doc-cta-section animate-on-scroll">
        <h2 className="section-title">Ready to Care for Your Pet?</h2>
        <p>Find the best veterinarians near you with Petverse. Ensure your pet’s health with expert care today!</p>
        <button className="cta-btn" onClick={handleFindVetClick}>
          Find a Vet Now
        </button>
      </section>
    </div>
  );
};

export default NearbyDoctors;