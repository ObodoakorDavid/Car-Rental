import Price from "../models/price.js";
import customError from "../utils/customError.js";

// Update Price
async function updatePrice(priceDetails = {}) {
  const { name, value } = priceDetails;
  if (!name || !value) {
    throw customError(400, "Please provide name and value");
  }
  const price = await Price.create({ name, value });
  return { message: "Price Updated", price };
}

async function getCurrentPrice(name) {
  if (!name) {
    throw customError(400, "Please provide name");
  }
  const price = await Price.findOne({ name })
    .sort({ createdAt: -1 }) // Sort by date in descending order to get the most recent price
    .exec();

  if (!price) {
    throw customError(400, `No Price available for ${name}`);
  }

  return price.value;
}

export default {
  updatePrice,
  getCurrentPrice,
};
