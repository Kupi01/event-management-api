import { Attendee } from '../models/Attendee';
import { attendees } from '../../../data/attendeeData';

export const getAllAttendees = (): Attendee[] => {
  return attendees;
};

export const getAttendeeById = (id: string): Attendee | undefined => {
  return attendees.find(a => a.id === id);
};

export const getAttendeesByEventId = (eventId: string): Attendee[] => {
  return attendees.filter(a => a.eventId === eventId);
};

export const createAttendee = (attendeeData: any): Attendee => {
  const id = `attendee-${Date.now()}`;
  const now = new Date();

  const newAttendee: Attendee = {
    id,
    eventId: attendeeData.eventId,
    name: attendeeData.name,
    email: attendeeData.email,
    phone: attendeeData.phone,
    registrationDate: now,
    status: attendeeData.status || 'registered',
    createdAt: now,
    updatedAt: now
  };

  attendees.push(newAttendee);
  return newAttendee;
};

export const updateAttendee = (id: string, updateData: any): Attendee | undefined => {
  const index = attendees.findIndex(a => a.id === id);
  
  if (index === -1) {
    return undefined;
  }

  attendees[index] = {
    ...attendees[index],
    ...updateData,
    id,
    updatedAt: new Date()
  };

  return attendees[index];
};

export const deleteAttendee = (id: string): boolean => {
  const index = attendees.findIndex(a => a.id === id);
  
  if (index === -1) {
    return false;
  }

  attendees.splice(index, 1);
  return true;
};
