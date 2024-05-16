import asyncWrapper from "../middlewares/asyncWrapper.js";
import bookingService from "../services/bookingService.js";

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

export { bookCar, getBookings };
