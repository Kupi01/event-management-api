import * as categoryService from '../../src/api/v1/services/categoryService';
import { categories } from '../../src/data/category';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../src/api/v1/models/Category';

// Clear the categories array before each test
beforeEach(() => {
  categories.length = 0;
});

describe('Category Service - Unit Tests', () => {
  describe('getAllCategories', () => {
    it('should return an empty array when no categories exist', () => {
      const result = categoryService.getAllCategories();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all categories', () => {
      const mockCategory: Category = {
        id: 'category-1',
        name: 'Test Category',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      const result = categoryService.getAllCategories();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockCategory);
    });

    it('should return multiple categories', () => {
      const category1: Category = {
        id: 'category-1',
        name: 'Category 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const category2: Category = {
        id: 'category-2',
        name: 'Category 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(category1, category2);

      const result = categoryService.getAllCategories();
      expect(result).toHaveLength(2);
      expect(result).toContain(category1);
      expect(result).toContain(category2);
    });
  });

  describe('getCategoryById', () => {
    it('should return undefined when category does not exist', () => {
      const result = categoryService.getCategoryById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should return the correct category by id', () => {
      const mockCategory: Category = {
        id: 'category-123',
        name: 'Test Category',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      const result = categoryService.getCategoryById('category-123');
      expect(result).toEqual(mockCategory);
      expect(result?.id).toBe('category-123');
      expect(result?.name).toBe('Test Category');
    });

    it('should return undefined for wrong id when multiple categories exist', () => {
      const category1: Category = {
        id: 'category-1',
        name: 'Category 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const category2: Category = {
        id: 'category-2',
        name: 'Category 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(category1, category2);

      const result = categoryService.getCategoryById('category-999');
      expect(result).toBeUndefined();
    });
  });

  describe('createCategory', () => {
    it('should create a new category with required fields', () => {
      const categoryData: CreateCategoryRequest = {
        name: 'New Category'
      };

      const result = categoryService.createCategory(categoryData);

      expect(result).toBeDefined();
      expect(result.name).toBe('New Category');
      expect(result.id).toMatch(/^category-\d+$/);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create category with optional description', () => {
      const categoryData: CreateCategoryRequest = {
        name: 'Full Category',
        description: 'Full Description'
      };

      const result = categoryService.createCategory(categoryData);

      expect(result.name).toBe('Full Category');
      expect(result.description).toBe('Full Description');
    });

    it('should add category to categories array', () => {
      expect(categories).toHaveLength(0);

      const categoryData: CreateCategoryRequest = {
        name: 'Array Test Category'
      };

      categoryService.createCategory(categoryData);

      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Array Test Category');
    });

    it('should generate unique ids for multiple categories', async () => {
      const category1Data: CreateCategoryRequest = {
        name: 'Category 1'
      };
      const category2Data: CreateCategoryRequest = {
        name: 'Category 2'
      };

      const result1 = categoryService.createCategory(category1Data);
      await new Promise(resolve => setTimeout(resolve, 10)); // Add small delay
      const result2 = categoryService.createCategory(category2Data);

      expect(result1.id).not.toBe(result2.id);
    });

    it('should set default empty description when not provided', () => {
      const categoryData: CreateCategoryRequest = {
        name: 'Minimal Category'
      };

      const result = categoryService.createCategory(categoryData);

      expect(result.description).toBe('');
    });
  });

  describe('updateCategory', () => {
    it('should return undefined when category does not exist', () => {
      const updateData: UpdateCategoryRequest = {
        name: 'Updated Name'
      };

      const result = categoryService.updateCategory('non-existent-id', updateData);
      expect(result).toBeUndefined();
    });

    it('should update category name', () => {
      const mockCategory: Category = {
        id: 'category-update-1',
        name: 'Original Name',
        description: 'Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      const updateData: UpdateCategoryRequest = {
        name: 'Updated Name'
      };

      const result = categoryService.updateCategory('category-update-1', updateData);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Name');
      expect(result?.description).toBe('Description'); // unchanged
    });

    it('should update multiple fields', () => {
      const mockCategory: Category = {
        id: 'category-update-2',
        name: 'Original Name',
        description: 'Original Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      const updateData: UpdateCategoryRequest = {
        name: 'New Name',
        description: 'New Description'
      };

      const result = categoryService.updateCategory('category-update-2', updateData);

      expect(result?.name).toBe('New Name');
      expect(result?.description).toBe('New Description');
    });

    it('should preserve the original id', () => {
      const mockCategory: Category = {
        id: 'category-preserve-id',
        name: 'Category',
        description: 'Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      const updateData: UpdateCategoryRequest = {
        name: 'Updated Category'
      };

      const result = categoryService.updateCategory('category-preserve-id', updateData);

      expect(result?.id).toBe('category-preserve-id');
    });

    it('should update the updatedAt timestamp', () => {
      const oldDate = new Date('2024-01-01');
      const mockCategory: Category = {
        id: 'category-timestamp',
        name: 'Category',
        description: 'Description',
        createdAt: oldDate,
        updatedAt: oldDate
      };
      categories.push(mockCategory);

      const updateData: UpdateCategoryRequest = {
        name: 'Updated Category'
      };

      const result = categoryService.updateCategory('category-timestamp', updateData);

      expect(result?.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('deleteCategory', () => {
    it('should return false when category does not exist', () => {
      const result = categoryService.deleteCategory('non-existent-id');
      expect(result).toBe(false);
    });

    it('should delete a category and return true', () => {
      const mockCategory: Category = {
        id: 'category-delete-1',
        name: 'Category to Delete',
        description: 'Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(mockCategory);

      expect(categories).toHaveLength(1);

      const result = categoryService.deleteCategory('category-delete-1');

      expect(result).toBe(true);
      expect(categories).toHaveLength(0);
    });

    it('should only delete the specified category', () => {
      const category1: Category = {
        id: 'category-1',
        name: 'Category 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const category2: Category = {
        id: 'category-2',
        name: 'Category 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(category1, category2);

      expect(categories).toHaveLength(2);

      const result = categoryService.deleteCategory('category-1');

      expect(result).toBe(true);
      expect(categories).toHaveLength(1);
      expect(categories[0].id).toBe('category-2');
    });

    it('should handle deleting from middle of array', () => {
      const category1: Category = {
        id: 'category-1',
        name: 'Category 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const category2: Category = {
        id: 'category-2',
        name: 'Category 2',
        description: 'Description 2',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const category3: Category = {
        id: 'category-3',
        name: 'Category 3',
        description: 'Description 3',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(category1, category2, category3);

      categoryService.deleteCategory('category-2');

      expect(categories).toHaveLength(2);
      expect(categories[0].id).toBe('category-1');
      expect(categories[1].id).toBe('category-3');
    });
  });
});
