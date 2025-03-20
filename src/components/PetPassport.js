// src/components/PetPassport.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Adjust the import path to your Firebase config
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './PetPassport.css'; // We'll create this CSS file next

const PetPassport = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [petData, setPetData] = useState({
    petName: '',
    medicalHistory: '',
    allergies: '',
    vetContact: '',
    emergencyContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPetData(currentUser.uid); // Fetch existing pet data on load
      } else {
        navigate('/signin'); // Redirect to sign-in if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch existing pet data from Firestore
  const fetchPetData = async (uid) => {
    try {
      const docRef = doc(db, 'petPassports', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPetData(docSnap.data());
      }
    } catch (err) {
      console.error('Error fetching pet data:', err);
      setError('Failed to load pet data.');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to save pet data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const docRef = doc(db, 'petPassports', user.uid);
      await setDoc(docRef, petData, { merge: true });
      setSuccessMessage('Pet Passport updated successfully!');
    } catch (err) {
      console.error('Error saving pet data:', err);
      setError('Failed to save pet data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-passport-container">
      <h1>Pet ID</h1>
      <p>Store your pet's critical information for emergencies.</p>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="pet-passport-form">
        <div className="form-group">
          <label htmlFor="petName">Pet Name</label>
          <input
            type="text"
            id="petName"
            name="petName"
            value={petData.petName}
            onChange={handleChange}
            placeholder="Enter your pet's name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="medicalHistory">Medical History</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={petData.medicalHistory}
            onChange={handleChange}
            placeholder="List any medical conditions, surgeries, or treatments"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="allergies">Allergies</label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={petData.allergies}
            onChange={handleChange}
            placeholder="List any allergies (e.g., food, medication)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="vetContact">Vet Contact</label>
          <input
            type="text"
            id="vetContact"
            name="vetContact"
            value={petData.vetContact}
            onChange={handleChange}
            placeholder="Vet's name and phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="emergencyContact">Emergency Contact</label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={petData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency contact name and phone number"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Pet Passport'}
        </button>
      </form>

      {/* Display saved data */}
      {(petData.petName || petData.medicalHistory || petData.allergies || petData.vetContact || petData.emergencyContact) && (
        <div className="pet-passport-details">
          <h2>Your Pet's Information</h2>
          {petData.petName && <p><strong>Pet Name:</strong> {petData.petName}</p>}
          {petData.medicalHistory && <p><strong>Medical History:</strong> {petData.medicalHistory}</p>}
          {petData.allergies && <p><strong>Allergies:</strong> {petData.allergies}</p>}
          {petData.vetContact && <p><strong>Vet Contact:</strong> {petData.vetContact}</p>}
          {petData.emergencyContact && <p><strong>Emergency Contact:</strong> {petData.emergencyContact}</p>}
        </div>
      )}
    </div>
  );
};

export default PetPassport;