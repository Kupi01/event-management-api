import request from 'supertest';
import app from '../../src/app';
import * as categoryController from '../../src/api/v1/controllers/categoryController';

// Mock all controller functions
jest.mock('../../src/api/v1/controllers/categoryController', () => ({
  getAllCategories: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get all categories',
      data: [
        {
          id: 'cat-1',
          name: 'Technology',
          description: 'Tech events',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      count: 1
    });
  }),
  getCategoryById: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Category found',
      data: {
        id: req.params.id,
        name: 'Technology',
        description: 'Tech events',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }),
  createCategory: jest.fn((req, res) => {
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: 'cat-new',
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }),
  updateCategory: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        id: req.params.id,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }),
  deleteCategory: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  })
}));

describe('Category Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/categories', () => {
    it('should call createCategory controller', async () => {
      const mockCategory = {
        name: 'Music',
        description: 'Musical events'
      };

      await request(app)
        .post('/api/v1/categories')
        .send(mockCategory);

      expect(categoryController.createCategory).toHaveBeenCalled();
    });

    it('should return 201 status code', async () => {
      const mockCategory = {
        name: 'Sports',
        description: 'Sporting events'
      };

      const response = await request(app)
        .post('/api/v1/categories')
        .send(mockCategory);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should call getAllCategories controller', async () => {
      await request(app).get('/api/v1/categories');
      expect(categoryController.getAllCategories).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/categories');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    it('should call getCategoryById controller', async () => {
      await request(app).get('/api/v1/categories/cat-123');
      expect(categoryController.getCategoryById).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/categories/cat-123');
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should call updateCategory controller', async () => {
      const updateData = {
        name: 'Updated Category'
      };

      await request(app)
        .put('/api/v1/categories/cat-123')
        .send(updateData);

      expect(categoryController.updateCategory).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const updateData = {
        name: 'Updated Category',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/api/v1/categories/cat-123')
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should call deleteCategory controller', async () => {
      await request(app).delete('/api/v1/categories/cat-123');
      expect(categoryController.deleteCategory).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).delete('/api/v1/categories/cat-123');
      expect(response.status).toBe(200);
    });
  });
});
