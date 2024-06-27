import CarBooking from "../models/carBooking.js";
import DriverBooking from "../models/driverBooking.js";
import customError from "../utils/customError.js";
import { validateMongoId } from "../utils/validationUtils.js";
import carService from "./carService.js";
import driverService from "./driverService.js";
import priceService from "./priceService.js";
import userService from "./userService.js";

// Book Car
async function bookCar(bookingDetails, userId) {
  const { carId } = bookingDetails;

  const car = await carService.getSingleCar(carId);

  if (car.quantity < 1) {
    throw customError(400, "This car is not available");
  }

  const userProfile = await userService.findUserProfileById(userId);
  const carBooking = await CarBooking.create({
    user: userProfile._id,
    car: car._id,
    ...bookingDetails,
  });

  await userService.updateUser(userId, { $push: { booking: carBooking._id } });
  await carService.updateCar(carId, {
    $inc: { quantity: -bookingDetails.quantity },
  });

  return { message: "Booking Successfull", booking: carBooking };
}

// Get All Car Bookings
async function getAllCarBookings(query = {}) {
  const { status, page, perPage } = query;

  const searchQuery = {};

  if (status) {
    searchQuery.status = status;
  }

  const pagination = {
    totalPages: 0,
    totalCount: 0,
  };

  if (page) {
    const skip = page ? (page - 1) * perPage : 0;
    const carBookings = await CarBooking.find(searchQuery)
      .populate({ path: "user" })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalCount = await CarBooking.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / perPage);
    pagination.totalCount = totalCount;
    pagination.totalPages = !totalPages ? 0 : totalPages;
    const stats = await getCarBookingsStatistics();
    // console.log(stats);
    return {
      bookings: carBookings,
      pagination,
      ...stats,
    };
  }

  const populateOptions = [
    {
      path: "user",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName",
      },
    },
    {
      path: "car",
      select: "-createdAt -updatedAt -__v",
    },
  ];

  const carBookings = await CarBooking.find(searchQuery)
    .populate(populateOptions)
    .sort({
      createdAt: -1,
    });
  return { bookings: carBookings };
}

// Booking Statistics
async function getCarBookingsStatistics() {
  const dailyStatistics = Array(7).fill(0);
  const weeklyStatistics = Array(52).fill(0);
  const monthlyStatistics = Array(12).fill(0);

  const monthlyPipeline = [
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by month
        count: { $sum: 1 }, // Count bookings in each month
      },
    },
    {
      $sort: { _id: 1 }, // Sort by month
    },
  ];

  // Aggregation pipeline for daily statistics (group by day of the week)
  const dailyPipeline = [
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week (1=Sunday, 7=Saturday)
        count: { $sum: 1 }, // Count bookings in each day of the week
      },
    },
    {
      $sort: { _id: 1 }, // Sort by day of the week
    },
  ];

  // Aggregation pipeline for weekly statistics (group by week of the year)
  const weeklyPipeline = [
    {
      $group: {
        _id: { $week: "$createdAt" }, // Group by week of the year
        count: { $sum: 1 }, // Count bookings in each week
      },
    },
    {
      $sort: { _id: 1 }, // Sort by week
    },
  ];

  // Execute the aggregation pipelines
  const [monthlyCounts, dailyCounts, weeklyCounts] = await Promise.all([
    CarBooking.aggregate(monthlyPipeline),
    CarBooking.aggregate(dailyPipeline),
    CarBooking.aggregate(weeklyPipeline),
  ]);

  console.log([monthlyCounts, weeklyCounts, dailyCounts]);

  // Populate monthly statistics
  monthlyCounts.forEach((month) => {
    const monthIndex = month._id - 1; // Month index is 0-based
    monthlyStatistics[monthIndex] = month.count;
  });

  // Populate daily statistics
  dailyCounts.forEach((day) => {
    const dayIndex = day._id - 1; // Day index is 0-based (1=Sunday -> 0, 2=Monday -> 1, ..., 7=Saturday -> 6)
    dailyStatistics[dayIndex] = day.count;
  });

  // Populate weekly statistics
  weeklyCounts.forEach((week) => {
    const weekIndex = week._id - 1; // Week index is 0-based (week 1 -> index 0, week 2 -> index 1, ...)
    weeklyStatistics[weekIndex] = week.count;
  });

  return {
    daily: dailyStatistics,
    weekly: weeklyStatistics,
    monthly: monthlyStatistics,
  };
}

// Get User Bookings
async function getUserBookings(userId) {
  const userProfile = await userService.findUserProfileById(userId);
  const bookings = await CarBooking.find({ user: userProfile._id })
    .sort({
      createdAt: -1,
    })
    .populate("car");
  return { bookings };
}

