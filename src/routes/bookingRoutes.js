import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  bookCar,
  bookDriver,
  getCarBookings,
  getDriverBookings,
  getSingleCarBooking,
  getSingleDriverBooking,
  updateCarBooking,
} from "../controllers/bookingController.js";
import { validateCarBooking } from "../validators/carBookingValidator.js";
import { validateDriverBooking } from "../validators/driverBookingValidator.js";
import { validateParamId } from "../validators/IdValidator.js";

const router = express.Router();

router
  .route("/car")
  .get(getCarBookings)
  .post(validateCarBooking, bookCar)
  .all(methodNotAllowed);

router
  .route("/car/:bookingId")
  .get(validateParamId("bookingId"), getSingleCarBooking)
  .patch(validateParamId("bookingId"), updateCarBooking)
  .all(methodNotAllowed);

router
  .route("/driver")
  .get(getDriverBookings)
  .post(validateDriverBooking, bookDriver)
  .all(methodNotAllowed);

router
  .route("/driver/:bookingId")
  .get(validateParamId("bookingId"), getSingleDriverBooking)
  .all(methodNotAllowed);

export default router;
