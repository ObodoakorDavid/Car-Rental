import { body, validationResult } from "express-validator";
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
  if (errors.array().length > 0) {
    console.log(errors.array()[0].msg);
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const validateCarBooking = [
  body("carId")
    .exists()
    .withMessage("carId is required")
    .custom(isMongoId)
    .withMessage("Invalid Car ID"),

  body("pickUpDate")
    .exists()
    .withMessage("pickUpDate is required")
    .isISO8601()
    .withMessage("pickUpDate must be a valid date"),

  body("pickUpTime")
    .exists()
    .withMessage("pickUpTime is required")
    .custom(isValidTime)
    .withMessage("Pick-up time must be a valid time in HH:mm:ss format"),

  body("duration").exists().withMessage("Duration is required"),

  body("quantity")
    .exists()
    .withMessage("Please provide a quantity")
    .notEmpty()
    .withMessage("quantity can't be empty")
    .isInt({ min: 1 })
    .withMessage("quantity must be a positive integer"),

  body("address")
    .exists()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),

  body("withinLagos")
    .exists()
    .withMessage("withinLagos is required")
    .isBoolean()
    .withMessage("Within Lagos must be a boolean"),

  body("escortNeeded")
    .exists()
    .withMessage("escortNeeded is required")
    .isBoolean()
    .withMessage("Escort needed must be a boolean"),

  body("driverNeeded")
    .exists()
    .withMessage("driverNeeded is required")
    .isBoolean()
    .withMessage("Driver needed must be a boolean"),

  body("totalPrice")
    .exists()
    .withMessage("Total price is required")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),

  body("datePicked")
    .optional()
    .isISO8601()
    .withMessage("Date picked must be a valid date"),

  body("dateReturned")
    .optional()
    .isISO8601()
    .withMessage("Date returned must be a valid date"),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "success"])
    .withMessage("Invalid payment status"),

  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "completed"])
    .withMessage("Invalid booking status"),

  handleValidationErrors,
];

export const validateUpdateCarBooking = [
  body("status")
    .exists()
    .withMessage("status is required")
    .isIn(["pending", "approved", "rejected", "completed"])
    .withMessage("Invalid booking status"),

  body("driverId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid driver ID"),

  handleValidationErrors,
];
