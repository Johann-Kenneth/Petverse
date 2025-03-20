import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { PetAlert } from "../models/PetAlert.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'pet_alerts' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Post a missing pet alert
router.post("/post-alert", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);  // ✅ Log request body
    console.log(req.file);  // ✅ Log uploaded file

    const { title, description, status, userId } = req.body;
    if (!title || !description || !status || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Ensure image handling
    let imageUrl = "";
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer); // ✅ Upload image to Cloudinary
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }


    // ✅ Insert into MongoDB
    const newAlert = new PetAlert({
      title,
      description,
      status,
      userId,
      image: imageUrl,
    });

    await newAlert.save();

    res.status(201).json({ message: "Pet alert posted successfully!" });
  } catch (error) {
    console.error("Error saving alert:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch missing pet alerts
router.get("/", async (req, res) => {
  try {
    const missingPets = await PetAlert.find({ status: "missing" }).sort({ timestamp: -1 });
    res.json(missingPets);
  } catch (error) {
    console.error("Error fetching missing pets:", error);
    res.status(500).json({ error: "Failed to retrieve missing pet alerts" });
  }
});

// Update pet alert status
router.put("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["missing", "found"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedAlert = await PetAlert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAlert) {
      return res.status(404).json({ error: "Pet alert not found" });
    }

    return res.json({ message: "Pet status updated successfully!", updatedAlert });
  } catch (error) {
    console.error("Error updating pet status:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Mark a pet as found
router.put("/mark-as-found/:id", async (req, res) => {
  try {
    const petAlert = await PetAlert.findById(req.params.id);
    if (!petAlert) {
      return res.status(404).json({ error: "Pet alert not found" });
    }

    petAlert.status = "found";
    await petAlert.save();

    return res.json({ message: "Pet marked as found" });
  } catch (error) {
    console.error("Error marking pet as found:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
