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
import ordersRoutes from './routes/ordersRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { adminJs, router as adminRouter } from './admin.js';
import passport from "passport";
import "./config/passport.js"; // файл де ми описали GoogleStrategy


const PORT = process.env.PORT || 3030;
const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

const allowedOrigins = [
  'http://localhost:3000',
  'https://clothica-front.vercel.app',
];

app.set('trust proxy', 1);

app.use(logger);
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
// ✅ твій keep-alive маршрут
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(adminJs.options.rootPath, adminRouter);

// app.get('/test-error', () => {
//   throw new Error('Simulated server error');
// });
app.post('/api/payments/create-liqpay', (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY;

    if (!PUBLIC_KEY || !PRIVATE_KEY) {
      return res.status(500).json({ error: 'Відсутні ключі LiqPay у середовищі бекенду' });
    }

    const params = {
      action: 'pay',
      amount: amount, 
      currency: 'UAH', // У пісочниці використовуємо гривні
      description: `Оплата замовлення #${orderId || 'test'}`,
      order_id: orderId || `order_${Date.now()}`,
      version: '3',
      sandbox: 1, // <--- Вмикає тестовий режим
      result_url: 'https://clothica-back-2.onrender.com/api/payments/success',
    };

    // Форматування даних у Base64
    const dataString = JSON.stringify(params);
    const data = Buffer.from(dataString).toString('base64');

    // Генерація підпису (SHA1)
    const sha1String = PRIVATE_KEY + data + PRIVATE_KEY;
    const signature = crypto
      .createHash('sha1')
      .update(sha1String)
      .digest('base64');

    res.json({ data, signature });
  } catch (error) {
    console.error('LiqPay generation error:', error.message);
    res.status(500).json({ error: 'Не вдалося сформувати платіж LiqPay' });
  }
});
app.use(authRoutes);
app.use(goodsRoutes);
app.use(subscriptionsRoutes);
app.use(feedbacksRoutes);
app.use(userRoutes);
app.use(categoriesRoutes);
app.use(ordersRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`server is running on port  ${PORT}`);
});
