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
router.route("/price").get(getPrice).post(updatePrice).all(methodNotAllowed);

//Bookings
router.route("/booking/car").get(getCarBookings).all(methodNotAllowed);
router
  .route("/booking/car/:bookingId")
  .get(getSingleCarBooking)
  .patch(updateCarBooking)
  .all(methodNotAllowed);

router.route("/booking/driver").get(getDriverBookings).all(methodNotAllowed);
router
  .route("/booking/driver/:bookingId")
  .get(getSingleDriverBooking)
  .patch(updateDriverBooking)
  .all(methodNotAllowed);

//Drivers
router
  .route("/driver")
  .get(getAllDrivers)
  .post(addDriver)
  .all(methodNotAllowed);

router
  .route("/driver/:driverId")
  .get(getDriver)
  .delete(deleteDriver)
  .patch(updateDriver)
  .all(methodNotAllowed);

export default router;
