import { Request, Response } from 'express';
import * as categoryController from '../../src/api/v1/controllers/categoryController';
import * as categoryService from '../../src/api/v1/services/categoryService';
import { Category } from '../../src/api/v1/models/Category';

// Mock the service layer
jest.mock('../../src/api/v1/services/categoryService');
describe('Category Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      params: {},
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllCategories', () => {
    it('should handle successful operation', () => {
      const mockCategories: Category[] = [
        {
          id: 'cat-1',
          name: 'Technology',
          description: 'Tech events',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (categoryService.getAllCategories as jest.Mock).mockReturnValue(mockCategories);

      categoryController.getAllCategories(mockReq as Request, mockRes as Response);

      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Get all categories',
        data: mockCategories,
        count: 1
      });
    });

    it('should handle errors', () => {
      (categoryService.getAllCategories as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      categoryController.getAllCategories(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve categories'
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', () => {
      const mockCategory: Category = {
        id: 'cat-123',
        name: 'Sports',
        description: 'Sporting events',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.params = { id: 'cat-123' };
      (categoryService.getCategoryById as jest.Mock).mockReturnValue(mockCategory);

      categoryController.getCategoryById(mockReq as Request, mockRes as Response);

      expect(categoryService.getCategoryById).toHaveBeenCalledWith('cat-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category found',
        data: mockCategory
      });
    });

    it('should return 404 when category not found', () => {
      mockReq.params = { id: 'non-existent' };
      (categoryService.getCategoryById as jest.Mock).mockReturnValue(undefined);

      categoryController.getCategoryById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category with id non-existent not found'
      });
    });
  });

  describe('createCategory', () => {
    it('should create category with valid data', () => {
      const mockCategoryData = {
        name: 'Music',
        description: 'Musical events and concerts'
      };

      const mockCreatedCategory: Category = {
        id: 'cat-999',
        ...mockCategoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.body = mockCategoryData;
      (categoryService.createCategory as jest.Mock).mockReturnValue(mockCreatedCategory);

      categoryController.createCategory(mockReq as Request, mockRes as Response);

      expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategoryData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category created successfully',
        data: mockCreatedCategory
      });
    });

    it('should return 400 when name is missing', () => {
      mockReq.body = {
        description: 'Some description'
      };

      categoryController.createCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category name is required'
      });
    });

    it('should handle empty request body', () => {
      mockReq.body = {};

      categoryController.createCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category name is required'
      });
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', () => {
      const updateData = {
        name: 'Updated Category',
        description: 'Updated description'
      };

      const mockUpdatedCategory: Category = {
        id: 'cat-123',
        name: 'Updated Category',
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.params = { id: 'cat-123' };
      mockReq.body = updateData;
      (categoryService.updateCategory as jest.Mock).mockReturnValue(mockUpdatedCategory);

      categoryController.updateCategory(mockReq as Request, mockRes as Response);

      expect(categoryService.updateCategory).toHaveBeenCalledWith('cat-123', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category updated successfully',
        data: mockUpdatedCategory
      });
    });

    it('should return 404 when category not found', () => {
      mockReq.params = { id: 'non-existent' };
      mockReq.body = { name: 'New Name' };
      (categoryService.updateCategory as jest.Mock).mockReturnValue(undefined);

      categoryController.updateCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category with id non-existent not found'
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', () => {
      mockReq.params = { id: 'cat-123' };
      (categoryService.deleteCategory as jest.Mock).mockReturnValue(true);

      categoryController.deleteCategory(mockReq as Request, mockRes as Response);

      expect(categoryService.deleteCategory).toHaveBeenCalledWith('cat-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category deleted successfully'
      });
    });

    it('should return 404 when category not found', () => {
      mockReq.params = { id: 'non-existent' };
      (categoryService.deleteCategory as jest.Mock).mockReturnValue(false);

      categoryController.deleteCategory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category with id non-existent not found'
      });
    });
  });
});
