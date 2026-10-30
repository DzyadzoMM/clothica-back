import jwt from "jsonwebtoken";

const ONE_DAY = 24 * 60 * 60;         // 1 день для access token (86400 секунд)
const ONE_MONTH = 30 * 24 * 60 * 60;  // 1 місяць (30 днів) для refresh token (2592000 секунд)    

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: ONE_DAY } 
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: ONE_MONTH } 
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
    maxAge: ONE_DAY * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_MONTH * 1000,
  });
};
