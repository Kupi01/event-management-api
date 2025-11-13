import { Category } from '../models/Category';

let categories: Category[] = [];

export const categoryData = {
  getAll: (): Category[] => {
    return categories;
  },

  getById: (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  },

  create: (category: Category): Category => {
    categories.push(category);
    return category;
  },

  update: (id: string, updatedCategory: Partial<Category>): Category | undefined => {
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) return undefined;
    
    categories[index] = { ...categories[index], ...updatedCategory, id };
    return categories[index];
  },

  delete: (id: string): boolean => {
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) return false;
    
    categories.splice(index, 1);
    return true;
  },

  clear: (): void => {
    categories = [];
  }
};
