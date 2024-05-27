import mongoose from "mongoose";
const { Schema } = mongoose;

const driverBookingSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "success"],
        message: "paymentStatus must either be 'pending' or 'success' ",
      },
      default: "pending",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "completed"],
        message:
          "Status must be either 'pending', 'approved', 'rejected' or 'completed'",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DriverBooking", driverBookingSchema);
