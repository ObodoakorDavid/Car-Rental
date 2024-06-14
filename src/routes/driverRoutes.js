import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import { getAllDrivers, getDriver } from "../controllers/driverController.js";
import { validateParamId } from "../validators/IdValidator.js";

const router = express.Router();

router.route("/").get(getAllDrivers).all(methodNotAllowed);
router
  .route("/:driverId")
  .get(validateParamId("driverId"), getDriver)
  .all(methodNotAllowed);
export default router;
