// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './components/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SignIn from './components/signin';
import SignUp from './components/signup';
import Dashboard from './components/Dashboard';
import NearbyPetShops from './components/NearbyPetShops';
import NearbyDoctors from './components/NearbyDoctors';
import Profile from './components/Profile';
import PostAlert from './components/PostAlert';
import MissingPets from './components/MissingPets';
import TrainingVideos from './components/TrainingVideos';
import PetNameGenerator from './components/PetNameGenerator';
import PetShelters from './components/PetShelters';
import AdoptablePets from './components/AdoptablePets';
import { fetchAdoptablePets, fetchPetShelters } from './utils/petfinderAPI';
import ServiceDetails from './components/ServiceDetails';
import Loading from './components/Loading';
import About from './components/About';
import Pages from './components/Pages';
import Contact from './components/Contact';
import PetFoodRecommendation from './components/PetFoodRecommendation';
import PetPassport from './components/PetPassport';
import PetFirstAidGuide from './components/PetFirstAidGuide'; // Add the new component
import Layout from './components/Layout';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [navbarUserData, setNavbarUserData] = useState({
    name: 'No name provided',
    email: 'No email provided'
  });

  useEffect(() => {
    async function fetchData() {
      const pets = await fetchAdoptablePets();
      console.log('Adoptable Pets:', pets);

      const shelters = await fetchPetShelters();
      console.log('Pet Shelters:', shelters);
    }
    fetchData();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setNavbarUserData({
          name: docSnap.data().name || 'No name provided',
          email: docSnap.data().email || 'No email provided'
        });
      } else {
        setNavbarUserData({
          name: 'No name provided',
          email: auth.currentUser?.email || 'No email provided'
        });
      }
    } catch (error) {
      console.error('Error fetching user data for navbar:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileSave = (newName) => {
    if (auth.currentUser) {
      setNavbarUserData((prev) => ({
        ...prev,
        name: newName || prev.name
      }));
      fetchUserData(auth.currentUser.uid);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <Layout userName={navbarUserData.name}>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/nearby-pet-shops"
          element={
            <Layout userName={navbarUserData.name}>
              <NearbyPetShops />
            </Layout>
          }
        />
        <Route
          path="/nearby-doctors"
          element={
            <Layout userName={navbarUserData.name}>
              <NearbyDoctors />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout userName={navbarUserData.name} onProfileSave={handleProfileSave}>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/post-alert"
          element={
            <Layout userName={navbarUserData.name}>
              <PostAlert />
            </Layout>
          }
        />
        <Route
          path="/pet-shelters"
          element={
            <Layout userName={navbarUserData.name}>
              <PetShelters />
            </Layout>
          }
        />
        <Route
          path="/missing-pets"
          element={
            <Layout userName={navbarUserData.name}>
              <MissingPets />
            </Layout>
          }
        />
        <Route
          path="/training-videos"
          element={
            <Layout userName={navbarUserData.name}>
              <TrainingVideos />
            </Layout>
          }
        />
        <Route
          path="/pet-name"
          element={
            <Layout userName={navbarUserData.name}>
              <PetNameGenerator />
            </Layout>
          }
        />
        <Route
          path="/adoptable-pets"
          element={
            <Layout userName={navbarUserData.name}>
              <AdoptablePets />
            </Layout>
          }
        />
        
        <Route
          path="/service-details"
          element={
            <Layout userName={navbarUserData.name}>
              <ServiceDetails />
            </Layout>
          }
        />
        <Route
          path="/pet-passport"
          element={
            <Layout userName={navbarUserData.name}>
              <PetPassport />
            </Layout>
          }
        />
  
        <Route
          path="/pet-first-aid"
          element={
            <Layout userName={navbarUserData.name}>
              <PetFirstAidGuide />
            </Layout>
          }
        />
        <Route
          path="/Loading"
          element={
            <Layout userName={navbarUserData.name}>
              <Loading />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout userName={navbarUserData.name}>
              <About />
            </Layout>
          }
        />
        <Route
          path="/pages"
          element={
            <Layout userName={navbarUserData.name}>
              <Pages />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout userName={navbarUserData.name}>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/pet-food-recommendation"
          element={
            <Layout userName={navbarUserData.name}>
              <PetFoodRecommendation />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;