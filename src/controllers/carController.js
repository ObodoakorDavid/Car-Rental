import asyncWrapper from "../middlewares/asyncWrapper.js";
import carService from "../services/carService.js";

const getCars = asyncWrapper(async (req, res, next) => {
  const cars = await carService.getAllCars();
  res.status(200).json(cars);
});

const getCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.getSingleCar(carId);
  res.status(200).json({ car });
});

export { getCars, getCar };
