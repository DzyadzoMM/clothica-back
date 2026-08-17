import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { generateTokens, setAuthCookies } from "../services/auth.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendAuthResponse = (req, res, user, tokens, status) => {
  const isMobileClient = req.headers["x-client-type"] === "mobile";
  if (isMobileClient) {
    return res.status(status).json({ user: user.toJSON(), tokens });
  } else {
    setAuthCookies(res, tokens);
    return res.status(status).json(user);
  }
};
export const registerUser = async (req, res, next) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return next(createHttpError(400, "Email already in use"));
    }
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return next(createHttpError(400, "Phone already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    const tokens = generateTokens(newUser._id);
    return sendAuthResponse(req, res, newUser, tokens, 201);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ phone });

    if (!user) return next(createHttpError(401, "Invalid credentials"));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return next(createHttpError(401, "Invalid credentials"));

    const tokens = generateTokens(user._id);
    return sendAuthResponse(req, res, user, tokens, 200);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(204).send();
};


export const refreshUserSession = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return next(createHttpError(400, "Missing refresh token"));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== "refresh") {
      return next(createHttpError(401, "Invalid token type"));
    }

    const user = await User.findById(decoded.userId);
    if (!user) return next(createHttpError(404, "User not found"));

    const tokens = generateTokens(user._id);
    return sendAuthResponse(req, res, user, tokens, 200);
  } catch {
    return next(createHttpError(401, "Invalid or expired refresh token"));
  }
};

export const googleAuthCallback = async (req, res) => {
  const tokens = generateTokens(req.user._id);
  setAuthCookies(res, tokens);
  res.redirect("/");
};

export const googleMobileAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.name,
      });
    }

    const tokens = generateTokens(user._id);
    res.json({ user: user.toJSON(), tokens });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};
