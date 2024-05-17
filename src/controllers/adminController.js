import asyncWrapper from "../middlewares/asyncWrapper.js";
import bookingService from "../services/bookingService.js";
import carService from "../services/carService.js";
import driverService from "../services/driverService.js";
import priceService from "../services/priceService.js";

// Cars
const createCar = asyncWrapper(async (req, res, next) => {
  const car = await carService.addNewCar(req.body, req.files);
  res.status(200).json({ message: "Car Added", car });
});

const getCars = asyncWrapper(async (req, res, next) => {
  const cars = await carService.getAllCars(req.query);
  res.status(200).json(cars);
});

const getCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.getSingleCar(carId);
  res.status(200).json({ car });
});

const updateCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.updateCar(carId);
  res.status(200).json({ message: "Car Updated", car });
});

const deleteCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.deleteCar(carId);
  res.status(200).json({ message: "Car Deleted", car });
});

// Prices
const updatePrice = asyncWrapper(async (req, res, next) => {
  const result = await priceService.updatePrice(req.body);
  res.status(200).json(result);
});

// Bookings
const bookCar = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.bookCar(req.body, userId);
  res.status(200).json(result);
});

const getBookings = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.getUserBookings(userId);
  res.status(200).json(result);
});

const updateBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.updateBooking(bookingId, req.body);
  res.status(200).json(result);
});

// Drivers
const addDriver = asyncWrapper(async (req, res, next) => {
  const result = await driverService.addNewDriver(req.body, req.files);
  res.status(200).json(result);
});

const getAllDrivers = asyncWrapper(async (req, res, next) => {
  const result = await driverService.getAllDrivers();
  res.status(200).json(result);
});

const getDriver = asyncWrapper(async (req, res, next) => {
  const { driverId } = req.params;
  const result = await driverService.getDriver(driverId);
  res.status(200).json(result);
});

export {
  createCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
  updatePrice,
  bookCar,
  getBookings,
  updateBooking,
  addDriver,
  getDriver,
  getAllDrivers,
};
