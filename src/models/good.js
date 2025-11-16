import { model, Schema } from 'mongoose';
import { SIZES } from '../constants/sizes.js';

const priceSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      enum: ['грн'],
    },
  },
  {
    _id: false,
  },
);

const goodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: priceSchema,
      required: true,
    },

    size: {
      type: [String],
      enum: SIZES,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
        default: [],
      },
    ],

    prevDescription: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ['man', 'woman', 'unisex'],
    },

    characteristics: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Good = model('Good', goodSchema);
