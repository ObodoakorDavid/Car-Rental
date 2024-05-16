import mongoose from "mongoose";
const { Schema } = mongoose;

const priceSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      enum: {
        values: ["escort", "driver"],
        message: "name must be either 'escort', 'driver'",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Price", priceSchema);
