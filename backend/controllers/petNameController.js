import { OpenAI } from "openai";
import PetName from "../models/PetName.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generatePetName = async (req, res) => {
  try {
    const { traits, age, breed, gender, size  } = req.body;

    if (!traits || !age || !breed || !gender || !size) {
      return res.status(400).json({ error: "Please provide pet details: traits, age, breed, gender, and size." });
    }

    // Generate a pet name using OpenAI
    const prompt = `Suggest 5 unique pet names for a ${gender} ${breed} that is ${personality}. 
Return only the names in a numbered list format like:
1. Name1
2. Name2
3. Name3
4. Name4
5. Name5`;


    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
    });

    const petName = response.choices[0].message.content.trim();

    // Save to database
    const newPetName = new PetName({ name: petName, traits });
    await newPetName.save();

    res.json({ petName });
  } catch (error) {
    console.error("Error generating pet name:", error);
    res.status(500).json({ error: "Failed to generate pet name." });
  }
};
