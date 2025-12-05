import { getFirestore } from '../../../../config/firebase';
import { Category } from '../models/Category';
import { RepositoryError } from '../errors/errors';

const db = getFirestore();
const COLLECTION_NAME = 'categories';

/**
 * Repository for Category data access operations
 * Handles all Firestore interactions for categories
 */
export class CategoryRepository {
  /**
   * Retrieves all categories from Firestore
   * @returns Promise resolving to array of categories
   * @throws RepositoryError if database operation fails
   */
  async findAll(): Promise<Category[]> {
    try {
      const snapshot = await db.collection(COLLECTION_NAME).get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      throw new RepositoryError(`Failed to fetch categories: ${error}`);
    }
  }

  /**
   * Retrieves a single category by ID
   * @param id - Category ID
   * @returns Promise resolving to category or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async findById(id: string): Promise<Category | undefined> {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return undefined;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as Category;
    } catch (error) {
      throw new RepositoryError(`Failed to fetch category: ${error}`);
    }
  }

  /**
   * Creates a new category in Firestore
   * @param categoryData - Category data to create
   * @returns Promise resolving to created category
   * @throws RepositoryError if database operation fails
   */
  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const now = new Date();
      const docRef = await db.collection(COLLECTION_NAME).add({
        ...categoryData,
        createdAt: now,
        updatedAt: now
      });

      const doc = await docRef.get();
      return {
        id: doc.id,
        ...doc.data()
      } as Category;
    } catch (error) {
      throw new RepositoryError(`Failed to create category: ${error}`);
    }
  }

  /**
   * Updates an existing category
   * @param id - Category ID
   * @param updateData - Partial category data to update
   * @returns Promise resolving to updated category or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async update(id: string, updateData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | undefined> {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return undefined;
      }

      await docRef.update({
        ...updateData,
        updatedAt: new Date()
      });

      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Category;
    } catch (error) {
      throw new RepositoryError(`Failed to update category: ${error}`);
    }
  }

  /**
   * Deletes a category by ID
   * @param id - Category ID
   * @returns Promise resolving to true if deleted, false if not found
   * @throws RepositoryError if database operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw new RepositoryError(`Failed to delete category: ${error}`);
    }
  }
}
