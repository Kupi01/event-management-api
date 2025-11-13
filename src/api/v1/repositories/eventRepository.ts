import { Event } from '../../../models/Event';
import { eventData } from '../../../data/event';

export class EventRepository {
  async getAll(): Promise<Event[]> {
    return eventData.getAll();
  }

  async getById(id: string): Promise<Event | undefined> {
    return eventData.getById(id);
  }

  async create(event: Event): Promise<Event> {
    return eventData.create(event);
  }

  async update(id: string, event: Partial<Event>): Promise<Event | undefined> {
    return eventData.update(id, event);
  }

  async delete(id: string): Promise<boolean> {
    return eventData.delete(id);
  }
}
