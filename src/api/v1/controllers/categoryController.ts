import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as categoryService from '../services/categoryService';
import { Category } from '../models/Category';

/**
 * Retrieves all categories
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllCategories = (req: Request, res: Response): void => {
  try {
    const categories: Category[] = categoryService.getAllCategories();
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Get all categories', 
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve categories'
    });
  }
};

/**
 * Retrieves a specific category by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCategoryById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const category: Category | undefined = categoryService.getCategoryById(id);

    if (!category) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Category with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Category found', 
      data: category 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve category'
    });
  }
};

/**
 * Creates a new category after basic validation
 * @param req - Express request object
 * @param res - Express response object
 */
export const createCategory = (req: Request, res: Response): void => {
  try {
    // Extract and validate required fields
    const { name, description } = req.body;

    // Basic validation - check if required fields exist
    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Category name is required'
      });
      return;
    }

    // Explicitly create category data object
    const categoryData: {
      name: string;
      description?: string;
    } = {
      name,
      description
    };

    const newCategory: Category = categoryService.createCategory(categoryData);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Category created successfully', 
      data: newCategory 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create category'
    });
  }
};

/**
 * Updates an existing category
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateCategory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Explicitly create update data with only updatable properties
    const updateData: {
      name?: string;
      description?: string;
    } = {
      name,
      description
    };

    const updatedCategory: Category | undefined = categoryService.updateCategory(id, updateData);

    if (!updatedCategory) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Category with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Category updated successfully', 
      data: updatedCategory 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};

/**
 * Deletes a category by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteCategory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted: boolean = categoryService.deleteCategory(id);

    if (!deleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Category with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
};
