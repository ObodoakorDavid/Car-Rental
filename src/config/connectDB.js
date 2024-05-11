import mongoose from "mongoose";

const connectDB = async (url) => {
  return await mongoose.connect(url, {
    dbName: "CAR-RENTAL",
  });
};

export default connectDB;
