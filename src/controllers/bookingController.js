import asyncWrapper from "../middlewares/asyncWrapper.js";
import bookingService from "../services/bookingService.js";

const bookCar = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.bookCar(req.body, userId);
  res.status(200).json(result);
});

const getCarBookings = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.getUserBookings(userId);
  res.status(200).json(result);
});

const getSingleCarBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  console.log(bookingId);
  const result = await bookingService.getSingleCarBooking(bookingId);
  res.status(200).json(result);
});

const bookDriver = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.bookDriver(req.body, userId);
  res.status(200).json(result);
});

const getDriverBookings = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await bookingService.getDriverBookings(userId);
  res.status(200).json(result);
});

const getSingleDriverBooking = asyncWrapper(async (req, res, next) => {
  const { bookingId } = req.params;
  const result = await bookingService.getSingleDriverBooking(bookingId);
  res.status(200).json(result);
});

export {
  bookCar,
  getCarBookings,
  bookDriver,
  getDriverBookings,
  getSingleDriverBooking,
  getSingleCarBooking,
};
