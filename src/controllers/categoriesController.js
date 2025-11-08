import Category from "../models/сategories.js";
import createHttpError from "http-errors";

export const getCategoryById = async (req, res, next) => {

    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return (createHttpError(404, "Категорію не знайдено."));
    }

    res.status(200).json(category);
};

  
export const getAllCategories = async (req, res, next) => {
    const { page = 1, perPage = 12 } = req.query;
    const skip = (page - 1) * perPage;

    const [totalCategories, categories] = await Promise.all([
      Category.countDocuments(),
      Category.find().skip(skip).limit(perPage).select("_id name").sort("name"),
    ]);

    const totalPages = Math.ceil(totalCategories / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalCategories,
      totalPages,
      categories,
    });
};