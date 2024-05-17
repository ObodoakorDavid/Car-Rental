import mongoose from "mongoose";

const { Schema } = mongoose;

const UserProfileSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
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
    roles: {
      type: [String],
      enum: ["user", "admin", "driver"],
      default: ["user"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    },
    nin: {
      type: String,
      required: [true, "Please provide an NIN Number"],
      minlength: [11, "NIN Invalid"],
      maxLength: [11, "NIN Invalid"],
    },
    booking: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "booking",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserProfile", UserProfileSchema);
