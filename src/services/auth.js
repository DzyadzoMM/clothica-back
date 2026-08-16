import jwt from "jsonwebtoken";

const FIFTEEN_MINUTES = 15 * 60; // у секундах
const ONE_DAY = 24 * 60 * 60;    // у секундах

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: FIFTEEN_MINUTES } // 15 хв
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: ONE_DAY } // 1 день
  );

  return { accessToken, refreshToken };
};

export const setAuthCookies = (res, tokens) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  res.cookie("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY * 1000,
  });
};
