import * as eventService from '../../src/api/v1/services/eventService';
import { events } from '../../src/data/event';
import { Event } from '../../src/api/v1/models/Event';

// Clear the events array before each test
beforeEach(() => {
  events.length = 0;
});

describe('Event Service - Unit Tests', () => {
  describe('getAllEvents', () => {
    it('should return an empty array when no events exist', () => {
      const result = eventService.getAllEvents();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all events', () => {
      const mockEvent: Event = {
        id: 'event-1',
        name: 'Test Event',
        description: 'Test Description',
        date: '2024-12-15',
        location: 'Test Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      const result = eventService.getAllEvents();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockEvent);
    });

    it('should return multiple events', () => {
      const event1: Event = {
        id: 'event-1',
        name: 'Event 1',
        description: 'Description 1',
        date: '2024-12-15',
        location: 'Location 1',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event2: Event = {
        id: 'event-2',
        name: 'Event 2',
        description: 'Description 2',
        date: '2024-12-16',
        location: 'Location 2',
        capacity: 200,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(event1, event2);

      const result = eventService.getAllEvents();
      expect(result).toHaveLength(2);
      expect(result).toContain(event1);
      expect(result).toContain(event2);
    });
  });

  describe('getEventById', () => {
    it('should return undefined when event does not exist', () => {
      const result = eventService.getEventById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should return the correct event by id', () => {
      const mockEvent: Event = {
        id: 'event-123',
        name: 'Test Event',
        description: 'Test Description',
        date: '2024-12-15',
        location: 'Test Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      const result = eventService.getEventById('event-123');
      expect(result).toEqual(mockEvent);
      expect(result?.id).toBe('event-123');
      expect(result?.name).toBe('Test Event');
    });

    it('should return undefined for wrong id when multiple events exist', () => {
      const event1: Event = {
        id: 'event-1',
        name: 'Event 1',
        description: 'Description 1',
        date: '2024-12-15',
        location: 'Location 1',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event2: Event = {
        id: 'event-2',
        name: 'Event 2',
        description: 'Description 2',
        date: '2024-12-16',
        location: 'Location 2',
        capacity: 200,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(event1, event2);

      const result = eventService.getEventById('event-999');
      expect(result).toBeUndefined();
    });
  });

  describe('createEvent', () => {
    it('should create a new event with required fields', () => {
      const eventData: any = {
        name: 'New Event',
        date: '2024-12-20',
        location: 'New Location'
      };

      const result = eventService.createEvent(eventData);

      expect(result).toBeDefined();
      expect(result.name).toBe('New Event');
      expect(result.date).toBe('2024-12-20');
      expect(result.location).toBe('New Location');
      expect(result.id).toMatch(/^event-\d+$/);
      expect(result.status).toBe('upcoming');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create event with all optional fields', () => {
      const eventData: any = {
        name: 'Full Event',
        description: 'Full Description',
        date: '2024-12-25',
        location: 'Full Location',
        capacity: 500,
        status: 'upcoming'
      };

      const result = eventService.createEvent(eventData);

      expect(result.name).toBe('Full Event');
      expect(result.description).toBe('Full Description');
      expect(result.capacity).toBe(500);
    });

    it('should add event to events array', () => {
      expect(events).toHaveLength(0);

      const eventData: any = {
        name: 'Array Test Event',
        date: '2024-12-30',
        location: 'Array Location'
      };

      eventService.createEvent(eventData);

      expect(events).toHaveLength(1);
      expect(events[0].name).toBe('Array Test Event');
    });

    it('should generate unique ids for multiple events', async () => {
      const event1Data: any = {
        name: 'Event 1',
        date: '2024-12-15',
        location: 'Location 1'
      };
      const event2Data: any = {
        name: 'Event 2',
        date: '2024-12-16',
        location: 'Location 2'
      };

      const result1 = eventService.createEvent(event1Data);
      await new Promise(resolve => setTimeout(resolve, 10)); // Add small delay
      const result2 = eventService.createEvent(event2Data);

      expect(result1.id).not.toBe(result2.id);
    });

    it('should set default values for optional fields', () => {
      const eventData: any = {
        name: 'Minimal Event',
        date: '2024-12-15',
        location: 'Minimal Location'
      };

      const result = eventService.createEvent(eventData);

      expect(result.description).toBe('');
      expect(result.capacity).toBe(0);
    });
  });

  describe('updateEvent', () => {
    it('should return undefined when event does not exist', () => {
      const updateData: any = {
        name: 'Updated Name'
      };

      const result = eventService.updateEvent('non-existent-id', updateData);
      expect(result).toBeUndefined();
    });

    it('should update event name', () => {
      const mockEvent: Event = {
        id: 'event-update-1',
        name: 'Original Name',
        description: 'Description',
        date: '2024-12-15',
        location: 'Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      const updateData: any = {
        name: 'Updated Name'
      };

      const result = eventService.updateEvent('event-update-1', updateData);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Name');
      expect(result?.description).toBe('Description'); // unchanged
    });

    it('should update multiple fields', () => {
      const mockEvent: Event = {
        id: 'event-update-2',
        name: 'Original Name',
        description: 'Original Description',
        date: '2024-12-15',
        location: 'Original Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      const updateData: any = {
        name: 'New Name',
        description: 'New Description',
        capacity: 200,
        status: 'ongoing'
      };

      const result = eventService.updateEvent('event-update-2', updateData);

      expect(result?.name).toBe('New Name');
      expect(result?.description).toBe('New Description');
      expect(result?.capacity).toBe(200);
      expect(result?.status).toBe('ongoing');
    });

    it('should preserve the original id', () => {
      const mockEvent: Event = {
        id: 'event-preserve-id',
        name: 'Event',
        description: 'Description',
        date: '2024-12-15',
        location: 'Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      const updateData: any = {
        name: 'Updated Event'
      };

      const result = eventService.updateEvent('event-preserve-id', updateData);

      expect(result?.id).toBe('event-preserve-id');
    });

    it('should update the updatedAt timestamp', () => {
      const oldDate = new Date('2024-01-01');
      const mockEvent: Event = {
        id: 'event-timestamp',
        name: 'Event',
        description: 'Description',
        date: '2024-12-15',
        location: 'Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: oldDate,
        updatedAt: oldDate
      };
      events.push(mockEvent);

      const updateData: any = {
        name: 'Updated Event'
      };

      const result = eventService.updateEvent('event-timestamp', updateData);

      expect(result?.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('deleteEvent', () => {
    it('should return false when event does not exist', () => {
      const result = eventService.deleteEvent('non-existent-id');
      expect(result).toBe(false);
    });

    it('should delete an event and return true', () => {
      const mockEvent: Event = {
        id: 'event-delete-1',
        name: 'Event to Delete',
        description: 'Description',
        date: '2024-12-15',
        location: 'Location',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(mockEvent);

      expect(events).toHaveLength(1);

      const result = eventService.deleteEvent('event-delete-1');

      expect(result).toBe(true);
      expect(events).toHaveLength(0);
    });

    it('should only delete the specified event', () => {
      const event1: Event = {
        id: 'event-1',
        name: 'Event 1',
        description: 'Description 1',
        date: '2024-12-15',
        location: 'Location 1',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event2: Event = {
        id: 'event-2',
        name: 'Event 2',
        description: 'Description 2',
        date: '2024-12-16',
        location: 'Location 2',
        capacity: 200,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(event1, event2);

      expect(events).toHaveLength(2);

      const result = eventService.deleteEvent('event-1');

      expect(result).toBe(true);
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('event-2');
    });

    it('should handle deleting from middle of array', () => {
      const event1: Event = {
        id: 'event-1',
        name: 'Event 1',
        description: 'Description 1',
        date: '2024-12-15',
        location: 'Location 1',
        capacity: 100,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event2: Event = {
        id: 'event-2',
        name: 'Event 2',
        description: 'Description 2',
        date: '2024-12-16',
        location: 'Location 2',
        capacity: 200,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const event3: Event = {
        id: 'event-3',
        name: 'Event 3',
        description: 'Description 3',
        date: '2024-12-17',
        location: 'Location 3',
        capacity: 300,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      events.push(event1, event2, event3);

      eventService.deleteEvent('event-2');

      expect(events).toHaveLength(2);
      expect(events[0].id).toBe('event-1');
      expect(events[1].id).toBe('event-3');
    });
  });
});
