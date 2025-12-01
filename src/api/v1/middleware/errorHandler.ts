import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { getErrorMessage, isOperationalError } from "../errors/errorUtils";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 * @param error - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  // Handle custom AppError instances
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
    return;
  }

  // Handle operational errors
  if (isOperationalError(error)) {
    const appError = error as AppError;
    res.status(appError.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: appError.message,
      errorCode: appError.errorCode || 'OPERATIONAL_ERROR'
    });
    return;
  }

  // Handle unknown errors
  const message = getErrorMessage(error);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred',
    errorCode: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { details: message })
  });
};
