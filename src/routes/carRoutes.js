import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";

import { getCar, getCars } from "../controllers/carController.js";

const router = express.Router();

router.route("/").get(getCars).all(methodNotAllowed);
router.route("/:carId").get(getCar).all(methodNotAllowed);

export default router;
