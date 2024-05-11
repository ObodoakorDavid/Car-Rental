import asyncWrapper from "../middlewares/asyncWrapper.js";
import userService from "../services/userService.js";
import emailUtils from "../utils/emailUtils.js";
import { validateOTP } from "../utils/validationUtils.js";

// SignUp User
const signUpUser = asyncWrapper(async (req, res, next) => {
  const { user } = await userService.register(req.body);
  const emailInfo = await emailUtils.sendOTPByEmail(user.email, user.firstName);
  res.status(201).json({
    message: `OTP has been sent to ${emailInfo.envelope.to}`,
  });
});

//Login User
const signInUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userService.signIn(email, password);
  res.status(200).json({ user });
});

// GET USER
const getUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const userProfile = await userService.findUserProfileById(userId);
  res.status(200).json({
    user: {
      id: userId,
      username: userProfile.userId.firstName,
      lastName: userProfile.userId.lastName,
      roles: userProfile.roles,
      image: userProfile.image,
      phoneNumber: userProfile.phoneNumber,
    },
  });
});

// SendOTP
const sendOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const user = await userService.findUserByEmail(email);
  const userProfile = await userService.findUserProfileById(user._id);
  if (userProfile.isVerified) {
    return res.status(200).json({ message: "User Already Verified" });
  }
  const emailInfo = await emailUtils.sendOTPByEmail(email, user.firstName);
  res.status(201).json({
    message: `OTP has been sent to ${emailInfo.envelope.to}`,
  });
});

// VerifyOTP
const verifyOTP = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await userService.findUserByEmail(email);
  const userProfile = await userService.findUserProfileById(user._id);
  if (userProfile.isVerified) {
    return res.status(200).json({ message: "User Already Verified" });
  }
  await validateOTP(email, otp);
  userProfile.isVerified = true;
  await userProfile.save();
  res.status(200).json({ message: "Profile Verified" });
});

// ForgotPassword
const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const user = await userService.findUserByEmail(email);
  const emailInfo = await emailUtils.sendOTPByEmail(email, user.userName);
  res.status(201).json({
    message: `OTP has been sent to ${emailInfo.envelope.to}`,
  });
});

// ResetPassword
const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await userService.findUserByEmail(email);
  await validateOTP(email, otp);
  user.password = password;
  await user.save();
  res.status(200).json({ message: "Password Updated!" });
});

export {
  signUpUser,
  signInUser,
  getUser,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
