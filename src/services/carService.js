import Car from "../models/car.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import uploadService from "./uploadService.js";

// Get All Cars
async function getAllCars(query) {
  if (!query) {
    const cars = await Car.find({});
    return { cars };
  }

  let totalCountQuery = await Car.find({}).countDocuments();

  const pagination = {
    totalPages: 0,
    totalCount: totalCountQuery,
  };

  const { page, pageSize } = query;
  const limit = pageSize ? parseInt(pageSize) : 0;
  const requestedPage = page ? parseInt(page) : 1;
  const skip = limit * (requestedPage - 1);

  pagination.totalPages = Math.ceil(totalCountQuery / limit);

  const cars = await Car.find().skip(skip).limit(limit);

  return { cars, pagination };
}

// Get Single Car
async function getSingleCar(carId) {
  validateMongoId(carId);
  const car = await Car.findById(carId);
  if (!car) {
    throw customError(404, `No Car with ID: ${carId}`);
  }
  return car;
}

// Delete Car
async function deleteCar(carId) {
  validateMongoId(carId);
  const car = await Car.findByIdAndDelete(carId, { new: true });
  if (!car) {
    throw customError(404, `No Car with ID: ${carId}`);
  }
  return car;
}

// Update Car
async function updateCar(carId, carDetails) {
  validateMongoId(carId);
  const car = await Car.findByIdAndUpdate(
    carId,
    { ...carDetails },
    { new: true, runValidators: true }
  );
  if (!car) {
    throw customError(404, `No Car with ID: ${carId}`);
  }
  return car;
}

// Adds New Car
async function addNewCar(carDetails, allImages) {
  const requiredFields = [
    "brand",
    "model",
    "transmisson",
    "passengers",
    "color",
    "topSpeed",
    "maxPower",
    "pricePerDay",
  ];

  const missingField = requiredFields.find((field) => !(field in carDetails));
  if (missingField) {
    throw customError(400, `${missingField} is required!`);
  }

  if (!allImages) {
    throw customError(400, "Please provide coverImage and images");
  }

  const { coverImage, images } = allImages;

  if (!coverImage) {
    throw customError(400, "Please provide coverImage");
  }

  if (!images) {
    throw customError(400, "Please provide images");
  }

  if (coverImage) {
    carDetails.coverImage = await uploadService.uploadImageToCloudinary(
      coverImage.tempFilePath
    );
  }

  carDetails.images = [];
  if (Array.isArray(images)) {
    for (const image of images) {
      carDetails.images.push({
        url: await uploadService.uploadImageToCloudinary(image.tempFilePath),
      });
    }
  } else {
    carDetails.images.push({
      url: await uploadService.uploadImageToCloudinary(images.tempFilePath),
    });
  }

  const newCar = await Car.create({ ...carDetails });
  return newCar;
}

export default {
  getAllCars,
  getSingleCar,
  deleteCar,
  updateCar,
  addNewCar,
};
