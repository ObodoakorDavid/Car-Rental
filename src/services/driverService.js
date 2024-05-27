import Driver from "../models/driver.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import uploadService from "./uploadService.js";

// Add New Driver
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
  console.log(images);

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

//GET All Drivers
async function getAllDrivers(query = {}) {
  console.log(query);
  const { search, page, perPage = 10, yearsOfExperience } = query;

  const searchQuery = {};
  if (search) {
    searchQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  const pagination = {
    totalPages: 0,
    totalCount: 0,
  };

  if (yearsOfExperience) {
    const [minExperience, maxExperience] = yearsOfExperience
      .split("-")
      .map(Number);

    searchQuery.yearsOfExperience = {
      $gte: minExperience,
      $lte: maxExperience,
    };
  }

  if (page) {
    const skip = page ? (page - 1) * perPage : 0;
    const drivers = await Driver.find(searchQuery)
      .skip(skip)
      .limit(perPage)
      .populate("bookings");

    const totalCount = await Driver.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / perPage);
    pagination.totalCount = totalCount;
    pagination.totalPages = totalPages;
    return { drivers, pagination };
  }

  const drivers = await Driver.find(searchQuery).populate("bookings");
  return { drivers };
}

// Get Driver
async function getDriver(driverId) {
  validateMongoId(driverId);
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw customError(404, "Driver Not Found");
  }
  return { driver };
}

async function updateDriver(driverId, updatedDetails) {
  validateMongoId(driverId);
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    {
      ...updatedDetails,
    },
    { new: true, runValidators: true }
  );
  if (!driver) {
    throw customError(404, "Driver Not Found");
  }

  return { driver };
}

// Get Driver
async function deleteDriver(driverId) {
  validateMongoId(driverId);
  const driver = await Driver.findByIdAndDelete(driverId);
  if (!driver) {
    throw customError(404, "Driver Not Found");
  }
  return { message: "Driver Deleted", driver };
}

// Check Driver Availability
async function checkDriverAvailability(driverId) {
  const { driver } = await getDriver(driverId);
  if (!driver.isAvailable) {
    throw customError(400, "This driver is not available");
  }
}

export default {
  addNewDriver,
  getAllDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
  checkDriverAvailability,
};
