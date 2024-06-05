import UserProfile from "../models/userProfile.js";
import User from "../models/user.js";
import { validatePassword } from "../utils/validationUtils.js";
import customError from "../utils/customError.js";
import generateToken from "../config/generateToken.js";
import mongoose from "mongoose";

// Fields to exclude
const excludedFields = ["-password", "-__v", "-createdAt", "-updatedAt"];

// Register User
async function register(userData) {
  // Starts Session
  const session = await mongoose.startSession();
  session.startTransaction();

  const fields = ["firstName", "lastName", "email", "phoneNumber", "password"];
  const missingField = fields.find((field) => !userData[field]);
  if (missingField) {
    session.endSession();
    throw customError(400, `${missingField} is required!`);
  }

  try {
    const user = await User.create([userData], { session });
    const userProfile = await UserProfile.create(
      [
        {
          userId: user[0]._id,
          ...userData,
        },
      ],
      { session }
    );

    // Commit changes to DB
    await session.commitTransaction();
    session.endSession();

    return { user: user[0], userProfile: userProfile[0] };
  } catch (error) {
    // Reverses anything that has been done
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

// SignIn User
async function signIn(email, password) {
  const user = await findUserByEmail(email);
  await validatePassword(password, user.password);
  const userProfile = await findUserProfileById(user._id);
  if (!userProfile.isVerified) {
    throw customError(401, "Email not verified!");
  }

  //generate new token
  const token = generateToken(user._id);

  const userInfo = {
    id: user._id,
    username: userProfile.userId.firstName,
    lastName: userProfile.userId.lastName,
    roles: userProfile.roles,
    image: userProfile.image,
    phoneNumber: userProfile.phoneNumber,
    token,
  };

  return userInfo;
}

// Find User By Email
async function findUserByEmail(email) {
  if (!email) {
    throw customError(400, "Please provide an email");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw customError(401, "No User with this Email");
  }

  return user;
}

// Find User Profile By Id
async function findUserProfileById(userId) {
  const userProfile = await UserProfile.findOne({ userId }).populate({
    path: "userId",
    select: excludedFields,
  });

  if (!userProfile) {
    throw customError(404, "User profile not found");
  }
  return userProfile;
}

// update user
async function updateUser(userId, newDetails) {
  const userProfile = await UserProfile.findOneAndUpdate(
    { userId },
    { ...newDetails },
    {
      new: true,
    }
  );

  if (!userProfile) {
    throw customError(404, "User profile not found");
  }
  return userProfile;
}

// Get All Users
async function getAllUsers() {
  const users = await UserProfile.find({ roles: { $nin: ["admin"] } }).populate(
    {
      path: "userId",
      select: "firstName lastName",
    }
  );

  return { users };
}

export default {
  register,
  findUserByEmail,
  findUserProfileById,
  signIn,
  updateUser,
  getAllUsers,
};
