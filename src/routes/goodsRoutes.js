import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllGoodsSchema,
  goodIdSchema,
} from '../validation/goodsValidation.js';
import { getAllGoods, getGoodById, getNewestGoods } from '../controllers/goodsController.js';

const router = Router();

router.get('/api/goods', celebrate(getAllGoodsSchema), getAllGoods);
router.get('/api/goods/newest', getNewestGoods);
router.get('/api/goods/:goodId', celebrate(goodIdSchema), getGoodById);

export default router;
