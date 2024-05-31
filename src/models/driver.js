import mongoose from "mongoose";
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide an a username"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    },
    age: {
      type: String,
      trim: true,
      required: [true, "Please provide an age"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Please provide a location"],
    },
    healthStatus: {
      type: String,
      trim: true,
      required: [true, "Please provide a health status"],
    },
    backCheck: {
      type: String,
      trim: true,
      required: [true, "Please provide back check"],
    },
    training: {
      type: String,
      trim: true,
      required: [true, "Please provide training"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [
        /^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/,
        "Please enter a valid Nigerian phone number",
      ],
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Please provide years of experience"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide a date of birth"],
    },
    licenseIssueDate: {
      type: String,
      required: [true, "Please provide a license Issue Date"],
    },
    licenseExpiryDate: {
      type: String,
      required: [true, "Please provide a license Expiry Date"],
    },
    licenseClass: {
      type: String,
      required: [true, "Please provide a license Class"],
    },
    accidentHistory: {
      type: String,
      required: [true, "Please provide an accident History"],
    },
    moreInfo: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "DriverBooking",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Driver", driverSchema);
