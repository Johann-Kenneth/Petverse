import axios from "axios";

// Base URLs
const TOKEN_URL = "https://api.petfinder.com/v2/oauth2/token";
const API_BASE_URL = "https://api.petfinder.com/v2";

// Load credentials (use environment variables in production)
const CLIENT_ID = process.env.REACT_APP_PETFINDER_API_KEY || "rt9ep2ATSQVE9IJuDVX70NGLEdlw2MHYeJAVW4PM0q4tEJfdSw";
const CLIENT_SECRET = process.env.REACT_APP_PETFINDER_SECRET || "YRxOfj5jXL8cLhZYlauPoSFuGtdfbRsFQzDDvrFV";

// Hardcoded token (for testing only, remove in production)
const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJydDllcDJBVFNRVkU5SUp1RFZYNzBOR0xFZGx3Mk1IWWVKQVZXNFBNMHE0dEVKZmRTdyIsImp0aSI6IjcyODZiMGE1NjRlODYyZWI0Y2UxYjUyYmI2ZWJhYmRlMTUwOTc5NTUyYzZhZjdhODg3YjRiNGMzMmYzZjZmZmFiYTIxZjE3ZGFkYzkzNjEzIiwiaWF0IjoxNzQwOTc5ODg4LCJuYmYiOjE3NDA5Nzk4ODgsImV4cCI6MTc0MDk4MzQ4OCwic3ViIjoiIiwic2NvcGVzIjpbXX0.vHqT-3GJRlJYzxm8IIE7GPUr-mUjj1sNisYlqmd5uJpGH3ZVepVZQMbdxxSKPHsYFDSx-93XAt2a_ooSlPHcBGDXwP3Q8L-7xdDk32DY1uqA8u49gUP_H_DDd4EfJUeDruVpQMqhuDX_U7oGKoC_Ak8FuCh2joXLKLDuKQOqAkwM0tmmpxjDlEF15gOK0ltZpz7i_DCHerBRNIvb8J0HgA3wANz0d9NRLcZ-C225labmBTFUK7Movsfh3xvmmguOiRB3DPs_7nzRDXdNwPiUbvMJliY7g8C8b0S2HSbhgvC59WGj6pT6i_mz3LpR-HZGmIhaS2zE54sCEJy5hU2fpA";

// Function to get a fresh access token
export const getAccessToken = async () => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("🚨 Missing API credentials");
      return null;
    }

    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error fetching PetFinder API token:", error.response?.data || error.message);
    return null;
  }
};

// Function to fetch pets (for reference)
export const fetchPets = async () => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}/animals`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use dynamic token
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching pets:", error);
    return null;
  }
};

// Function to fetch nearby adoptable pets
export const fetchAdoptablePets = async (location) => {
  console.log("fetchAdoptablePets called with location:", location); // Debug

  // Skip if location is empty or undefined
  if (!location || typeof location !== "string") {
    console.log("Invalid or empty location, skipping fetch.");
    return [];
  }

  // Check format but don't throw—just return empty if invalid
  const trimmedLocation = location.trim();
  const isZip = /^\d{5}$/.test(trimmedLocation);
  const isCityState = /^[\w\s]+,\s*[A-Z]{2}$/.test(trimmedLocation);
  if (!isZip && !isCityState) {
    console.log("Location format invalid, returning empty:", trimmedLocation);
    return [];
  }

  const token = await getAccessToken();
  if (!token) {
    console.error("No token obtained.");
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/animals`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { 
        location: trimmedLocation, 
        type: "Dog", // Single type for simplicity
        limit: 10 
      },
    });
    return response.data.animals || [];
  } catch (error) {
    console.error("Error fetching adoptable pets:", error.response?.data || error);
    return []; // Return empty on error (e.g., 400 Bad Request)
  }
};

// Function to fetch nearby pet shelters
export const fetchPetShelters = async (location) => {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await axios.get(`${API_BASE_URL}/organizations`, { // Fixed endpoint
      headers: { Authorization: `Bearer ${token}` }, // Use dynamic token
      params: { location: location || undefined, limit: 10 }, // Handle empty location
    });

    return response.data.organizations;
  } catch (error) {
    console.error("Error fetching pet shelters:", error);
    return [];
  }
};