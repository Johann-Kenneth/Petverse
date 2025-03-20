import mongoose from 'mongoose';

const PetAlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['missing', 'found'], default: 'missing' },
  imageUrl: { type: String },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const PetAlert = mongoose.model('PetAlert', PetAlertSchema);
