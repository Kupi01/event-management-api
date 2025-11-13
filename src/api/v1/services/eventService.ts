import { Event, CreateEventRequest, UpdateEventRequest } from '../../../models/Event';
import { EventRepository } from '../repositories/eventRepository';
import { EventValidation } from '../validation/eventValidation';

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.getAll();
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return await this.eventRepository.getById(id);
  }

  async createEvent(eventData: CreateEventRequest): Promise<{ success: boolean; data?: Event; error?: string }> {
    // Validate input
    const validation = EventValidation.validateCreateEvent(eventData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Create event object
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      name: eventData.name,
      description: eventData.description || '',
      date: eventData.date,
      location: eventData.location,
      capacity: eventData.capacity || 0,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const created = await this.eventRepository.create(newEvent);
    return {
      success: true,
      data: created
    };
  }

  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<{ success: boolean; data?: Event; error?: string }> {
    // Validate input
    const validation = EventValidation.validateUpdateEvent(eventData);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Check if event exists
    const existingEvent = await this.eventRepository.getById(id);
    if (!existingEvent) {
      return {
        success: false,
        error: `Event with id ${id} not found`
      };
    }

    // Update event
    const updated = await this.eventRepository.update(id, {
      ...eventData,
      updatedAt: new Date()
    });

    return {
      success: true,
      data: updated
    };
  }

  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    // Check if event exists
    const existingEvent = await this.eventRepository.getById(id);
    if (!existingEvent) {
      return {
        success: false,
        error: `Event with id ${id} not found`
      };
    }

    // Delete event
    await this.eventRepository.delete(id);
    return {
      success: true
    };
  }
}
