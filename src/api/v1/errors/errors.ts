import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Base application error class that all custom errors extend from
 * Provides consistent error structure with HTTP status codes
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  /**
   * Creates a new AppError instance
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code for the error
   * @param errorCode - Machine-readable error code
   * @param isOperational - Whether error is operational (expected) or programming error
   */
  constructor(message: string, statusCode: number, errorCode: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when repository/database operations fail
 * Used for data access layer errors
 */
export class RepositoryError extends AppError {
  constructor(message: string, errorCode = "REPOSITORY_ERROR") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode);
  }
}

/**
 * Error thrown when business logic validation fails
 * Used for service layer errors
 */
export class ServiceError extends AppError {
  constructor(message: string, errorCode = "SERVICE_ERROR") {
    super(message, HTTP_STATUS.BAD_REQUEST, errorCode);
  }
}

/**
 * Error thrown when authentication fails
 * Used when user identity cannot be verified
 */
export class AuthenticationError extends AppError {
  constructor(message: string, errorCode = "AUTHENTICATION_ERROR") {
    super(message, HTTP_STATUS.UNAUTHORIZED, errorCode);
  }
}

/**
 * Error thrown when authorization fails
 * Used when authenticated user lacks required permissions
 */
export class AuthorizationError extends AppError {
  constructor(message: string, errorCode = "AUTHORIZATION_ERROR") {
    super(message, HTTP_STATUS.FORBIDDEN, errorCode);
  }
}
