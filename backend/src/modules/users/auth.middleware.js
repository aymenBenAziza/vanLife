import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { env } from '../../config/env.js';
import { User } from './user.model.js';

export const validateRequest = (schema) => (req, res, next) => {
  schema.parse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next();
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub);

    if (!user || user.status !== 'active') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Insufficient permissions' });
  }

  next();
};
