// backend/models/Vaccination.js
import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema({
  dog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  vaccine_name: { type: String, required: true },
  due_date: { type: String, required: true },
  due_time: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

export default mongoose.model('Vaccination', vaccinationSchema);