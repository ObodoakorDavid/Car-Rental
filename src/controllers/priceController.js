import asyncWrapper from "../middlewares/asyncWrapper.js";
import priceService from "../services/priceService.js";

const getPrice = asyncWrapper(async (req, res, next) => {
  const result = await priceService.getCurrentPrice(req.query.name);
  res.status(200).json({ price: result });
});
export { getPrice };
