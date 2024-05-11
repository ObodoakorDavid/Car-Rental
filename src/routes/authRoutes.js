import express from "express";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import {
  forgotPassword,
  getUser,
  resetPassword,
  sendOTP,
  signInUser,
  signUpUser,
  verifyOTP,
} from "../controllers/auth.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(isAuth, getUser)
  //   .patch(auth, updateUser)
  //   .delete(auth, deleteUser)
  .all(methodNotAllowed);
router.route("/signup").post(signUpUser).all(methodNotAllowed);
router.route("/signin").post(signInUser).all(methodNotAllowed);
router.route("/send-otp").post(sendOTP).all(methodNotAllowed);
router.route("/verify-otp").post(verifyOTP).all(methodNotAllowed);
router.route("/forgot-password").post(forgotPassword).all(methodNotAllowed);
router.route("/reset-password").post(resetPassword).all(methodNotAllowed);

export default router;
