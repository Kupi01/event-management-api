import { getFirestore } from '../../../../config/firebase';
import { Attendee } from '../models/Attendee';
import { RepositoryError } from '../errors/errors';

const db = getFirestore();
const COLLECTION_NAME = 'attendees';

/**
 * Repository for Attendee data access operations
 * Handles all Firestore interactions for attendees
 */
export class AttendeeRepository {
  /**
   * Retrieves all attendees from Firestore
   * @param filters - Optional filter criteria
   * @returns Promise resolving to array of attendees
   * @throws RepositoryError if database operation fails
   */
  async findAll(filters?: { eventId?: string; status?: string }): Promise<Attendee[]> {
    try {
      let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);

      // Apply filters if provided
      if (filters?.eventId) {
        query = query.where('eventId', '==', filters.eventId);
      }
      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Attendee));
    } catch (error) {
      throw new RepositoryError(`Failed to fetch attendees: ${error}`);
    }
  }

  /**
   * Retrieves a single attendee by ID
   * @param id - Attendee ID
   * @returns Promise resolving to attendee or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async findById(id: string): Promise<Attendee | undefined> {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return undefined;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as Attendee;
    } catch (error) {
      throw new RepositoryError(`Failed to fetch attendee: ${error}`);
    }
  }

  /**
   * Creates a new attendee in Firestore
   * @param attendeeData - Attendee data to create
   * @returns Promise resolving to created attendee
   * @throws RepositoryError if database operation fails
   */
  async create(attendeeData: Omit<Attendee, 'id' | 'createdAt' | 'updatedAt' | 'registrationDate'>): Promise<Attendee> {
    try {
      const now = new Date();
      const docRef = await db.collection(COLLECTION_NAME).add({
        ...attendeeData,
        registrationDate: now,
        createdAt: now,
        updatedAt: now
      });

      const doc = await docRef.get();
      return {
        id: doc.id,
        ...doc.data()
      } as Attendee;
    } catch (error) {
      throw new RepositoryError(`Failed to create attendee: ${error}`);
    }
  }

  /**
   * Updates an existing attendee
   * @param id - Attendee ID
   * @param updateData - Partial attendee data to update
   * @returns Promise resolving to updated attendee or undefined if not found
   * @throws RepositoryError if database operation fails
   */
  async update(id: string, updateData: Partial<Omit<Attendee, 'id' | 'createdAt' | 'updatedAt' | 'registrationDate'>>): Promise<Attendee | undefined> {
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
      } as Attendee;
    } catch (error) {
      throw new RepositoryError(`Failed to update attendee: ${error}`);
    }
  }

  /**
   * Deletes an attendee by ID
   * @param id - Attendee ID
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
      throw new RepositoryError(`Failed to delete attendee: ${error}`);
    }
  }
}
