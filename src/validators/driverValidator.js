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

// Middleware to validate avatar image if provided
export const validateAvatar = asyncWrapper((req, res, next) => {
  if (!req.files) {
    throw customError(400, "Please Provide an avatar");
  }

  const { avatar } = req.files;

  if (!avatar) {
    throw customError(400, "Please Provide an avatar");
  }

  if (!avatar.mimetype.startsWith("image")) {
    throw customError(400, "Avatar must be an image file");
  }

  next(); // Proceed to the next middleware
});

export const validateDriver = [
  body("name")
    .exists()
    .withMessage("Please provide a name")
    .notEmpty()
    .withMessage("name can't be empty")
    .isString()
    .withMessage("name must be a string"),

  body("age")
    .exists()
    .withMessage("Please provide an age")
    .notEmpty()
    .withMessage("age can't be empty")
    .isString()
    .withMessage("age must be a string"),

  body("location")
    .exists()
    .withMessage("Please provide a location")
    .notEmpty()
    .withMessage("location can't be empty")
    .isString()
    .withMessage("location must be a string"),

  body("healthStatus")
    .exists()
    .withMessage("Please provide an health status")
    .notEmpty()
    .withMessage("healthStatus can't be empty")
    .isString()
    .withMessage("healthStatus must be a string"),

  body("backCheck")
    .exists()
    .withMessage("Please provide a back check")
    .notEmpty()
    .withMessage("backCheck can't be empty")
    .isString()
    .withMessage("backCheck must be a string"),

  body("training")
    .exists()
    .withMessage("Please provide training information")
    .notEmpty()
    .withMessage("training can't be empty")
    .isString()
    .withMessage("training must be a string"),

  body("phoneNumber")
    .exists()
    .withMessage("Please provide a phone number")
    .notEmpty()
    .withMessage("phoneNumber can't be empty")
    .matches(/^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/)
    .withMessage("Please provide a valid Nigerian phone number"),

  body("yearsOfExperience")
    .exists()
    .withMessage("Please provide years of experience")
    .isInt({ min: 0 })
    .withMessage("Years of experience should be a non-negative integer"),

  body("dateOfBirth")
    .exists()
    .withMessage("Please provide a date of birth")
    .isISO8601()
    .withMessage("Date of birth must be a valid date in the format YYYY-MM-DD"),

  body("licenseIssueDate")
    .exists()
    .withMessage("Please provide a licenseIssueDate")
    .isISO8601()
    .withMessage(
      "licenseIssueDate must be a valid date in the format YYYY-MM-DD"
    ),

  body("licenseExpiryDate")
    .exists()
    .withMessage("Please provide a licenseExpiryDate")
    .isISO8601()
    .withMessage(
      "licenseExpiryDate must be a valid date in the format YYYY-MM-DD"
    ),

  body("licenseClass")
    .exists()
    .withMessage("Please provide a licenseClass")
    .notEmpty()
    .withMessage("licenseClass can't be empty")
    .isString()
    .withMessage("licenseClass must be a string"),

  body("accidentHistory")
    .exists()
    .withMessage("Please provide an accidentHistory")
    .notEmpty()
    .withMessage("accidentHistory can't be empty")
    .isString()
    .withMessage("accidentHistory must be a string"),

  body("moreInfo")
    .exists()
    .withMessage("Please provide more information")
    .notEmpty()
    .withMessage("licenseClass can't be empty")
    .isString()
    .withMessage("moreInfo must be a string"),

  handleValidationErrors,

  validateAvatar,
];

// Middleware to validate avatar image if provided
export const validateUpdateAvatar = asyncWrapper((req, res, next) => {
  if (req.files && req.files.avatar) {
    const { avatar } = req.files;

    if (!avatar.mimetype.startsWith("image")) {
      throw customError(400, "Avatar must be an image file");
    }
  }
  next(); // Proceed to the next middleware
});

export const validateUpdateDriver = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("name can't be empty")
    .isString()
    .withMessage("name must be a string"),

  body("age")
    .optional()
    .notEmpty()
    .withMessage("age can't be empty")
    .isString()
    .withMessage("age must be a string"),

  body("location")
    .optional()
    .notEmpty()
    .withMessage("location can't be empty")
    .isString()
    .withMessage("location must be a string"),

  body("healthStatus")
    .optional()
    .notEmpty()
    .withMessage("healthStatus can't be empty")
    .isString()
    .withMessage("healthStatus must be a string"),

  body("backCheck")
    .optional()
    .notEmpty()
    .withMessage("backCheck can't be empty")
    .isString()
    .withMessage("backCheck must be a string"),

  body("training")
    .optional()
    .notEmpty()
    .withMessage("training can't be empty")
    .isString()
    .withMessage("training must be a string"),

  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("phoneNumber can't be empty")
    .matches(/^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/)
    .withMessage("Please provide a valid Nigerian phone number"),

  body("yearsOfExperience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Years of experience should be a non-negative integer"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date in the format YYYY-MM-DD"),

  body("licenseIssueDate")
    .optional()
    .isISO8601()
    .withMessage(
      "licenseIssueDate must be a valid date in the format YYYY-MM-DD"
    ),

  body("licenseExpiryDate")
    .optional()
    .isISO8601()
    .withMessage(
      "licenseExpiryDate must be a valid date in the format YYYY-MM-DD"
    ),

  body("licenseClass")
    .optional()
    .notEmpty()
    .withMessage("licenseClass can't be empty")
    .isString()
    .withMessage("licenseClass must be a string"),

  body("accidentHistory")
    .optional()
    .notEmpty()
    .withMessage("accidentHistory can't be empty")
    .isString()
    .withMessage("accidentHistory must be a string"),

  body("moreInfo")
    .optional()
    .notEmpty()
    .withMessage("licenseClass can't be empty")
    .isString()
    .withMessage("moreInfo must be a string"),

  handleValidationErrors,

  validateUpdateAvatar,
];
