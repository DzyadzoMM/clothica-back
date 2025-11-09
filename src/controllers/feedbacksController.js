import { Feedback } from '../models/feedback.js';
import { Good } from '../models/good.js';
import Category from "../models/сategories.js";
import createHttpError from "http-errors";

export const createFeedback = async (req, res, next) => {
    try {
        const { author, rate, description } = req.body;
        const { productId } = req.params;

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const calculatedDate = `${year}-${month}-${day}`;
        
        const good = await Good.findById(productId)
            .populate('category', 'name') 
            .select('category'); 
            
        if (!good) {
             return (createHttpError(404,`Товар (Good) з ID ${productId} не знайдено.`));
        }
        if (!good.category || !good.category.name) {
            return (createHttpError(404, 'Назву категорії не вдалося знайти для цього товару (Good). Перевірте зв\'язок Category.'));
        }
        
        const categoryName = good.category.name; 

        const newFeedback = await Feedback.create({
            author,
            rate,
            description,
            productId,
            date: calculatedDate, 
            category: categoryName,
        });

        res.status(201).json(newFeedback);
        
    } catch (err) {
        next(err); 
    }
};

export const getFeedbacks = async (req, res) => {
    const feedback = await Feedback.find({})
        .populate('productId', 'name')
        .sort({ date: -1 }); 

    res.status(200).json({
        count: feedback.length,
        feedback,
    });
};
