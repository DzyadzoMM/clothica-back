// import createHttpError from 'http-errors';
import { Good } from '../models/good.js';

export const getAllGoods = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 12,
      categoryId,
      sizes,
      minPrice,
      maxPrice,
      gender,
    } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const skip = (pageNum - 1) * perPageNum;

    const filter = {};

    if (categoryId) {
      filter.category = categoryId;
    }

    // size — массив! → используем $in
    if (sizes) {
      const sizeList = sizes.split(',');
      filter.size = { $in: sizeList };
    }

    if (minPrice || maxPrice) {
      filter['price.value'] = {};
      if (minPrice) filter['price.value'].$gte = Number(minPrice);
      if (maxPrice) filter['price.value'].$lte = Number(maxPrice);
    }

    // gender совпадает с базой
    if (gender && gender !== 'all') {
      filter.gender = gender; // man/woman/unisex
    }

    const [totalItems, goods] = await Promise.all([
      Good.countDocuments(filter),
      Good.find(filter).skip(skip).limit(perPageNum),
    ]);

    const totalPages = Math.ceil(totalItems / perPageNum);

    res.json({
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      goods,
    });
  } catch (err) {
    next(err);
  }
};
