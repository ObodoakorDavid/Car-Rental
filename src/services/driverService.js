import Driver from "../models/driver.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import uploadService from "./uploadService.js";

async function addNewDriver(driverDetails, images) {
  const requiredFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "yearsOfExperience",
  ];

  const missingField = requiredFields.find(
    (field) => !(field in driverDetails)
  );

  if (missingField) {
    throw customError(400, `${missingField} is required!`);
  }

  if (!images) {
    throw customError(400, "Please provide an avatar");
  }

  const { avatar } = images;

  if (!avatar) {
    throw customError(400, "Please provide an avatar");
  }

  const driver = await Driver.create({ ...driverDetails });
  const url = await uploadService.uploadImageToCloudinary(avatar.tempFilePath);
  driver.avatar = url;
  await driver.save();

  return { message: "Driver Added", driver };
}

async function getAllDrivers() {
  const drivers = await Driver.find({});
  return { drivers };
}

async function getDriver(driverId) {
  validateMongoId(driverId);
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw customError(404, "Driver Not Found");
  }
  return driver;
}

export default {
  addNewDriver,
  getAllDrivers,
  getDriver,
};
