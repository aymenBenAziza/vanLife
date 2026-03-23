import { StatusCodes } from 'http-status-codes';

export const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  if (err.name === 'ZodError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation failed',
      errors: err.flatten ? err.flatten() : err.issues,
    });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};
