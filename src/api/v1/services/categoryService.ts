import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../models/Category';
import { CategoryRepository } from '../repositories/categoryRepository';
import { CategoryValidation } from '../validation/categoryValidation';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return await this.categoryRepository.getById(id);
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<{ success: boolean; data?: Category; error?: string }> {
    // Validate input
    const validation = CategoryValidation.validateCreateCategory(categoryData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Create category object
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryData.name,
      description: categoryData.description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const created = await this.categoryRepository.create(newCategory);
    return {
      success: true,
      data: created
    };
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<{ success: boolean; data?: Category; error?: string }> {
    // Validate input
    const validation = CategoryValidation.validateUpdateCategory(categoryData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.getById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: `Category with id ${id} not found`
      };
    }

    // Update category
    const updated = await this.categoryRepository.update(id, {
      ...categoryData,
      updatedAt: new Date()
    });

    return {
      success: true,
      data: updated
    };
  }

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    // Check if category exists
    const existingCategory = await this.categoryRepository.getById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: `Category with id ${id} not found`
      };
    }

    // Delete category
    await this.categoryRepository.delete(id);
    return {
      success: true
    };
  }
}
