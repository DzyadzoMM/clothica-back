import { Joi, Segments } from 'celebrate';

export const createSubscriptionSchema = {
    [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(), 
    }),
};
