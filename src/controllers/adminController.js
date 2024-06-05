import asyncWrapper from "../middlewares/asyncWrapper.js";
import bookingService from "../services/bookingService.js";
import carService from "../services/carService.js";
import driverService from "../services/driverService.js";
import priceService from "../services/priceService.js";
import userService from "../services/userService.js";

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
  const car = await carService.updateCar(carId, req.body);
  res.status(200).json({ message: "Car Updated", car });
});

const deleteCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.deleteCar(carId);
  res.status(200).json({ message: "Car Deleted", car });
});

// Prices
const getPrice = asyncWrapper(async (req, res, next) => {
  const result = await priceService.getCurrentPrice(req.query.name);
  res.status(200).json({ price: result });
});

const updatePrice = asyncWrapper(async (req, res, next) => {
  const result = await priceService.updatePrice(req.body);
  res.status(200).json(result);
});

// Bookings -- Cars
const getCarBookings = asyncWrapper(async (req, res, next) => {
  const result = await bookingService.getAllCarBookings(req.query);
  res.status(200).json(result);
});

const getSingleCarBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.getSingleCarBooking(bookingId);
  res.status(200).json(result);
});

const updateCarBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.updateCarBooking(bookingId, req.body);
  res.status(200).json(result);
});

// Bookings -- Drivers
const getDriverBookings = asyncWrapper(async (req, res, next) => {
  const result = await bookingService.getDriverBookings(req.query);
  res.status(200).json(result);
});

const getSingleDriverBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.getSingleDriverBooking(bookingId);
  res.status(200).json(result);
});

const updateDriverBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.updateDriverBookings(bookingId, req.body);
  res.status(200).json(result);
});

// Drivers
const addDriver = asyncWrapper(async (req, res, next) => {
  const result = await driverService.addNewDriver(req.body, req.files);
  res.status(200).json(result);
});

const getAllDrivers = asyncWrapper(async (req, res, next) => {
  const result = await driverService.getAllDrivers(req.query);
  res.status(200).json(result);
});

const getDriver = asyncWrapper(async (req, res, next) => {
  const { driverId } = req.params;
  const result = await driverService.getDriver(driverId);
  res.status(200).json(result);
});

const updateDriver = asyncWrapper(async (req, res, next) => {
  const { driverId } = req.params;
  const result = await driverService.updateDriver(
    driverId,
    req.body,
    req.files
  );
  res.status(200).json(result);
});

const deleteDriver = asyncWrapper(async (req, res, next) => {
  const { driverId } = req.params;
  const result = await driverService.deleteDriver(driverId);
  res.status(200).json(result);
});

// Users
const getAllUsers = asyncWrapper(async (req, res, next) => {
  const result = await userService.getAllUsers();
  res.status(200).json(result);
});

export {
  createCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
  updatePrice,
  getCarBookings,
  updateCarBooking,
  addDriver,
  getDriver,
  getAllDrivers,
  getPrice,
  updateDriver,
  deleteDriver,
  getSingleCarBooking,
  updateDriverBooking,
  getDriverBookings,
  getSingleDriverBooking,
  getAllUsers,
};
