import { getFirestore } from '../../../../config/firebase';
import { Event } from '../models/Event';
import { RepositoryError } from '../errors/errors';

const db = getFirestore();
const COLLECTION_NAME = 'events';

/**
 * Repository for Event data access operations
 * Handles all Firestore interactions for events
 */
export class EventRepository {
  /**
   * Retrieves all events from Firestore
   * @param filters - Optional filter criteria
   * @returns Promise resolving to array of events
   * @throws RepositoryError if database operation fails
   */
  async findAll(filters?: { status?: string; location?: string }): Promise<Event[]> {
    try {
      let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);

      // Apply filters if provided
      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters?.location) {
        query = query.where('location', '==', filters.location);
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
    } catch (error) {
      throw new RepositoryError(`Failed to fetch events: ${error}`);
    }
  }

  /**
   * Retrieves a single event by ID
   * @param id - Event ID
   * @returns Promise resolving to event or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async findById(id: string): Promise<Event | undefined> {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return undefined;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as Event;
    } catch (error) {
      throw new RepositoryError(`Failed to fetch event: ${error}`);
    }
  }

  /**
   * Creates a new event in Firestore
   * @param eventData - Event data to create
   * @returns Promise resolving to created event
   * @throws RepositoryError if database operation fails
   */
  async create(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      const now = new Date();
      const docRef = await db.collection(COLLECTION_NAME).add({
        ...eventData,
        createdAt: now,
        updatedAt: now
      });

      const doc = await docRef.get();
      return {
        id: doc.id,
        ...doc.data()
      } as Event;
    } catch (error) {
      throw new RepositoryError(`Failed to create event: ${error}`);
    }
  }

  /**
   * Updates an existing event
   * @param id - Event ID
   * @param updateData - Partial event data to update
   * @returns Promise resolving to updated event or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async update(id: string, updateData: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event | undefined> {
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
      } as Event;
    } catch (error) {
      throw new RepositoryError(`Failed to update event: ${error}`);
    }
  }

  /**
   * Deletes an event by ID
   * @param id - Event ID
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
      throw new RepositoryError(`Failed to delete event: ${error}`);
    }
  }
}
