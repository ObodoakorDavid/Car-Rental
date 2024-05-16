import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  createCar,
  deleteCar,
  getCar,
  getCars,
  updateCar,
  updatePrice,
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/car").get(getCars).post(createCar).all(methodNotAllowed);
router
  .route("/car/:carId")
  .get(getCar)
  .patch(updateCar)
  .delete(deleteCar)
  .all(methodNotAllowed);

router.route("/price").post(updatePrice).all(methodNotAllowed);

export default router;
