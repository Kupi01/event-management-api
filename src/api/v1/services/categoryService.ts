import { Category } from '../models/Category';
import { CategoryRepository } from '../repositories/categoryRepository';
import { CreateCategoryInput, UpdateCategoryInput } from '../validations/categorySchema';
import { ServiceError } from '../errors/errors';

const categoryRepository = new CategoryRepository();

/**
 * Query parameters for sorting categories
 */
export interface CategoryQueryParams {
  sortBy?: 'name';
  order?: 'asc' | 'desc';
}

/**
 * Retrieves all categories with optional sorting
 * @param params - Query parameters for sorting
 * @returns Promise resolving to array of categories
 * @throws ServiceError if retrieval fails
 */
export const getAllCategories = async (params?: CategoryQueryParams): Promise<Category[]> => {
  try {
    let categories = await categoryRepository.findAll();

    // Apply sorting
    if (params?.sortBy) {
      categories = sortCategories(categories, params.sortBy, params.order || 'asc');
    }

    return categories;
  } catch (error) {
    throw new ServiceError('Failed to retrieve categories');
  }
};

/**
 * Retrieves a single category by ID
 * @param id - Category ID
 * @returns Promise resolving to category or undefined if not found
 * @throws ServiceError if retrieval fails
 */
export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  try {
    return await categoryRepository.findById(id);
  } catch (error) {
    throw new ServiceError(`Failed to retrieve category with id ${id}`);
  }
};

/**
 * Creates a new category
 * @param categoryData - Validated category data
 * @returns Promise resolving to created category
 * @throws ServiceError if creation fails
 */
export const createCategory = async (categoryData: CreateCategoryInput): Promise<Category> => {
  try {
    const newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> = {
      name: categoryData.name,
      description: categoryData.description || ''
    };

    return await categoryRepository.create(newCategory);
  } catch (error) {
    throw new ServiceError('Failed to create category');
  }
};

/**
 * Updates an existing category
 * @param id - Category ID
 * @param updateData - Validated partial category data
 * @returns Promise resolving to updated category or undefined if not found
 * @throws ServiceError if update fails
 */
export const updateCategory = async (id: string, updateData: UpdateCategoryInput): Promise<Category | undefined> => {
  try {
    return await categoryRepository.update(id, updateData);
  } catch (error) {
    throw new ServiceError(`Failed to update category with id ${id}`);
  }
};

/**
 * Deletes a category by ID
 * @param id - Category ID
 * @returns Promise resolving to true if deleted, false if not found
 * @throws ServiceError if deletion fails
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    return await categoryRepository.delete(id);
  } catch (error) {
    throw new ServiceError(`Failed to delete category with id ${id}`);
  }
};

/**
 * Helper function to sort categories
 * @param categories - Array of categories to sort
 * @param sortBy - Field to sort by
 * @param order - Sort order (ascending or descending)
 * @returns Sorted array of categories
 */
function sortCategories(categories: Category[], sortBy: 'name', order: 'asc' | 'desc'): Category[] {
  return categories.sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}
