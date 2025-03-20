import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { useNavigate, Link } from 'react-router-dom';
import './NearbyPetShops.css';
import { motion } from "framer-motion";

// Custom pet shop icon
const petShopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050525.png',
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

const NearbyPetShops = () => {
  const [currentLocation, setCurrentLocation] = useState([20.5937, 78.9629]); // Default: India
  const [places, setPlaces] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false); // State to toggle "Learn More" content

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

  // Fetch nearby pet shops
  useEffect(() => {
    const fetchPlaces = async () => {
      const query = `[out:json];
        node["shop"="pet"](${currentLocation[0] - 0.2},${currentLocation[1] - 0.2},${currentLocation[0] + 0.2},${currentLocation[1] + 0.2});
        out;`;

      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await axios.get(url);
        const fetchedPlaces = response.data.elements;

        const placesWithAddress = await Promise.all(
          fetchedPlaces.map(async (place) => {
            const addressUrl = `https://nominatim.openstreetmap.org/reverse?lat=${place.lat}&lon=${place.lon}&format=json`;
            try {
              const addressResponse = await axios.get(addressUrl);
              const address = addressResponse.data.display_name;
              return { ...place, address };
            } catch (error) {
              console.error('Error fetching address:', error);
              return { ...place, address: 'Address unavailable' };
            }
          })
        );
        setPlaces(placesWithAddress);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
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

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    const map = document.querySelector('.map').leafletMap;
    if (map) map.setView([shop.lat, shop.lon], 14);
  };

  const handleFindShopClick = () => {
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
      const navbarHeight = 60;
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
      {/* Enhanced Hero Section */}
      <section className="hero-section animate-on-scroll">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          poster="https://i.pinimg.com/474x/df/25/61/df2561d8c581d0cf82057a4bc558eff7.jpg"
        >
          <source src="/videos/petshop-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
          <img
            src="https://i.pinimg.com/474x/df/25/61/df2561d8c581d0cf82057a4bc558eff7.jpg"
            alt="Fallback"
            className="fallback-image"
          />
        </video>
        <div className="hero-content">
          <span className="shop-icon">🛒</span>
          <p className="welcome-text">🌟 Discover Pet Care Excellence</p>
          <h2>Find Nearby Pet Shops & Grooming Centers</h2>
          <p className="hero-description">
            From premium pet supplies to top-notch grooming services, Petverse connects you with trusted local pet shops. Ensure your furry friends get the best care with ease and convenience—explore now and pamper your pets today!
          </p>
          <div className="button-container">
            <button className="book-schedule-btn" onClick={handleFindShopClick}>
              Find a Shop <span>▶</span>
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
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
              {places.map((place, index) => (
                <Marker
                  key={index}
                  position={[place.lat, place.lon]}
                  icon={petShopIcon}
                  eventHandlers={{
                    click: () => handleShopSelect(place),
                  }}
                >
                  <Popup>
                    <div className="popup-container">
                      <h4>{place.tags.name || 'Pet Shop'}</h4>
                      <p>📍 {place.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
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
            <button className="location-btn" onClick={() => setCurrentLocation(currentLocation)}>
              📍
            </button>
          </div>

          <div className="shop-container animate-on-scroll">
            <h3 className="shop-title">Available Pet Shops</h3>
            {places.length > 0 ? (
              <div className="shop-grid">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className={`shop-card ${selectedShop && selectedShop.lat === place.lat ? 'selected' : ''}`}
                    onClick={() => handleShopSelect(place)}
                  >
                    <div className="shop-icon">🐾</div>
                    <h4>{place.tags.name || 'Pet Shop'}</h4>
                    <p className="shop-address">📍 {place.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
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
              <p className="loading-text">Fetching nearby pet shops...</p>
            )}
          </div>
        </div>
      </section>

      {/* Updated About Shops Section with Toggleable "Learn More" Content */}
      <section className="about-shops-section animate-on-scroll">
        <div className="about-content">
          <p className="about-us-text">🌟 About Pet Shops</p>
          <h2>Why Choose Local Pet Shops?</h2>
          <p>
            Local pet shops offer personalized care and a wide range of products for your furry friends. At Petverse, we connect you with trusted providers to ensure your pets get the best service, from high-quality pet food to grooming essentials.
          </p>
          <button className="about-more-btn" onClick={toggleMoreInfo}>
            {showMoreInfo ? 'Show Less' : 'Learn More'}
          </button>
          {showMoreInfo && (
            <div className="more-info-content">
              <h3>Benefits of Supporting Local Pet Shops</h3>
              <ul>
                <li><strong>Personalized Service:</strong> Local shops often know their customers and pets by name, offering tailored recommendations.</li>
                <li><strong>Community Support:</strong> Your purchases help small businesses thrive and contribute to the local economy.</li>
                <li><strong>Unique Products:</strong> Find specialty items like handmade toys or organic treats that big chains might not carry.</li>
                <li><strong>Expert Advice:</strong> Many local shop owners are pet enthusiasts with years of experience to share.</li>
              </ul>
              <h3>Tips for Choosing the Right Pet Shop</h3>
              <p>
                When selecting a pet shop, look for cleanliness, knowledgeable staff, and a welcoming environment for pets. Ask about their sourcing practices for food and products to ensure quality and safety for your pet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Added Services Section */}
      <section className="services-section animate-on-scroll">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Pet Supplies</h3>
            <p>Find everything from food to toys at local pet shops, ensuring your pet’s needs are met with quality products.</p>
          </div>
          <div className="service-card">
            <h3>Grooming Services</h3>
            <p>Book professional grooming sessions to keep your pet looking and feeling their best, with tailored care.</p>
          </div>
          <div className="service-card">
            <h3>Pet Health Advice</h3>
            <p>Get expert tips from local shop staff on maintaining your pet’s health and well-being.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Expanded) */}
      <section className="testimonials-section animate-on-scroll">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Amazing service! Found a great pet shop nearby in minutes."</p>
            <span>- John D.</span>
          </div>
          <div className="testimonial-card">
            <p>"The grooming center was top-notch, thanks to Petverse!"</p>
            <span>- Sarah K.</span>
          </div>
          <div className="testimonial-card">
            <p>"I love how easy it is to find quality pet supplies near me."</p>
            <span>- Emily R.</span>
          </div>
        </div>
      </section>

      {/* Added Tips Section */}
      <section className="tips-section animate-on-scroll">
        <h2 className="section-title">Pet Care Tips</h2>
        <div className="tips-content">
          <h3>Maximizing Your Pet Shop Experience</h3>
          <ul>
            <li><strong>Bring Your Pet:</strong> Many shops allow pets inside—let them explore and choose their favorite toys!</li>
            <li><strong>Ask Questions:</strong> Don’t hesitate to ask staff for advice on products or grooming techniques.</li>
            <li><strong>Check for Deals:</strong> Look for loyalty programs or discounts on bulk purchases.</li>
            <li><strong>Support Events:</strong> Local pet shops often host adoption drives or pet meetups—join in to connect with other pet lovers.</li>
          </ul>
        </div>
      </section>

      {/* Added CTA Section */}
      <section className="nearby-pets-cta-section animate-on-scroll">
        <h2 className="section-title">Ready to Spoil Your Pet?</h2>
        <p>Explore the best pet shops and grooming centers near you with Petverse. Start your journey to exceptional pet care today!</p>
        <button className="cta-btn" onClick={handleFindShopClick}>
          Find a Shop Now
        </button>
      </section>
    </div>
  );
};

export default NearbyPetShops;