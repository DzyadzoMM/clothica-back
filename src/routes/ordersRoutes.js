import { Router } from "express";
import { celebrate } from "celebrate";
import { createOrder, getAllOrders } from "../controllers/ordersController.js";
import { createOrderSchema } from "../validation/ordersValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();


router.get("/api/orders", getAllOrders);
router.post("/api/orders", celebrate(createOrderSchema), createOrder);

// приватний ендпоінт для зміни статусу покупок у ролі admin

export default router;