// Get Single Car Booking
async function getSingleCarBooking(bookingId) {
  console.log({ bookingId });
  validateMongoId(bookingId);
  const carBooking = await CarBooking.findById(bookingId).populate({
    path: "car",
  });
  if (!carBooking) {
    throw customError(404, "No Car Booking Found");
  }
  return { booking: carBooking };
}

// Update User Car Bookings
const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
};
async function updateCarBooking(bookingId, updatedDetails = {}) {
  const { status, driverId } = updatedDetails;
  validateMongoId(bookingId);

  const { booking: carBooking } = await getSingleCarBooking(bookingId);

  // Request for driverId to approve
  if (status.toLowerCase() === STATUS.APPROVED) {
    if (carBooking.driverNeeded && !driverId) {
      throw customError(400, "Driver is needed, please provide a driver ID");
    }
  }

  const updateFields = { status };

  if (status.toLowerCase() === STATUS.ONGOING) {
    updateFields.datePicked = new Date();
  }
  if (status.toLowerCase() === STATUS.COMPLETED) {
    updateFields.dateReturned = new Date();
  }

  if (status.toLowerCase() === STATUS.APPROVED) {
    if (carBooking.driverNeeded && driverId) {
      validateMongoId(driverId);
      await driverService.checkDriverAvailability(driverId);
      updateFields.driver = driverId;
    }
  }

  const updatedCarBooking = await CarBooking.findByIdAndUpdate(
    bookingId,
    updateFields,
    { new: true, runValidators: true }
  );

  // Update car and driver availability if booking is completed
  if (
    status.toLowerCase() === STATUS.COMPLETED ||
    status.toLowerCase() === STATUS.REJECTED
  ) {
    await carService.updateCar(updatedCarBooking.car, {
      $inc: { quantity: carBooking.quantity },
    });

    if (updatedCarBooking.driverNeeded && updateCarBooking?.driver) {
      await driverService.updateDriver(updatedCarBooking.driver, {
        isAvailable: true,
      });
    }
  }

  return { message: "Booking Updated", booking: updatedCarBooking };
}

async function updateUserCarBooking(bookingId, updatedDetails = {}) {
  const { paymentStatus } = updatedDetails;
  const { booking: carBookingExists } = await getSingleCarBooking(bookingId);

  if (carBookingExists.paymentStatus === "failed") {
    throw customError(400, "Booking can't be updated");
  }
  const carBooking = await CarBooking.findByIdAndUpdate(
    bookingId,
    { paymentStatus },
    { new: true, runValidators: true }
  );
  return { message: "Booking Updated", booking: carBooking };
}

// ----------------------------------------------------------------------

// Book Driver
async function bookDriver(bookingDetails, userId) {
  const { driverId, duration, totalPrice } = bookingDetails;
  const { driver } = await driverService.getDriver(driverId);
  await driverService.checkDriverAvailability(driverId);
  const driverPrice = await priceService.getCurrentPrice("driver");

  const originalPrice = parseInt(driverPrice) * duration;

  if (parseInt(originalPrice) !== parseInt(totalPrice)) {
    throw customError(400, "Price incorrect");
  }

  const userProfile = await userService.findUserProfileById(userId);
  const driverBooking = await DriverBooking.create({
    user: userProfile._id,
    driver: driver._id,
    ...bookingDetails,
  });

  await driverService.updateDriver(driver._id, {
    $push: { bookings: driverBooking._id },
    isAvailable: false,
  });

  return { message: "Driver Booked", booking: driverBooking };
}

// Get Driver Bookings
async function getDriverBookings() {
  const driverBookings = await DriverBooking.find({}).sort({ createdAt: -1 });
  return { bookings: driverBookings };
}

// Get Single Driver Bookings
async function getSingleDriverBooking(bookingId) {
  validateMongoId(bookingId);
  const driverBooking = await DriverBooking.findById(bookingId);
  if (!driverBooking) {
    throw customError(404, "No Driver Booking Found");
  }
  return { booking: driverBooking };
}

// Update Driver Bookings
async function updateDriverBookings(bookingId, updatedDetails = {}) {
  const { status } = updatedDetails;

  const driverBooking = await DriverBooking.findByIdAndUpdate(
    bookingId,
    {
      status,
    },
    { new: true }
  );

  if (!driverBooking) {
    throw customError(404, "No Driver Booking Found");
  }

  if (status === STATUS.COMPLETED || status === STATUS.REJECTED) {
    await driverService.updateDriver(driverBooking.driver, {
      isAvailable: true,
    });
  }

  return { message: "Booking Updated", booking: driverBooking };
}

export default {
  bookCar,
  getUserBookings,
  updateCarBooking,
  bookDriver,
  getDriverBookings,
  getSingleCarBooking,
  getSingleDriverBooking,
  getAllCarBookings,
  updateDriverBookings,
  updateUserCarBooking,
};
