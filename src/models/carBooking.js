import mongoose from "mongoose";
const { Schema } = mongoose;

const carBookingSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    car: {
      type: mongoose.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickUpDate: {
      type: String,
      required: true,
    },
    pickUpTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    withinLagos: {
      type: Boolean,
      default: false,
    },
    escortNeeded: {
      type: Boolean,
      default: true,
    },
    driverNeeded: {
      type: Boolean,
      default: true,
    },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
    datePicked: {
      type: Date,
    },
    dateReturned: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "success", "failed"],
        message:
          "paymentStatus must either be 'pending' or 'success' or 'failed' ",
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

export default mongoose.model("CarBooking", carBookingSchema);
