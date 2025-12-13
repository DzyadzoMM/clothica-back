// src/controllers/authController.js

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';


const sendAuthResponse = (req, res, user, newSession, status) => {
  
  const isMobileClient = req.headers['x-client-type'] === 'mobile';

  if (isMobileClient) {
    return res.status(status).json({
      ...user.toObject(), 
      accessToken: newSession.accessToken,
      refreshToken: newSession.refreshToken,
    });
  } else {
    setSessionCookies(res, newSession);
    return res.status(status).json(user);
  }
};


export const registerUser = async (req, res, next) => {
  const { phone, password, firstName } = req.body;

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return next(createHttpError(400, 'phone in use'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    phone,
    password: hashedPassword,
  });
  
  const newSession = await createSession(newUser._id);

  return sendAuthResponse(req, res, newUser, newSession, 201);
};


export const loginUser = async (req, res, next) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);

  return sendAuthResponse(req, res, user, newSession, 200);
};


export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};


export const refreshUserSession = async (req, res, next) => {
    
    const session = await Session.findOne({
        _id: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    if (!session) {
        return next(createHttpError(401, 'Session not found'));
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        return next(createHttpError(401, 'Session token expired'));
    }

    await Session.deleteOne({
        _id: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    const newSession = await createSession(session.userId);

    const user = await User.findById(session.userId);
    if (!user) {
        return next(createHttpError(404, 'User not found during session refresh'));
    }
    
    return sendAuthResponse(req, res, user, newSession, 200);
};
