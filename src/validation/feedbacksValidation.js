import { Joi, Segments } from 'celebrate';

export const createFeedbackSchema = {
    [Segments.BODY]: Joi.object({
        author: Joi.string().trim().min(2).max(50).required(),
        
        description: Joi.string().trim().min(10).required(),
        
        rate: Joi.number().min(1).max(5).precision(1).required(), 
        
    }),
    [Segments.PARAMS]: Joi.object({
      productId:Joi.string().required(),
    }),
};

export const getFeedbacksByProductSchema = {
  [Segments.PARAMS]: Joi.object({
      productId:Joi.string().required(),
    }),
};