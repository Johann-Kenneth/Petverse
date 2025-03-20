// geminiConfig.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your actual Gemini API key
const API_KEY = 'AIzaSyA6y46SP9Lo2sfWg8e07bXTHP-eMWauGCM';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    throw new Error('Failed to generate recommendations. Please try again later.');
  }
};