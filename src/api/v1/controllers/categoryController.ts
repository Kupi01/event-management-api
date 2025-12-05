import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as categoryService from '../services/categoryService';
import { Category } from '../models/Category';

/**
 * Retrieves all categories with optional sorting
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sortBy, order } = req.query;

    const queryParams: categoryService.CategoryQueryParams = {
      sortBy: sortBy as 'name' | undefined,
      order: order as 'asc' | 'desc' | undefined
    };

    const categories: Category[] = await categoryService.getAllCategories(queryParams);
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Categories retrieved successfully', 
      data: categories,
      count: categories.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific category by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category: Category | undefined = await categoryService.getCategoryById(id);

    if (!category) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Category with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Category retrieved successfully', 
      data: category 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new category (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newCategory: Category = await categoryService.createCategory(req.body);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Category created successfully', 
      data: newCategory 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing category (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCategory: Category | undefined = await categoryService.updateCategory(id, req.body);

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
    next(error);
  }
};

/**
 * Deletes a category by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted: boolean = await categoryService.deleteCategory(id);

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
    next(error);
  }
};
