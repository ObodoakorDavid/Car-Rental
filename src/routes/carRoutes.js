import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";

import {
  createCar,
  deleteCar,
  getCar,
  getCars,
  updateCar,
} from "../controllers/carController.js";

const router = express.Router();

router.route("/").get(getCars).post(createCar).all(methodNotAllowed);
router
  .route("/:carId")
  .get(getCar)
  .patch(updateCar)
  .delete(deleteCar)
  .all(methodNotAllowed);

export default router;
