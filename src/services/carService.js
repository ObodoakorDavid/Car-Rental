import Car from "../models/car.js";
import customError from "../utils/customError.js";
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
  const car = await Car.findById(carId);
  if (!car) {
    throw customError(404, `No Car with ID: ${carId}`);
  }
  return car;
}

// Delete Car
async function deleteCar(carId) {
  const car = await Car.findByIdAndDelete(carId, { new: true });
  if (!car) {
    throw customError(404, `No Car with ID: ${carId}`);
  }
  return car;
}

// Update Car
async function updateCar(carId, carDetails) {
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
  const { coverImage, images } = allImages;
  if (coverImage) {
    carDetails.coverImage = await uploadService.uploadImageToCloudinary(
      coverImage.tempFilePath
    );
  }
  carDetails.images = [];
  for (const image of images) {
    carDetails.images.push({
      url: await uploadService.uploadImageToCloudinary(image.tempFilePath),
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
