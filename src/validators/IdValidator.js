import { param, validationResult } from "express-validator";
import mongoose from "mongoose";

// Utility function to validate MongoDB ObjectId
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const validateParamId = (paramName) => [
  param(paramName).custom((value) => {
    if (!isMongoId(value)) {
      throw new Error("Invalid ID");
    }
    return true;
  }),
  handleValidationErrors,
];
