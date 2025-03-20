import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged, updateEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Profile.css';

const Profile = ({ onProfileSave }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async (uid) => {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({
            name: docSnap.data().name || 'No name provided',
            email: docSnap.data().email || 'No email provided',
            bio: docSnap.data().bio || '',
            profilePic: docSnap.data().profilePic || ''
          });
        } else {
          console.log('No user document found. Initializing with default values...');
          await setDoc(docRef, {
            name: 'No name provided',
            email: auth.currentUser?.email || 'No email provided',
            bio: '',
            profilePic: ''
          });
          setUserData({
            name: 'No name provided',
            email: auth.currentUser?.email || 'No email provided',
            bio: '',
            profilePic: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserProfile(currentUser.uid);
      }
    });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Check if the document exists
      const docSnap = await getDoc(userDocRef);
      let imageUrl = userData.profilePic;

      // Upload the profile picture if a new one is selected
      if (newProfilePic) {
        const imageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, newProfilePic);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Prepare the updated data
      const updatedData = {
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
        profilePic: imageUrl
      };

      // Update or create the document based on existence
      if (docSnap.exists()) {
        await updateDoc(userDocRef, updatedData);
      } else {
        await setDoc(userDocRef, updatedData);
      }

      // Update Email in Firebase Authentication (optional)
      if (auth.currentUser.email !== userData.email) {
        await updateEmail(auth.currentUser, userData.email);
      }

      // Update local state with the new data
      const newUserData = { ...userData, profilePic: imageUrl };
      setUserData(newUserData);
      console.log('Profile updated successfully');
      setIsEditing(false);

      // Notify the parent (e.g., App.js) with the updated username
      if (onProfileSave) {
        onProfileSave(newUserData.name); // Pass the updated name
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-container">
            <img src={userData.profilePic || 'default-profile.png'} alt="Profile" className="profile-pic" />
            {isEditing && <input type="file" accept="image/*" onChange={handleProfilePicChange} />}
          </div>
          <h2 className="profile-title">{userData.name}</h2>
          <p className="profile-bio">{userData.bio || 'No bio provided'}</p>
        </div>

        <div className="profile-field">
          <label>Name:</label>
          <input type="text" name="name" value={userData.name} onChange={handleChange} disabled={!isEditing} />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <input type="text" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
        </div>
        <div className="profile-field">
          <label>Bio:</label>
          <textarea name="bio" value={userData.bio} onChange={handleChange} disabled={!isEditing} />
        </div>

        <div className="profile-buttons">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
          ) : (
            <button className="save-button" onClick={handleSave}>Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;