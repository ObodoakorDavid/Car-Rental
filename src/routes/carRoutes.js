import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";

import { getCar, getCars } from "../controllers/carController.js";
import { validateParamId } from "../validators/IdValidator.js";

const router = express.Router();

router.route("/").get(getCars).all(methodNotAllowed);
router.route("/:carId").get(validateParamId, getCar).all(methodNotAllowed);

export default router;
