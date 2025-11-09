import { Subscription } from '../models/subscription.js';
import createHttpError from 'http-errors';

export const createSubscription = async (req, res) => {
        const { email } = req.body;

        const existingSubscription = await Subscription.findOne({ email });

        if (existingSubscription) {
          throw createHttpError(401, "Цей email вже підписаний.");}

        const newSubscription = await Subscription.create({
            email,
        });
        return res.status(201).json(newSubscription);

};
