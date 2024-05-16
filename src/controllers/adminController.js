import asyncWrapper from "../middlewares/asyncWrapper.js";
import carService from "../services/carService.js";
import priceService from "../services/priceService.js";

const createCar = asyncWrapper(async (req, res, next) => {
  const car = await carService.addNewCar(req.body, req.files);
  res.status(200).json({ message: "Car Added", car });
});

const getCars = asyncWrapper(async (req, res, next) => {
  const cars = await carService.getAllCars(req.query);
  res.status(200).json(cars);
});

const getCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.getSingleCar(carId);
  res.status(200).json({ car });
});

const updateCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.updateCar(carId);
  res.status(200).json({ message: "Car Updated", car });
});

const deleteCar = asyncWrapper(async (req, res, next) => {
  const { carId } = req.params;
  const car = await carService.deleteCar(carId);
  res.status(200).json({ message: "Car Deleted", car });
});

const updatePrice = asyncWrapper(async (req, res, next) => {
  const result = await priceService.updatePrice(req.body);
  res.status(200).json(result);
});

export { createCar, getCars, getCar, updateCar, deleteCar, updatePrice };
