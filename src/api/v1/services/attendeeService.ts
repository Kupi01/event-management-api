import { Attendee } from '../models/Attendee';
import { AttendeeRepository } from '../repositories/attendeeRepository';
import { CreateAttendeeInput, UpdateAttendeeInput } from '../validations/attendeeSchema';
import { ServiceError } from '../errors/errors';

const attendeeRepository = new AttendeeRepository();

/**
 * Query parameters for filtering and sorting attendees
 */
export interface AttendeeQueryParams {
  eventId?: string;
  status?: 'registered' | 'attended' | 'cancelled';
  sortBy?: 'name' | 'registrationDate';
  order?: 'asc' | 'desc';
}

/**
 * Retrieves all attendees with optional filtering and sorting
 * @param params - Query parameters for filtering and sorting
 * @returns Promise resolving to array of attendees
 * @throws ServiceError if retrieval fails
 */
export const getAllAttendees = async (params?: AttendeeQueryParams): Promise<Attendee[]> => {
  try {
    const filters = {
      eventId: params?.eventId,
      status: params?.status
    };

    let attendees = await attendeeRepository.findAll(filters);

    // Apply sorting
    if (params?.sortBy) {
      attendees = sortAttendees(attendees, params.sortBy, params.order || 'asc');
    }

    return attendees;
  } catch (error) {
    throw new ServiceError('Failed to retrieve attendees');
  }
};

/**
 * Retrieves a single attendee by ID
 * @param id - Attendee ID
 * @returns Promise resolving to attendee or undefined if not found
 * @throws ServiceError if retrieval fails
 */
export const getAttendeeById = async (id: string): Promise<Attendee | undefined> => {
  try {
    return await attendeeRepository.findById(id);
  } catch (error) {
    throw new ServiceError(`Failed to retrieve attendee with id ${id}`);
  }
};

/**
 * Retrieves all attendees for a specific event
 * @param eventId - Event ID
 * @returns Promise resolving to array of attendees
 * @throws ServiceError if retrieval fails
 */
export const getAttendeesByEventId = async (eventId: string): Promise<Attendee[]> => {
  try {
    return await attendeeRepository.findAll({ eventId });
  } catch (error) {
    throw new ServiceError(`Failed to retrieve attendees for event ${eventId}`);
  }
};

/**
 * Creates a new attendee
 * @param attendeeData - Validated attendee data
 * @returns Promise resolving to created attendee
 * @throws ServiceError if creation fails or validation fails
 */
export const createAttendee = async (attendeeData: CreateAttendeeInput): Promise<Attendee> => {
  try {
    // Business logic: validate email format (additional check beyond Joi)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(attendeeData.email)) {
      throw new ServiceError('Invalid email format');
    }

    const newAttendee: Omit<Attendee, 'id' | 'createdAt' | 'updatedAt' | 'registrationDate'> = {
      eventId: attendeeData.eventId,
      name: attendeeData.name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      status: attendeeData.status || 'registered'
    };

    return await attendeeRepository.create(newAttendee);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError('Failed to create attendee');
  }
};

/**
 * Updates an existing attendee
 * @param id - Attendee ID
 * @param updateData - Validated partial attendee data
 * @returns Promise resolving to updated attendee or undefined if not found
 * @throws ServiceError if update fails
 */
export const updateAttendee = async (id: string, updateData: UpdateAttendeeInput): Promise<Attendee | undefined> => {
  try {
    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new ServiceError('Invalid email format');
      }
    }

    return await attendeeRepository.update(id, updateData);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(`Failed to update attendee with id ${id}`);
  }
};

/**
 * Deletes an attendee by ID
 * @param id - Attendee ID
 * @returns Promise resolving to true if deleted, false if not found
 * @throws ServiceError if deletion fails
 */
export const deleteAttendee = async (id: string): Promise<boolean> => {
  try {
    return await attendeeRepository.delete(id);
  } catch (error) {
    throw new ServiceError(`Failed to delete attendee with id ${id}`);
  }
};

/**
 * Helper function to sort attendees
 * @param attendees - Array of attendees to sort
 * @param sortBy - Field to sort by
 * @param order - Sort order (ascending or descending)
 * @returns Sorted array of attendees
 */
function sortAttendees(attendees: Attendee[], sortBy: 'name' | 'registrationDate', order: 'asc' | 'desc'): Attendee[] {
  return attendees.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'registrationDate':
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}
