import express, { Router, Request, Response } from 'express';
import { Category, CreateCategoryRequest } from '../models/Category';

const router: Router = express.Router();

// In-memory storage
const categories: Map<string, Category> = new Map();

// GET all categories
router.get('/', (_req: Request, res: Response) => {
  try {
    const categoryList = Array.from(categories.values());
    res.status(200).json({
      success: true,
      data: categoryList,
      count: categoryList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new category
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description }: CreateCategoryRequest = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const id = `category-${Date.now()}`;
    const now = new Date();

    const newCategory: Category = {
      id,
      name,
      description: description || '',
      createdAt: now,
      updatedAt: now
    };

    categories.set(id, newCategory);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
