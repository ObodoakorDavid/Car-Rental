import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  description: String, // Optional description for the image
});

const carSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    plateNo: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Price per day must be a positive number.",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maxPower: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: {
      type: [imageSchema],
      required: true,
      default: [], // Ensures images is an array by default
      validate: {
        validator: function (v) {
          return v.length <= 4;
        },
        message: "A car can have a maximum of 4 images.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Car", carSchema);
