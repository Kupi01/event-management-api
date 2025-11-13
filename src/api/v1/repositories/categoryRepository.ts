import { Category } from '../../../models/Category';
import { categoryData } from '../../../data/category';

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return categoryData.getAll();
  }

  async getById(id: string): Promise<Category | undefined> {
    return categoryData.getById(id);
  }

  async create(category: Category): Promise<Category> {
    return categoryData.create(category);
  }

  async update(id: string, category: Partial<Category>): Promise<Category | undefined> {
    return categoryData.update(id, category);
  }

  async delete(id: string): Promise<boolean> {
    return categoryData.delete(id);
  }
}
