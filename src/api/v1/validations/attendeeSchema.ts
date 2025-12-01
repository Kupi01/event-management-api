import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendee:
 *       type: object
 *       required:
 *         - eventId
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *           example: attendee-1234567890
 *         eventId:
 *           type: string
 *           description: ID of the event the attendee is registered for
 *           example: event-1234567890
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Full name of the attendee
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the attendee
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           pattern: ^\+?[1-9]\d{1,14}$
 *           description: Phone number (E.164 format)
 *           example: +12345678901
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           description: Date when attendee registered
 *         status:
 *           type: string
 *           enum: [registered, attended, cancelled]
 *           default: registered
 *           description: Current status of the attendee
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when attendee was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when attendee was last updated
 */

/**
 * Joi validation schema for creating a new attendee
 * Validates required fields and data types
 */
export const createAttendeeSchema = Joi.object({
  eventId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Event ID is required',
      'any.required': 'Event ID is required'
    }),
  
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Attendee name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Attendee name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be in valid E.164 format (e.g., +12345678901)'
    }),
  
  status: Joi.string()
    .valid('registered', 'attended', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Status must be one of: registered, attended, cancelled'
    })
});

/**
 * Joi validation schema for updating an existing attendee
 * All fields are optional for partial updates
 */
export const updateAttendeeSchema = Joi.object({
  eventId: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Event ID cannot be empty'
    }),
  
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be in valid E.164 format (e.g., +12345678901)'
    }),
  
  status: Joi.string()
    .valid('registered', 'attended', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Status must be one of: registered, attended, cancelled'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Type definition for attendee creation data
 * Inferred from the Joi schema
 */
export type CreateAttendeeInput = {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  status?: 'registered' | 'attended' | 'cancelled';
};

/**
 * Type definition for attendee update data
 * All fields are optional for partial updates
 */
export type UpdateAttendeeInput = {
  eventId?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: 'registered' | 'attended' | 'cancelled';
};
