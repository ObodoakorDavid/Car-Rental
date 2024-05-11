import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: String, // Optional description for the image
});

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  transmisson: {
    type: String,
    required: true,
  },
  passengers: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  topSpeed: {
    type: String,
    required: true,
  },
  maxPower: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: {
    type: [imageSchema],
    required: true,
  },
});

export default mongoose.model("Car", carSchema);
