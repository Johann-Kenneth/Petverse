import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

let petfinderToken = "";

// Function to get a PetFinder token
const getPetfinderToken = async () => {
  try {
    const response = await axios.post(
      "https://api.petfinder.com/v2/oauth2/token",
      {
        grant_type: "client_credentials",
        client_id: process.env.PETFINDER_CLIENT_ID,
        client_secret: process.env.PETFINDER_CLIENT_SECRET,
      }
    );
    petfinderToken = response.data.access_token;
  } catch (error) {
    console.error("Error fetching PetFinder token:", error.response?.data || error);
  }
};
router.get("/adoptable-pets", async (req, res) => {
    const { location, type = "dog" } = req.query;
  
    try {
      if (!petfinderToken) await getPetfinderToken();
  
      const response = await axios.get(
        `https://api.petfinder.com/v2/animals?type=${type}&location=${location}&limit=10`,
        {
          headers: { Authorization: `Bearer ${petfinderToken}` },
        }
      );
  
      res.json(response.data.animals);
    } catch (error) {
      console.error("Error fetching adoptable pets:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch adoptable pets" });
    }
  });
  router.get("/pet-shelters", async (req, res) => {
    const { location } = req.query;
  
    try {
      if (!petfinderToken) await getPetfinderToken();
  
      const response = await axios.get(
        `https://api.petfinder.com/v2/organizations?location=${location}&limit=10`,
        {
          headers: { Authorization: `Bearer ${petfinderToken}` },
        }
      );
  
      res.json(response.data.organizations);
    } catch (error) {
      console.error("Error fetching pet shelters:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch pet shelters" });
    }
  });
  export default router;
    
