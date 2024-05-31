import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  addDriver,
  getAllDrivers,
  getDriver,
} from "../controllers/driverController.js";
import { validateParamId } from "../validators/IdValidator.js";

const router = express.Router();

router.route("/").get(getAllDrivers).post(addDriver).all(methodNotAllowed);
router
  .route("/:driverId")
  .get(validateParamId, getDriver)
  .all(methodNotAllowed);
export default router;
