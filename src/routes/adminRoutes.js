import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  addDriver,
  bookCar,
  createCar,
  deleteCar,
  getAllDrivers,
  getBookings,
  getCar,
  getCars,
  getDriver,
  updateBooking,
  updateCar,
  updatePrice,
} from "../controllers/adminController.js";

const router = express.Router();

// Cars
router.route("/car").get(getCars).post(createCar).all(methodNotAllowed);
router
  .route("/car/:carId")
  .get(getCar)
  .patch(updateCar)
  .delete(deleteCar)
  .all(methodNotAllowed);

// Prices
router.route("/price").post(updatePrice).all(methodNotAllowed);

//Bookings
router.route("/booking").get(getBookings).post(bookCar).all(methodNotAllowed);
router.route("/booking/:bookingId").get(updateBooking).all(methodNotAllowed);

//Drivers
router
  .route("/driver")
  .get(getAllDrivers)
  .post(addDriver)
  .all(methodNotAllowed);
router.route("/driver/:driverId").get(getDriver).all(methodNotAllowed);

export default router;
