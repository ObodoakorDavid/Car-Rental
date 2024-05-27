import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

// Utility function to validate MongoDB ObjectId
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

// Custom time validation function
const isValidTime = (value) => {
  return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
};

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

export const validateDriverBooking = [
  body("driverId")
    .exists()
    .withMessage("driverId is required")
    .custom(isMongoId)
    .withMessage("Invalid driver ID"),

  body("pickUpLocation")
    .exists()
    .withMessage("pickUpDate is required")
    .isString()
    .withMessage("Pick up location must be a string"),

  body("date")
    .exists()
    .withMessage("Please provide a date")
    .isISO8601()
    .withMessage("Date picked must be a valid date"),

  body("time")
    .exists()
    .withMessage("Please provide a time")
    .custom(isValidTime)
    .withMessage("Time must be a valid time in HH:mm:ss format"),

  body("duration")
    .exists()
    .withMessage("Duration is required")
    .isNumeric()
    .withMessage("Duration should be a number"),

  body("totalPrice")
    .exists()
    .withMessage("TotalPrice is required")
    .isNumeric()
    .withMessage("TotalPrice should be a number"),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "success"])
    .withMessage("Payment status should either be pending or success"),

  handleValidationErrors,
];

export const validateObjectId = [
  param("id").custom(isMongoId).withMessage("Invalid booking ID"),

  handleValidationErrors,
];
