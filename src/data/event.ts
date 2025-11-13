import { Event } from '../models/Event';

let events: Event[] = [];

export const eventData = {
  getAll: (): Event[] => {
    return events;
  },

  getById: (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  },

  create: (event: Event): Event => {
    events.push(event);
    return event;
  },

  update: (id: string, updatedEvent: Partial<Event>): Event | undefined => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return undefined;
    
    events[index] = { ...events[index], ...updatedEvent, id };
    return events[index];
  },

  delete: (id: string): boolean => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return false;
    
    events.splice(index, 1);
    return true;
  },

  clear: (): void => {
    events = [];
  }
};
