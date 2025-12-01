import { Request, Response, NextFunction } from "express";
import { getAuth } from "../../../../config/firebase";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage } from "../errors/errorUtils";

/**
 * Extended Express Request with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

/**
 * Middleware to authenticate Firebase ID tokens
 * Verifies the token from the Authorization header and attaches user info to request
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws AuthenticationError if token is missing or invalid
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided. Please include a Bearer token in the Authorization header');
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new AuthenticationError('Invalid token format');
    }

    // Verify the token with Firebase Auth
    const decodedToken = await getAuth().verifyIdToken(token);

    // Attach user information to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user' // Default role is 'user'
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errorCode: error.errorCode
      });
      return;
    }

    // Handle Firebase-specific errors
    const errorMessage = getErrorMessage(error);
    res.status(401).json({
      success: false,
      message: `Authentication failed: ${errorMessage}`,
      errorCode: 'AUTHENTICATION_ERROR'
    });
  }
};
