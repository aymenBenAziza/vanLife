import { env } from '../../config/env.js';
import {
  getUserProfile,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  updateUserProfile,
} from './auth.service.js';

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.cookieSecure,
  maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
};

export const signup = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await refreshUserToken(token);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    await logoutUser(token);
    res.clearCookie('refreshToken', refreshCookieOptions);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
