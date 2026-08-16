import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { generateTokens, setAuthCookies } from "../services/auth.js";

// Helper
const sendAuthResponse = (req, res, user, tokens, status) => {
  const isMobileClient = req.headers["x-client-type"] === "mobile";
  if (isMobileClient) {
    return res.status(status).json({ ...user.toObject(), ...tokens });
  } else {
    setAuthCookies(res, tokens);
    return res.status(status).json(user);
  }
};

// Register
export const registerUser = async (req, res, next) => {
  const { phone, password, firstName } = req.body;
  const existingUser = await User.findOne({ phone });
  if (existingUser) return next(createHttpError(400, "phone in use"));

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ firstName, phone, password: hashedPassword });

  const tokens = generateTokens(newUser._id);
  return sendAuthResponse(req, res, newUser, tokens, 201);
};

// Login
export const loginUser = async (req, res, next) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return next(createHttpError(401, "Invalid credentials"));

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return next(createHttpError(401, "Invalid credentials"));

  const tokens = generateTokens(user._id);
  return sendAuthResponse(req, res, user, tokens, 200);
};

// Logout
export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(204).send();
};

// Refresh
export const refreshUserSession = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return next(createHttpError(400, "Missing refresh token"));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(createHttpError(404, "User not found"));

    const tokens = generateTokens(user._id);
    return sendAuthResponse(req, res, user, tokens, 200);
  } catch {
    return next(createHttpError(401, "Invalid refresh token"));
  }
};

// Google callback
export const googleAuthCallback = async (req, res) => {
  const tokens = generateTokens(req.user._id);
  return sendAuthResponse(req, res, req.user, tokens, 200);
};
