import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  addDriver,
  createCar,
  deleteCar,
  deleteDriver,
  getAllDrivers,
  getCar,
  getCarBookings,
  getCars,
  getDriver,
  getDriverBookings,
  getPrice,
  getSingleCarBooking,
  getSingleDriverBooking,
  updateCar,
  updateCarBooking,
  updateDriver,
  updateDriverBooking,
  updatePrice,
} from "../controllers/adminController.js";
import { validateParamId } from "../validators/IdValidator.js";
import { validateCar, validateCarUpdate } from "../validators/carValidator.js";
import {
  validateDriver,
  validateUpdateDriver,
} from "../validators/driverValidator.js";
import { validateUpdateCarBooking } from "../validators/carBookingValidator.js";

const router = express.Router();

// Cars
router
  .route("/car")
  .get(getCars)
  .post(validateCar, createCar)
  .all(methodNotAllowed);
router
  .route("/car/:carId")
  .get(validateParamId("carId"), getCar)
  .patch(validateParamId("carId"), validateCarUpdate, updateCar)
  .delete(validateParamId("carId"), deleteCar)
  .all(methodNotAllowed);

//Drivers
router
  .route("/driver")
  .get(getAllDrivers)
  .post(validateDriver, addDriver)
  .all(methodNotAllowed);

router
  .route("/driver/:driverId")
  .get(validateParamId("driverId"), getDriver)
  .delete(validateParamId("driverId"), deleteDriver)
  .patch(validateParamId("driverId"), validateUpdateDriver, updateDriver)
  .all(methodNotAllowed);

// Prices
router.route("/price").get(getPrice).post(updatePrice).all(methodNotAllowed);

//Bookings
router.route("/booking/car").get(getCarBookings).all(methodNotAllowed);
router
  .route("/booking/car/:bookingId")
  .get(validateParamId("bookingId"), getSingleCarBooking)
  .patch(
    validateParamId("bookingId"),
    validateUpdateCarBooking,
    updateCarBooking
  )
  .all(methodNotAllowed);

router.route("/booking/driver").get(getDriverBookings).all(methodNotAllowed);
router
  .route("/booking/driver/:bookingId")
  .get(validateParamId("bookingId"), getSingleDriverBooking)
  .patch(validateParamId("bookingId"), updateDriverBooking)
  .all(methodNotAllowed);

export default router;
