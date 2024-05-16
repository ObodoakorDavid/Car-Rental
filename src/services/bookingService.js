import Booking from "../models/booking.js";
import customError from "../utils/customError.js";
import carService from "./carService.js";
import priceService from "./priceService.js";
import userService from "./userService.js";

async function bookCar(bookingDetails, userId) {
  const requiredFields = [
    "pickUpDate",
    "pickUpTime",
    "duration",
    "address",
    "withinLagos",
    "escortNeeded",
    "driverNeeded",
    "paymentStatus",
    "status",
    "carId",
    "totalPrice",
  ];

  const missingField = requiredFields.find(
    (field) => !(field in bookingDetails)
  );

  if (missingField) {
    throw customError(400, `${missingField} is required!`);
  }

  const { carId, duration, driverNeeded, escortNeeded, totalPrice } =
    bookingDetails;

  const car = await carService.getSingleCar(carId);

  if (!car.isAvailable) {
    throw customError(400, "This card is not available");
  }

  // calculate price
  let newPrice = car.pricePerDay * parseInt(duration);

  if (escortNeeded) {
    const escortPrice = await priceService.getCurrentPrice("escort");
    newPrice = newPrice + escortPrice;
  }

  if (driverNeeded) {
    const driverPrice = await priceService.getCurrentPrice("driver");
    newPrice = newPrice + driverPrice;
  }

  if (parseInt(newPrice) !== parseInt(totalPrice)) {
    throw customError(400, "Price incorrect");
  }

  const userProfile = await userService.findUserProfileById(userId);
  const booking = await Booking.create({
    user: userProfile._id,
    car: car._id,
    ...bookingDetails,
  });

  await userService.updateUser(userId, { booking: booking._id });

  // Update car is Available to false

  return { message: "Booking Successfull", booking };
}

async function getUserBookings(userId) {
  const userProfile = await userService.findUserProfileById(userId);
  const bookings = await Booking.find({ user: userProfile._id });
  return { bookings };
}

async function updateBooking(userId) {
  const userProfile = await userService.findUserProfileById(userId);
  const bookings = await Booking.find({ user: userProfile._id });
  return { bookings };
}

export default {
  bookCar,
  getUserBookings,
  updateBooking,
};
