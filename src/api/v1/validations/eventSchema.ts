import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *           example: event-1234567890
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Name of the event
 *           example: Tech Conference 2025
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Detailed description of the event
 *           example: Annual technology conference featuring industry leaders
 *         date:
 *           type: string
 *           format: date-time
 *           description: ISO 8601 date-time of the event
 *           example: 2025-12-15T10:00:00Z
 *         location:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Physical or virtual location of the event
 *           example: Convention Center, Downtown
 *         capacity:
 *           type: number
 *           minimum: 1
 *           description: Maximum number of attendees
 *           example: 500
 *         status:
 *           type: string
 *           enum: [upcoming, ongoing, completed]
 *           default: upcoming
 *           description: Current status of the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when event was last updated
 */

/**
 * Joi validation schema for creating a new event
 * Validates required fields and data types
 */
export const createEventSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Event name is required',
      'string.min': 'Event name must be at least 3 characters long',
      'string.max': 'Event name must not exceed 100 characters',
      'any.required': 'Event name is required'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  date: Joi.string()
    .isoDate()
    .required()
    .messages({
      'string.empty': 'Event date is required',
      'string.isoDate': 'Event date must be a valid ISO 8601 date',
      'any.required': 'Event date is required'
    }),
  
  location: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Event location is required',
      'string.min': 'Location must be at least 3 characters long',
      'string.max': 'Location must not exceed 200 characters',
      'any.required': 'Event location is required'
    }),
  
  capacity: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Capacity must be at least 1',
      'number.integer': 'Capacity must be a whole number'
    }),
  
  status: Joi.string()
    .valid('upcoming', 'ongoing', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: upcoming, ongoing, completed'
    })
});

/**
 * Joi validation schema for updating an existing event
 * All fields are optional for partial updates
 */
export const updateEventSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Event name must be at least 3 characters long',
      'string.max': 'Event name must not exceed 100 characters'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  date: Joi.string()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'Event date must be a valid ISO 8601 date'
    }),
  
  location: Joi.string()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Location must be at least 3 characters long',
      'string.max': 'Location must not exceed 200 characters'
    }),
  
  capacity: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Capacity must be at least 1',
      'number.integer': 'Capacity must be a whole number'
    }),
  
  status: Joi.string()
    .valid('upcoming', 'ongoing', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: upcoming, ongoing, completed'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Type definition for event creation data
 * Inferred from the Joi schema
 */
export type CreateEventInput = {
  name: string;
  description?: string;
  date: string;
  location: string;
  capacity?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
};

/**
 * Type definition for event update data
 * All fields are optional for partial updates
 */
export type UpdateEventInput = {
  name?: string;
  description?: string;
  date?: string;
  location?: string;
  capacity?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
};
