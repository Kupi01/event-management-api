/**
 * HTTP Status Codes
 * Common status codes used throughout the application
 */
export const HTTP_STATUS = {
  // Success responses (2xx)
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client error responses (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  // Server error responses (5xx)
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Type for HTTP status values
 */
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
