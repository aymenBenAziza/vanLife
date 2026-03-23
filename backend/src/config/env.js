import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];

const allowedSameSite = new Set(['lax', 'strict', 'none']);

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const cookieSameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();

if (!allowedSameSite.has(cookieSameSite)) {
  throw new Error('COOKIE_SAME_SITE must be one of: lax, strict, none');
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  cookieSecure:
    process.env.COOKIE_SECURE === 'true' || (process.env.NODE_ENV === 'production' && cookieSameSite === 'none'),
  cookieSameSite,
};
