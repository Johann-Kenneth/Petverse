import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/generate", async (req, res) => {
    const { petType, age, traits, count = 5 } = req.query;

    if (!petType || !age || !traits) {
        return res.status(400).json({ error: "Missing parameters (petType, age, traits)" });
    }

    try {
        const response = await axios.get("https://api.jsongpt.com/json", {
            params: {
                prompt: `Generate ${count} unique names for a ${age}-year-old ${traits} ${petType}. The names should be diverse, including cute, mythological, funny, and exotic options.`,
                names: "array of pet names"
            }
        });

        if (!response.data.names || response.data.names.length === 0) {
            return res.status(500).json({ error: "Failed to generate enough pet names" });
        }

        res.json({ petNames: response.data.names });
    } catch (error) {
        console.error("Error fetching pet names:", error.message);
        res.status(500).json({ error: "Failed to fetch pet names" });
    }
});

export default router;
