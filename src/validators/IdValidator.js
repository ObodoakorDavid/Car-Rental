import { param, validationResult } from "express-validator";
import mongoose from "mongoose";

// Utility function to validate MongoDB ObjectId
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.array().length > 0) {
    console.log(errors.array()[0].msg);
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const validateParamId = (paramName) => [
  param(paramName).isMongoId().withMessage("Invalid ID"),
  handleValidationErrors,
];
