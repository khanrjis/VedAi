import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const notFoundMiddleware = (_request: Request, _response: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404));
};

export const errorMiddleware = (error: unknown, _request: Request, response: Response, _next: NextFunction): void => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed',
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
};