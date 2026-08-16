import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  let token = null;

  // 1. Перевіряємо Authorization Header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Якщо немає — дивимось у cookies
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(createHttpError(401, "Missing access token"));
  }

  try {
    // 3. Валідуємо токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Шукаємо користувача
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
