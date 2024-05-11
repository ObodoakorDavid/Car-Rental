import Car from "../models/car.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import uploadService from "./uploadService.js";

// Get All Cars
async function getAllCars() {
  const cars = await Car.find({});
  return cars;
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
  if (!allImages) {
    throw customError(400, "Please provide coverImage and images");
  }

  const { coverImage, images } = allImages;

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
  }

  const requiredFields = [
    "brand",
    "model",
    "transmisson",
    "passengers",
    "color",
    "topSpeed",
    "maxPower",
    "coverImage",
    "images",
  ];

  const missingField = requiredFields.find((field) => !(field in carDetails));
  if (missingField) {
    throw customError(400, `${missingField} is required!`);
  }

  console.log(carDetails);

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
