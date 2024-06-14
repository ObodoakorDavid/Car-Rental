import { body, validationResult } from "express-validator";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import customError from "../utils/customError.js";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    console.log(errors.array()[0].msg);
    console.log(errors.array()[0]);
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const validateImages = asyncWrapper((req, res, next) => {
  if (!req.files) {
    throw customError(
      400,
      "Please upload both cover image and one other image"
    );
  }

  const { coverImage, images } = req.files;

  // Check if coverImage and images are present in req.files
  if (!coverImage) {
    throw customError(400, "Please upload both cover image");
  }
  if (!images) {
    throw customError(400, "Please upload at least one other image");
  }

  if (!Array.isArray(images)) {
    throw customError(400, "Images should be an array");
  }

  // Validate coverImage
  if (!coverImage.mimetype.startsWith("image")) {
    throw customError(400, "Cover Image must be an image file");
  }

  // Validate each image in the images array
  for (const image of images) {
    if (!image.mimetype.startsWith("image")) {
      throw customError(400, "All images should be an image file");
    }
  }

  next(); // Proceed to the next middleware
});

export const validateCar = [
  body("brand")
    .exists()
    .withMessage("Please provide a brand")
    .notEmpty()
    .withMessage("brand can't be empty")
    .isString()
    .withMessage("Brand must be a string"),

  body("model")
    .exists()
    .withMessage("Please provide a model")
    .notEmpty()
    .withMessage("Model can't be empty")
    .isString()
    .withMessage("Model must be a string"),

  body("plateNo")
    .exists()
    .withMessage("Please provide a Plate Number")
    .notEmpty()
    .withMessage("transmission can't be empty")
    .isString()
    .withMessage("transmission must be a string"),

  body("color")
    .exists()
    .withMessage("Please provide a color")
    .notEmpty()
    .withMessage("color can't be empty")
    .isString()
    .withMessage("color must be a string"),

  body("pricePerDay")
    .exists()
    .withMessage("Please provide the price per day")
    .isFloat({ min: 0 })
    .withMessage("Price should be higher than 0"),

  body("topSpeed")
    .exists()
    .withMessage("Please provide the top speed for this car")
    .isFloat({ min: 0 })
    .withMessage("Top speed should be a positive number"),

  body("maxPower")
    .exists()
    .withMessage("Please provide the max power for this car")
    .isFloat({ min: 0 })
    .withMessage("Max Power should be a positive number"),

  handleValidationErrors,

  validateImages,
];

export const validateUpdateImages = asyncWrapper((req, res, next) => {
  if (req.files) {
    const { coverImage, images } = req.files;

    // Validate coverImage if provided
    if (coverImage && !coverImage.mimetype.startsWith("image")) {
      throw customError(400, "Cover image must be an image file");
    }

    // Validate images if provided
    if (images) {
      if (!Array.isArray(images)) {
        throw customError(400, "Images should be an array");
      }
      for (const image of images) {
        if (!image.mimetype.startsWith("image")) {
          throw customError(400, "All images should be image files");
        }
      }
    }
  }
  next(); // Proceed to the next middleware
});

// Middleware to validate car data for update
export const validateCarUpdate = [
  body("brand")
    .optional()
    .notEmpty()
    .withMessage("Brand cannot be empty")
    .isString()
    .withMessage("Brand must be a string"),

  body("model")
    .optional()
    .notEmpty()
    .withMessage("Model cannot be empty")
    .isString()
    .withMessage("Model must be a string"),

  body("transmission")
    .optional()
    .notEmpty()
    .withMessage("Transmission cannot be empty")
    .isString()
    .withMessage("Transmission must be a string")
    .custom((value) => {
      const validValues = ["manual", "automatic"];
      return validValues.includes(value.toLowerCase().trim());
    })
    .withMessage("Transmission type can only be Manual or Automatic"),

  body("passengers")
    .optional()
    .isInt({ min: 4 })
    .withMessage("Passengers should be a number and cannot be less than 4"),

  body("color")
    .optional()
    .notEmpty()
    .withMessage("Color cannot be empty")
    .isString()
    .withMessage("Color must be a string"),

  body("pricePerDay")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price should be a non-negative number"),

  body("topSpeed")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Top speed should be a positive number"),

  body("maxPower")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max power should be a positive number"),

  handleValidationErrors,

  validateUpdateImages,
];
