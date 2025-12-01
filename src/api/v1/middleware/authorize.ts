import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { AuthorizationError } from "../errors/errors";

/**
 * Middleware factory for role-based authorization
 * Checks if authenticated user has one of the required roles
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }

      // Check if user has required role
      const userRole = req.user.role || 'user';
      
      if (!allowedRoles.includes(userRole)) {
        throw new AuthorizationError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${userRole}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Authorization failed',
        errorCode: 'AUTHORIZATION_ERROR'
      });
    }
  };
};
