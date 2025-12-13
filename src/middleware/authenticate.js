
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  let accessToken = null;

  if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.split(' ')[1];
    
    if (headerToken) {
      accessToken = headerToken;
    }
  }

  if (!accessToken) {
    console.error('[AUTH MIDDLEWARE] Токен не знайдено ні в Cookies, ні в Authorization Header.');
    return next(createHttpError(401, 'Missing access token'));
  }
  
  const session = await Session.findOne({
    accessToken: accessToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;
  next();
};
