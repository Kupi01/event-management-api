import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          error: `Category with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch category'
      });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.categoryService.createCategory(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create category'
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.categoryService.updateCategory(id, req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update category'
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.categoryService.deleteCategory(id);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete category'
      });
    }
  }
}
