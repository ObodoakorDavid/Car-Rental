import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import { bookCar, getBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.route("/").get(getBookings).post(bookCar).all(methodNotAllowed);

export default router;
