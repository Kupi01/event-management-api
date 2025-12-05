import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *           example: category-1234567890
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: Name of the category
 *           example: Technology
 *         description:
 *           type: string
 *           maxLength: 300
 *           description: Description of the category
 *           example: Events related to technology and innovation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when category was last updated
 */

/**
 * Joi validation schema for creating a new category
 * Validates required fields and data types
 */
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 3 characters long',
      'string.max': 'Category name must not exceed 50 characters',
      'any.required': 'Category name is required'
    }),
  
  description: Joi.string()
    .max(300)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 300 characters'
    })
});

/**
 * Joi validation schema for updating an existing category
 * All fields are optional for partial updates
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Category name must be at least 3 characters long',
      'string.max': 'Category name must not exceed 50 characters'
    }),
  
  description: Joi.string()
    .max(300)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 300 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Type definition for category creation data
 * Inferred from the Joi schema
 */
export type CreateCategoryInput = {
  name: string;
  description?: string;
};

/**
 * Type definition for category update data
 * All fields are optional for partial updates
 */
export type UpdateCategoryInput = {
  name?: string;
  description?: string;
};
