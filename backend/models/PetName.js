import mongoose from "mongoose";

const petNameSchema = new mongoose.Schema({
    userId: String,  
    breed: String,
    gender: String,
    personality: String,
    names: [String],  
    createdAt: { type: Date, default: Date.now },
});

const PetName = mongoose.model("PetName", petNameSchema);
export default PetName;
