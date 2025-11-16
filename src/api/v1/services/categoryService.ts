import { Category } from '../models/Category';
import { categories } from '../../../data/category';

export const getAllCategories = (): Category[] => {
  return categories;
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const createCategory = (categoryData: any): Category => {
  const id = `category-${Date.now()}`;
  const now = new Date();

  const newCategory: Category = {
    id,
    name: categoryData.name,
    description: categoryData.description || '',
    createdAt: now,
    updatedAt: now
  };

  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id: string, updateData: any): Category | undefined => {
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    return undefined;
  }

  categories[index] = {
    ...categories[index],
    ...updateData,
    id,
    updatedAt: new Date()
  };

  return categories[index];
};

export const deleteCategory = (id: string): boolean => {
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    return false;
  }

  categories.splice(index, 1);
  return true;
};
