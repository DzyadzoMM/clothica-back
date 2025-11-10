import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import goodsRoutes from './routes/goodsRoutes.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subscriptionsRoutes from './routes/subscriptionsRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
const PORT = process.env.PORT || 3030;
const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// app.get('/test-error', () => {
//   throw new Error('Simulated server error');
// });

app.use(authRoutes);
app.use(goodsRoutes);
app.use(subscriptionsRoutes);
app.use(feedbacksRoutes);
app.use(userRoutes);
app.use(categoriesRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`server is running on port  ${PORT}`);
});
