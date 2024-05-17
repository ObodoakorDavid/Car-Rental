import Booking from "../models/booking.js";
import driver from "../models/driver.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import carService from "./carService.js";
import driverService from "./driverService.js";
import priceService from "./priceService.js";
import userService from "./userService.js";

// Book Car
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
    throw customError(400, "This car is not available");
  }

  // Calculate price
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
  await carService.updateCar(carId, { isAvailable: false });

  return { message: "Booking Successfull", booking };
}

// Get User Bookings
async function getUserBookings(userId) {
  const userProfile = await userService.findUserProfileById(userId);
  const bookings = await Booking.find({ user: userProfile._id });
  return { bookings };
}

// Update User Bookings
async function updateBooking(bookingId, updatedDetails = {}) {
  const { status, driverId } = updatedDetails;

  // Validate bookingId
  validateMongoId(bookingId);

  // Validate driverId if provided
  if (driverId) {
    validateMongoId(driverId);
  }

  // Fetch the booking to be updated
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw customError(404, `No booking found with ID: ${bookingId}`);
  }

  // Check if driver is needed and if driverId is provided
  if (booking.driverNeeded && !driverId) {
    throw customError(400, "Driver is needed, please provide a driver ID");
  }

  // Validate status
  if (!status) {
    throw customError(400, "Please provide a valid status");
  }

  // Prepare the update object
  const updateFields = { status };
  if (status === "ongoing") {
    updateFields.datePicked = new Date();
  }
  if (status === "completed") {
    updateFields.dateReturned = new Date();
  }

  if (driverId) {
    updateFields.driver = driverId;
  }

  // Update the booking
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedBooking) {
    throw customError(404, `No booking found with ID: ${bookingId}`);
  }

  // Update car availability if booking is completed
  if (status === "completed") {
    await carService.updateCar(updatedBooking.car, { isAvailable: true });
  }

  return { message: "Booking Updated", booking: updatedBooking };
}

export default {
  bookCar,
  getUserBookings,
  updateBooking,
};
