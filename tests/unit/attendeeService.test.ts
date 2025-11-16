import * as attendeeService from '../../src/api/v1/services/attendeeService';
import { attendees } from '../../src/data/attendeeData';
import { Attendee, CreateAttendeeRequest, UpdateAttendeeRequest } from '../../src/api/v1/models/Attendee';

// Clear the attendees array before each test
beforeEach(() => {
  attendees.length = 0;
});

describe('Attendee Service - Unit Tests', () => {
  describe('getAllAttendees', () => {
    it('should return an empty array when no attendees exist', () => {
      const result = attendeeService.getAllAttendees();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all attendees', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-1',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      const result = attendeeService.getAllAttendees();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockAttendee);
    });

    it('should return multiple attendees', () => {
      const attendee1: Attendee = {
        id: 'attendee-1',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const attendee2: Attendee = {
        id: 'attendee-2',
        eventId: 'event-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(attendee1, attendee2);

      const result = attendeeService.getAllAttendees();
      expect(result).toHaveLength(2);
      expect(result).toContain(attendee1);
      expect(result).toContain(attendee2);
    });
  });

  describe('getAttendeeById', () => {
    it('should return undefined when attendee does not exist', () => {
      const result = attendeeService.getAttendeeById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should return the correct attendee by id', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-123',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      const result = attendeeService.getAttendeeById('attendee-123');
      expect(result).toEqual(mockAttendee);
      expect(result?.id).toBe('attendee-123');
      expect(result?.name).toBe('John Doe');
    });
  });

  describe('getAttendeesByEventId', () => {
    it('should return empty array when no attendees for event', () => {
      const result = attendeeService.getAttendeesByEventId('event-999');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all attendees for a specific event', () => {
      const attendee1: Attendee = {
        id: 'attendee-1',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const attendee2: Attendee = {
        id: 'attendee-2',
        eventId: 'event-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const attendee3: Attendee = {
        id: 'attendee-3',
        eventId: 'event-2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(attendee1, attendee2, attendee3);

      const result = attendeeService.getAttendeesByEventId('event-1');
      expect(result).toHaveLength(2);
      expect(result).toContain(attendee1);
      expect(result).toContain(attendee2);
      expect(result).not.toContain(attendee3);
    });
  });

  describe('createAttendee', () => {
    it('should create a new attendee with required fields', () => {
      const attendeeData: CreateAttendeeRequest = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const result = attendeeService.createAttendee(attendeeData);

      expect(result).toBeDefined();
      expect(result.eventId).toBe('event-1');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.id).toMatch(/^attendee-\d+$/);
      expect(result.status).toBe('registered');
      expect(result.registrationDate).toBeInstanceOf(Date);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create attendee with all optional fields', () => {
      const attendeeData: CreateAttendeeRequest = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        status: 'attended'
      };

      const result = attendeeService.createAttendee(attendeeData);

      expect(result.phone).toBe('123-456-7890');
      expect(result.status).toBe('attended');
    });

    it('should add attendee to attendees array', () => {
      expect(attendees).toHaveLength(0);

      const attendeeData: CreateAttendeeRequest = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com'
      };

      attendeeService.createAttendee(attendeeData);

      expect(attendees).toHaveLength(1);
      expect(attendees[0].name).toBe('John Doe');
    });

    it('should generate unique ids for multiple attendees', async () => {
      const attendee1Data: CreateAttendeeRequest = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com'
      };
      const attendee2Data: CreateAttendeeRequest = {
        eventId: 'event-1',
        name: 'Jane Smith',
        email: 'jane@example.com'
      };

      const result1 = attendeeService.createAttendee(attendee1Data);
      await new Promise(resolve => setTimeout(resolve, 10));
      const result2 = attendeeService.createAttendee(attendee2Data);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('updateAttendee', () => {
    it('should return undefined when attendee does not exist', () => {
      const updateData: UpdateAttendeeRequest = {
        name: 'Updated Name'
      };

      const result = attendeeService.updateAttendee('non-existent-id', updateData);
      expect(result).toBeUndefined();
    });

    it('should update attendee name', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-update-1',
        eventId: 'event-1',
        name: 'Original Name',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      const updateData: UpdateAttendeeRequest = {
        name: 'Updated Name'
      };

      const result = attendeeService.updateAttendee('attendee-update-1', updateData);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Name');
      expect(result?.email).toBe('john@example.com');
    });

    it('should update multiple fields', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-update-2',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      const updateData: UpdateAttendeeRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123-456-7890',
        status: 'attended'
      };

      const result = attendeeService.updateAttendee('attendee-update-2', updateData);

      expect(result?.name).toBe('Jane Doe');
      expect(result?.email).toBe('jane@example.com');
      expect(result?.phone).toBe('123-456-7890');
      expect(result?.status).toBe('attended');
    });

    it('should preserve the original id', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-preserve-id',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      const updateData: UpdateAttendeeRequest = {
        name: 'Updated Name'
      };

      const result = attendeeService.updateAttendee('attendee-preserve-id', updateData);

      expect(result?.id).toBe('attendee-preserve-id');
    });

    it('should update the updatedAt timestamp', () => {
      const oldDate = new Date('2024-01-01');
      const mockAttendee: Attendee = {
        id: 'attendee-timestamp',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: oldDate,
        status: 'registered',
        createdAt: oldDate,
        updatedAt: oldDate
      };
      attendees.push(mockAttendee);

      const updateData: UpdateAttendeeRequest = {
        name: 'Updated Name'
      };

      const result = attendeeService.updateAttendee('attendee-timestamp', updateData);

      expect(result?.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('deleteAttendee', () => {
    it('should return false when attendee does not exist', () => {
      const result = attendeeService.deleteAttendee('non-existent-id');
      expect(result).toBe(false);
    });

    it('should delete an attendee and return true', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-delete-1',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(mockAttendee);

      expect(attendees).toHaveLength(1);

      const result = attendeeService.deleteAttendee('attendee-delete-1');

      expect(result).toBe(true);
      expect(attendees).toHaveLength(0);
    });

    it('should only delete the specified attendee', () => {
      const attendee1: Attendee = {
        id: 'attendee-1',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const attendee2: Attendee = {
        id: 'attendee-2',
        eventId: 'event-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      attendees.push(attendee1, attendee2);

      expect(attendees).toHaveLength(2);

      const result = attendeeService.deleteAttendee('attendee-1');

      expect(result).toBe(true);
      expect(attendees).toHaveLength(1);
      expect(attendees[0].id).toBe('attendee-2');
    });
  });
});
