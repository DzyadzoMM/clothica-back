import { model, Schema } from "mongoose";
import { STATUS } from "../constants/status.js";
import { SIZES } from "../constants/sizes.js";

const generateRandomString = (length = 7) => {
    return Math.random().toString().substring(2, 2 + length);
};

const cartSchema = new Schema(
    {
        goodId: {
            type: Schema.Types.ObjectId,
            ref: "Good",
            required: true,
        },
        size: {
            type: String, // Краще String, якщо SIZES - це масив рядків
            enum: SIZES, // Використовуйте enum для обмеження значень
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 1,
        },
        pricePerItem: {
            type: Number,
            required: true,
            min: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema(
    {
        cart: [{
            type: cartSchema,
            required: true,
            default: [],
        }],
        total: {
            type: Number,
            required: true, // Це загальна сума, розрахована контролером
        },
        orderDate: {
            type: String,
        },
        orderNumber: {
            type: String,
            unique: true,
        },
        status: {
            type: String, // Краще String, якщо STATUS - це масив рядків
            enum: STATUS, // Використовуйте enum для обмеження значень
            required: true,
            default: "У процесі",
        },
        userData: {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            firstName: {
                type: String,
                required: true,
                trim: true,
            },
            lastName: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },
            postOfficeNum: {
                type: String,
                required: true,
                trim: true,
            },
            comment: {
                type: String,
                trim: true,
            }
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

orderSchema.pre("save", function (next) {

    if (this.isNew) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const dateString = [day, month, year].join(".");
        this.orderDate = dateString;

        const uniqueId = `№${generateRandomString(7)}`;
        this.orderNumber = uniqueId;
    }

    next();
});

export const Order = model("Order", orderSchema);
