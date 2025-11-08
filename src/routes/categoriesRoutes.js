import express from "express";
import { celebrate } from "celebrate";
import {  getCategoryById, getAllCategories } from "../controllers/categoriesController.js";
import {categoryIdSchema, getAllCategoriesSchema} from '../validation/categoriesValidation.js';

const router = express.Router();

router.get("/api/categories", celebrate(getAllCategoriesSchema),  getAllCategories);
router.get("/api/categories/:categoryId",celebrate(categoryIdSchema), getCategoryById); 

export default router;
