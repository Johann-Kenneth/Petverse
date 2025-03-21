// src/components/PetPassport.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './PetPassport.css';

const PetPassport = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    petName: '',
    medicalHistory: '',
    allergies: '',
    vetContact: '',
    emergencyContact: '',
  });
  const [savedPetData, setSavedPetData] = useState(null); // State for displayed data
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initial state for resetting the form
  const initialFormData = {
    petName: '',
    medicalHistory: '',
    allergies: '',
    vetContact: '',
    emergencyContact: '',
  };

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPetData(currentUser.uid);
      } else {
        navigate('/signin');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch existing pet data from Firestore
  const fetchPetData = async (uid) => {
    console.log('Fetching pet data for UID:', uid);
    try {
      const docRef = doc(db, 'petPassports', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSavedPetData(docSnap.data()); // Update displayed data
      } else {
        setSavedPetData(null); // No data exists yet
      }
    } catch (err) {
      console.error('Error fetching pet data:', err);
      setError('Failed to load pet data.');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await setDoc(docRef, formData, { merge: true });
      setSuccessMessage('Pet Passport updated successfully!');
      // Clear the form by resetting formData
      setFormData(initialFormData);
      // Fetch the latest data to update the displayed details
      await fetchPetData(user.uid);
    } catch (err) {
      console.error('Error saving pet data:', err);
      if (err.code === 'permission-denied') {
        setError('You do not have permission to save this data.');
      } else {
        setError('Failed to save pet data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

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
            value={formData.petName}
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
            value={formData.medicalHistory}
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
            value={formData.allergies}
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
            value={formData.vetContact}
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
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency contact name and phone number"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Pet Passport'}
        </button>
      </form>

      {/* Display saved data */}
      {savedPetData && (
        <div className="pet-passport-details">
          <h2>Your Pet's Information</h2>
          {savedPetData.petName && <p><strong>Pet Name:</strong> {savedPetData.petName}</p>}
          {savedPetData.medicalHistory && <p><strong>Medical History:</strong> {savedPetData.medicalHistory}</p>}
          {savedPetData.allergies && <p><strong>Allergies:</strong> {savedPetData.allergies}</p>}
          {savedPetData.vetContact && <p><strong>Vet Contact:</strong> {savedPetData.vetContact}</p>}
          {savedPetData.emergencyContact && <p><strong>Emergency Contact:</strong> {savedPetData.emergencyContact}</p>}
        </div>
      )}
    </div>
  );
};

export default PetPassport;