import { Event } from '../models/Event';
import { events } from '../../../data/event';

export const getAllEvents = (): Event[] => {
  return events;
};

export const getEventById = (id: string): Event | undefined => {
  return events.find(e => e.id === id);
};

export const createEvent = (eventData: any): Event => {
  const id = `event-${Date.now()}`;
  const now = new Date();

  const newEvent: Event = {
    id,
    name: eventData.name,
    description: eventData.description || '',
    date: eventData.date,
    location: eventData.location,
    capacity: eventData.capacity || 0,
    status: 'upcoming',
    createdAt: now,
    updatedAt: now
  };

  events.push(newEvent);
  return newEvent;
};

export const updateEvent = (id: string, updateData: any): Event | undefined => {
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) {
    return undefined;
  }

  events[index] = {
    ...events[index],
    ...updateData,
    id,
    updatedAt: new Date()
  };

  return events[index];
};

export const deleteEvent = (id: string): boolean => {
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) {
    return false;
  }

  events.splice(index, 1);
  return true;
};
