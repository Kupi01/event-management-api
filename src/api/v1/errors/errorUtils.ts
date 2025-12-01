/**
 * Utility functions for error handling
 */

/**
 * Safely extracts error message from unknown error type
 * @param error - Error of unknown type
 * @returns Error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

/**
 * Checks if error is an operational error (expected error)
 * @param error - Error to check
 * @returns True if error is operational, false otherwise
 */
export const isOperationalError = (error: Error): boolean => {
  if ('isOperational' in error) {
    return (error as { isOperational: boolean }).isOperational;
  }
  return false;
};
