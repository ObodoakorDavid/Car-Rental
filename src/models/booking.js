import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new Schema(
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
        values: ["pending", "success"],
        message: "paymentStatus must either be 'pending' or 'success' ",
      },
      default: "pending",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ongoing", "completed", "cancelled"],
        message:
          "Status must be either 'pending', 'ongoing', 'completed' or 'cancelled'",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
