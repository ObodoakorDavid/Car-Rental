import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  bookCar,
  bookDriver,
  getCarBookings,
  getDriverBookings,
  getSingleCarBooking,
  getSingleDriverBooking,
} from "../controllers/bookingController.js";
import { validateCarBooking } from "../validators/carBookingValidator.js";
import { validateDriverBooking } from "../validators/driverBookingValidator.js";

const router = express.Router();

router
  .route("/car")
  .get(getCarBookings)
  .post(validateCarBooking, bookCar)
  .all(methodNotAllowed);

router.route("/car/:bookingId").get(getSingleCarBooking).all(methodNotAllowed);

router
  .route("/driver")
  .get(getDriverBookings)
  .post(validateDriverBooking, bookDriver)
  .all(methodNotAllowed);

router
  .route("/driver/:bookingId")
  .get(getSingleDriverBooking)
  .all(methodNotAllowed);

export default router;
