import createHttpError from 'http-errors';
import { Good } from '../models/good.js';

export const getAllGoods = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 12,
      categoryId,
      size,
      minPrice,
      maxPrice,
      gender,
    } = req.query;

    console.log('Query parameters:', req.query);

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const skip = (pageNum - 1) * perPageNum;

    const filter = {};

    if (categoryId) {
      filter.category = categoryId;
    }

    // if (size) {
    //   let sizesArray = [];

    //   if (Array.isArray(size)) {
    //     sizesArray = size;
    //   } else {
    //     sizesArray = [size];
    //   }
    //   const normalizedSizes = sizesArray.map((s) => s.toUpperCase());
    //   filter.size = { $in: normalizedSizes };
    // }

    if (size) {
      let sizesArray = [];
      if (Array.isArray(size)) {
        sizesArray = size;
      } else if (typeof size === 'string') {
        sizesArray = [size];
      }
      filter.size = { $in: sizesArray.map((s) => s.toUpperCase()) };
    }

    // if (size) {
    //   const arr = Array.isArray(size) ? size : size.split(',');
    //   console.log('RAW sizes:', size);
    //   console.log('Parsed sizes array:', arr);

    //   const normalizedSizes = arr.map((s) => s.toUpperCase().trim());
    //   filter.size = { $in: normalizedSizes };
    // }

    if (minPrice || maxPrice) {
      filter['price.value'] = {};
      if (minPrice) filter['price.value'].$gte = Number(minPrice);
      if (maxPrice) filter['price.value'].$lte = Number(maxPrice);
    }

    if (gender && gender !== 'all') {
      filter.gender = gender;
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

export const getGoodById = async (req, res, next) => {
  const { goodId } = req.params;
  const good = await Good.findById(goodId);

  if (!good) {
    next(createHttpError(404, 'Товар не знайдено.'));
    return;
  }

  res.status(200).json(good);
};
