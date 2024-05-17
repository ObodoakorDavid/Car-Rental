import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  addDriver,
  getAllDrivers,
  getDriver,
} from "../controllers/driverController.js";

const router = express.Router();

router.route("/").get(getAllDrivers).post(addDriver).all(methodNotAllowed);
router.route("/:driverId").get(getDriver).all(methodNotAllowed);
export default router;
