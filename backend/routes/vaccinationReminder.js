// backend/routes/vaccinationReminder.js
import express from 'express';
import Vaccination from '../models/Vaccination.js';

const router = express.Router();

// Add a dog
router.post('/dogs', async (req, res) => {
  try {
    const { name, email, phoneNumber, birth_date } = req.body;
    if (!name || !email || !phoneNumber || !birth_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newDog = new Dog({
      name,
      owner_email: email,
      phone_number: phoneNumber,
      birth_date,
    });

    const savedDog = await newDog.save();
    res.status(201).json({ message: 'Dog added successfully', dog_id: savedDog._id });
  } catch (error) {
    console.error('Error adding dog:', error);
    res.status(500).json({ error: 'Failed to add dog' });
  }
});

// Add a vaccination
router.post('/vaccinations', async (req, res) => {
  try {
    const { dog_id, vaccine_name, due_date, vaccination_time } = req.body;
    if (!dog_id || !vaccine_name || !due_date || !vaccination_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (due_date < today) {
      return res.status(400).json({ error: 'Vaccination date cannot be in the past' });
    }

    const newVaccination = new Vaccination({
      dog_id,
      vaccine_name,
      due_date,
      due_time: vaccination_time,
      status: 'pending',
    });

    await newVaccination.save();
    res.status(201).json({ message: 'Vaccination scheduled successfully' });
  } catch (error) {
    console.error('Error adding vaccination:', error);
    res.status(500).json({ error: 'Failed to add vaccination' });
  }
});

// Get vaccinations for a dog
router.get('/vaccinations/:dog_id', async (req, res) => {
  try {
    const dogId = req.params.dog_id;
    const vaccinations = await Vaccination.find({ dog_id: dogId });
    res.json(
      vaccinations.map((vaccination) => ({
        vaccine: vaccination.vaccine_name,
        due_date: vaccination.due_date,
        vaccination_time: vaccination.due_time,
        status: vaccination.status,
      }))
    );
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ error: 'Failed to fetch vaccinations' });
  }
});

export default router;