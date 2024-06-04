import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import { getPrice } from "../controllers/priceController.js";

const router = express.Router();

router.route("/").get(getPrice).all(methodNotAllowed);

export default router;
