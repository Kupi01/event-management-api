import { Request, Response } from 'express';
import * as attendeeController from '../../src/api/v1/controllers/attendeeController';
import * as attendeeService from '../../src/api/v1/services/attendeeService';
import { Attendee } from '../../src/api/v1/models/Attendee';

// Mock the service layer
jest.mock('../../src/api/v1/services/attendeeService');

describe('Attendee Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      params: {},
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllAttendees', () => {
    it('should handle successful operation', () => {
      const mockAttendees: Attendee[] = [
        {
          id: 'attendee-1',
          eventId: 'event-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          registrationDate: new Date(),
          status: 'registered',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (attendeeService.getAllAttendees as jest.Mock).mockReturnValue(mockAttendees);

      attendeeController.getAllAttendees(mockReq as Request, mockRes as Response);

      expect(attendeeService.getAllAttendees).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Get all attendees',
        data: mockAttendees,
        count: 1
      });
    });

    it('should handle errors', () => {
      (attendeeService.getAllAttendees as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.getAllAttendees(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve attendees'
      });
    });
  });

  describe('getAttendeeById', () => {
    it('should return attendee when found', () => {
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

      mockReq.params = { id: 'attendee-123' };
      (attendeeService.getAttendeeById as jest.Mock).mockReturnValue(mockAttendee);

      attendeeController.getAttendeeById(mockReq as Request, mockRes as Response);

      expect(attendeeService.getAttendeeById).toHaveBeenCalledWith('attendee-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendee found',
        data: mockAttendee
      });
    });

    it('should return 404 when attendee not found', () => {
      mockReq.params = { id: 'non-existent' };
      (attendeeService.getAttendeeById as jest.Mock).mockReturnValue(undefined);

      attendeeController.getAttendeeById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendee with id non-existent not found'
      });
    });

    it('should handle errors', () => {
      mockReq.params = { id: 'attendee-123' };
      (attendeeService.getAttendeeById as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.getAttendeeById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve attendee'
      });
    });
  });

  describe('getAttendeesByEventId', () => {
    it('should return attendees for an event', () => {
      const mockAttendees: Attendee[] = [
        {
          id: 'attendee-1',
          eventId: 'event-1',
          name: 'John Doe',
          email: 'john@example.com',
          registrationDate: new Date(),
          status: 'registered',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockReq.params = { eventId: 'event-1' };
      (attendeeService.getAttendeesByEventId as jest.Mock).mockReturnValue(mockAttendees);

      attendeeController.getAttendeesByEventId(mockReq as Request, mockRes as Response);

      expect(attendeeService.getAttendeesByEventId).toHaveBeenCalledWith('event-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Get all attendees for event event-1',
        data: mockAttendees,
        count: 1
      });
    });

    it('should handle errors', () => {
      mockReq.params = { eventId: 'event-1' };
      (attendeeService.getAttendeesByEventId as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.getAttendeesByEventId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve attendees'
      });
    });
  });

  describe('createAttendee', () => {
    it('should create attendee successfully', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-new',
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationDate: new Date(),
        status: 'registered',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.body = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com'
      };

      (attendeeService.createAttendee as jest.Mock).mockReturnValue(mockAttendee);

      attendeeController.createAttendee(mockReq as Request, mockRes as Response);

      expect(attendeeService.createAttendee).toHaveBeenCalledWith({
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: undefined,
        status: undefined
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendee created successfully',
        data: mockAttendee
      });
    });

    it('should return 400 when eventId is missing', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      attendeeController.createAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event ID is required'
      });
    });

    it('should return 400 when name is missing', () => {
      mockReq.body = {
        eventId: 'event-1',
        email: 'john@example.com'
      };

      attendeeController.createAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendee name is required'
      });
    });

    it('should return 400 when email is missing', () => {
      mockReq.body = {
        eventId: 'event-1',
        name: 'John Doe'
      };

      attendeeController.createAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email is required'
      });
    });

    it('should handle errors', () => {
      mockReq.body = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com'
      };

      (attendeeService.createAttendee as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.createAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create attendee'
      });
    });
  });

  describe('updateAttendee', () => {
    it('should update attendee successfully', () => {
      const mockAttendee: Attendee = {
        id: 'attendee-123',
        eventId: 'event-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        registrationDate: new Date(),
        status: 'attended',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.params = { id: 'attendee-123' };
      mockReq.body = {
        name: 'Jane Doe',
        status: 'attended'
      };

      (attendeeService.updateAttendee as jest.Mock).mockReturnValue(mockAttendee);

      attendeeController.updateAttendee(mockReq as Request, mockRes as Response);

      expect(attendeeService.updateAttendee).toHaveBeenCalledWith('attendee-123', {
        name: 'Jane Doe',
        email: undefined,
        phone: undefined,
        status: 'attended'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendee updated successfully',
        data: mockAttendee
      });
    });

    it('should return 404 when attendee not found', () => {
      mockReq.params = { id: 'non-existent' };
      mockReq.body = { name: 'Updated Name' };

      (attendeeService.updateAttendee as jest.Mock).mockReturnValue(undefined);

      attendeeController.updateAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendee with id non-existent not found'
      });
    });

    it('should handle errors', () => {
      mockReq.params = { id: 'attendee-123' };
      mockReq.body = { name: 'Updated Name' };

      (attendeeService.updateAttendee as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.updateAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update attendee'
      });
    });
  });

  describe('deleteAttendee', () => {
    it('should delete attendee successfully', () => {
      mockReq.params = { id: 'attendee-123' };
      (attendeeService.deleteAttendee as jest.Mock).mockReturnValue(true);

      attendeeController.deleteAttendee(mockReq as Request, mockRes as Response);

      expect(attendeeService.deleteAttendee).toHaveBeenCalledWith('attendee-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendee deleted successfully'
      });
    });

    it('should return 404 when attendee not found', () => {
      mockReq.params = { id: 'non-existent' };
      (attendeeService.deleteAttendee as jest.Mock).mockReturnValue(false);

      attendeeController.deleteAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendee with id non-existent not found'
      });
    });

    it('should handle errors', () => {
      mockReq.params = { id: 'attendee-123' };
      (attendeeService.deleteAttendee as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      attendeeController.deleteAttendee(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to delete attendee'
      });
    });
  });
});
