import asyncWrapper from "../middlewares/asyncWrapper.js";
import driverService from "../services/driverService.js";

// Drivers
const addDriver = asyncWrapper(async (req, res, next) => {
  const result = await driverService.addNewDriver(req.body, req.files);
  res.status(200).json(result);
});

const getAllDrivers = asyncWrapper(async (req, res, next) => {
  const result = await driverService.getAllDrivers(req.query);
  res.status(200).json(result);
});

const getDriver = asyncWrapper(async (req, res, next) => {
  const { driverId } = req.params;
  const result = await driverService.getDriver(driverId);
  res.status(200).json(result);
});

export { addDriver, getDriver, getAllDrivers };
