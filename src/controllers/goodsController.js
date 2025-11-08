import createHttpError from "http-errors";
import { Good } from "../models/good.js";

export const getAllGoods = async (req, res) => {
  const { page = 1, perPage = 12, category, size, maxValue, gender } = req.query;

  const skip = (page - 1) * perPage;

  const goodsQuery = Good.find();

  if (category) {
    goodsQuery.where("category").equals(category);
  }
  if (size) {
    goodsQuery.where("size").equals(size);
  }
  if (maxValue) {
    goodsQuery.where("price.value").lte(Number(maxValue));
  }
  if (gender) {
    goodsQuery.where("gender").equals(gender);
  }

  const [totalItems, goods] = await Promise.all([
    goodsQuery.clone().countDocuments(),
    goodsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    goods,
  });
};

export const getGoodById = async (req, res, next) => {
  const { goodId } = req.params;
  const good = await Good.findById(goodId);

  if (!good) {
    next(createHttpError(404, "Товар не знайдено."));
    return;
  }

  res.status(200).json(good);
};
