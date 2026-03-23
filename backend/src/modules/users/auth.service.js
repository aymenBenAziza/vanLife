import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { env } from '../../config/env.js';
import { RefreshToken } from './refresh-token.model.js';
import { User } from './user.model.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const buildUserPayload = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  status: user.status,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signAccessToken = (user) =>
  jwt.sign({ role: user.role, email: user.email }, env.jwtAccessSecret, {
    subject: user.id,
    expiresIn: env.accessTokenTtl,
  });

const signRefreshToken = (user) =>
  jwt.sign({ type: 'refresh' }, env.jwtRefreshSecret, {
    subject: user.id,
    expiresIn: `${env.refreshTokenTtlDays}d`,
  });

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new AppError('Email is already in use', StatusCodes.CONFLICT);
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    email: payload.email.toLowerCase(),
    passwordHash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: 'customer',
  });

  const tokens = await issueTokens(user);

  return {
    user: buildUserPayload(user),
    ...tokens,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  if (user.status !== 'active') {
    throw new AppError('Your account is not active', StatusCodes.FORBIDDEN);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokens(user);

  return {
    user: buildUserPayload(user),
    ...tokens,
  };
};

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', StatusCodes.UNAUTHORIZED);
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', StatusCodes.UNAUTHORIZED);
  }

  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    userId: payload.sub,
  });

  if (!storedToken) {
    throw new AppError('Refresh token not recognized', StatusCodes.UNAUTHORIZED);
  }

  const user = await User.findById(payload.sub);

  if (!user || user.status !== 'active') {
    throw new AppError('Invalid or inactive user', StatusCodes.UNAUTHORIZED);
  }

  await RefreshToken.deleteOne({ _id: storedToken.id });
  const tokens = await issueTokens(user);

  return {
    user: buildUserPayload(user),
    ...tokens,
  };
};

export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return buildUserPayload(user);
};

export const updateUserProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return buildUserPayload(user);
};
