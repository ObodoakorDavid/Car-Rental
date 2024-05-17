import mongoose from "mongoose";
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please provide an a username"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please provide an last name"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
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
      required: true,
    },
    isAvailble: {
      type: Boolean,
      default: false,
    },
    trips: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Driver", driverSchema);
