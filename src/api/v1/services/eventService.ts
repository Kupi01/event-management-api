import { Event } from '../models/Event';
import { EventRepository } from '../repositories/eventRepository';
import { CreateEventInput, UpdateEventInput } from '../validations/eventSchema';
import { ServiceError } from '../errors/errors';

const eventRepository = new EventRepository();

/**
 * Query parameters for filtering and sorting events
 */
export interface EventQueryParams {
  status?: 'upcoming' | 'ongoing' | 'completed';
  location?: string;
  sortBy?: 'date' | 'name' | 'capacity';
  order?: 'asc' | 'desc';
}

/**
 * Retrieves all events with optional filtering and sorting
 * @param params - Query parameters for filtering and sorting
 * @returns Promise resolving to array of events
 * @throws ServiceError if retrieval fails
 */
export const getAllEvents = async (params?: EventQueryParams): Promise<Event[]> => {
  try {
    const filters = {
      status: params?.status,
      location: params?.location
    };

    let events = await eventRepository.findAll(filters);

    // Apply sorting
    if (params?.sortBy) {
      events = sortEvents(events, params.sortBy, params.order || 'asc');
    }

    return events;
  } catch (error) {
    throw new ServiceError('Failed to retrieve events');
  }
};

/**
 * Retrieves a single event by ID
 * @param id - Event ID
 * @returns Promise resolving to event or undefined if not found
 * @throws ServiceError if retrieval fails
 */
export const getEventById = async (id: string): Promise<Event | undefined> => {
  try {
    return await eventRepository.findById(id);
  } catch (error) {
    throw new ServiceError(`Failed to retrieve event with id ${id}`);
  }
};

/**
 * Creates a new event
 * @param eventData - Validated event data
 * @returns Promise resolving to created event
 * @throws ServiceError if creation fails or validation fails
 */
export const createEvent = async (eventData: CreateEventInput): Promise<Event> => {
  try {
    // Business logic validation
    if (eventData.capacity && eventData.capacity < 1) {
      throw new ServiceError('Event capacity must be at least 1');
    }

    // Validate event date is in the future (optional business rule)
    const eventDate = new Date(eventData.date);
    if (eventDate < new Date()) {
      throw new ServiceError('Event date must be in the future');
    }

    const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
      name: eventData.name,
      description: eventData.description || '',
      date: eventData.date,
      location: eventData.location,
      capacity: eventData.capacity || 0,
      status: eventData.status || 'upcoming'
    };

    return await eventRepository.create(newEvent);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError('Failed to create event');
  }
};

/**
 * Updates an existing event
 * @param id - Event ID
 * @param updateData - Validated partial event data
 * @returns Promise resolving to updated event or undefined if not found
 * @throws ServiceError if update fails
 */
export const updateEvent = async (id: string, updateData: UpdateEventInput): Promise<Event | undefined> => {
  try {
    // Validate capacity if provided
    if (updateData.capacity !== undefined && updateData.capacity < 1) {
      throw new ServiceError('Event capacity must be at least 1');
    }

    // Validate event date if provided
    if (updateData.date) {
      const eventDate = new Date(updateData.date);
      if (eventDate < new Date()) {
        throw new ServiceError('Event date must be in the future');
      }
    }

    return await eventRepository.update(id, updateData);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(`Failed to update event with id ${id}`);
  }
};

/**
 * Deletes an event by ID
 * @param id - Event ID
 * @returns Promise resolving to true if deleted, false if not found
 * @throws ServiceError if deletion fails
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    return await eventRepository.delete(id);
  } catch (error) {
    throw new ServiceError(`Failed to delete event with id ${id}`);
  }
};

/**
 * Helper function to sort events
 * @param events - Array of events to sort
 * @param sortBy - Field to sort by
 * @param order - Sort order (ascending or descending)
 * @returns Sorted array of events
 */
function sortEvents(events: Event[], sortBy: 'date' | 'name' | 'capacity', order: 'asc' | 'desc'): Event[] {
  return events.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'capacity':
        comparison = a.capacity - b.capacity;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}
