import { Request, Response } from 'express';
import * as eventController from '../../src/api/v1/controllers/eventController';
import * as eventService from '../../src/api/v1/services/eventService';
import { Event } from '../../src/api/v1/models/Event';

// Mock the service layer
jest.mock('../../src/api/v1/services/eventService');

describe('Event Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    mockReq = {
      params: {},
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllEvents', () => {
    it('should handle successful operation', () => {
      const mockEvents: Event[] = [
        {
          id: 'event-1',
          name: 'Tech Conference',
          description: 'Annual conference',
          date: '2024-12-15',
          location: 'Convention Center',
          capacity: 500,
          status: 'upcoming',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (eventService.getAllEvents as jest.Mock).mockReturnValue(mockEvents);

      eventController.getAllEvents(mockReq as Request, mockRes as Response);

      expect(eventService.getAllEvents).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Get all events',
        data: mockEvents,
        count: 1
      });
    });

    it('should handle errors', () => {
      (eventService.getAllEvents as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      eventController.getAllEvents(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to retrieve events'
      });
    });
  });

  describe('getEventById', () => {
    it('should return event when found', () => {
      const mockEvent: Event = {
        id: 'event-123',
        name: 'Workshop',
        description: 'TypeScript workshop',
        date: '2024-11-20',
        location: 'Room 101',
        capacity: 50,
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.params = { id: 'event-123' };
      (eventService.getEventById as jest.Mock).mockReturnValue(mockEvent);

      eventController.getEventById(mockReq as Request, mockRes as Response);

      expect(eventService.getEventById).toHaveBeenCalledWith('event-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event found',
        data: mockEvent
      });
    });

    it('should return 404 when event not found', () => {
      mockReq.params = { id: 'non-existent' };
      (eventService.getEventById as jest.Mock).mockReturnValue(undefined);

      eventController.getEventById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event with id non-existent not found'
      });
    });
  });

  describe('createEvent', () => {
    it('should create event with valid data', () => {
      const mockEventData = {
        name: 'New Event',
        description: 'Event description',
        date: '2024-12-25',
        location: 'Main Hall',
        capacity: 200
      };

      const mockCreatedEvent: Event = {
        id: 'event-999',
        ...mockEventData,
        status: 'upcoming' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.body = mockEventData;
      (eventService.createEvent as jest.Mock).mockReturnValue(mockCreatedEvent);

      eventController.createEvent(mockReq as Request, mockRes as Response);

      expect(eventService.createEvent).toHaveBeenCalledWith(mockEventData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event created successfully',
        data: mockCreatedEvent
      });
    });

    it('should return 400 when name is missing', () => {
      mockReq.body = {
        date: '2024-12-25',
        location: 'Main Hall'
      };

      eventController.createEvent(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event name is required'
      });
    });

    it('should return 400 when date is missing', () => {
      mockReq.body = {
        name: 'Event Name',
        location: 'Main Hall'
      };

      eventController.createEvent(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event date is required'
      });
    });

    it('should return 400 when location is missing', () => {
      mockReq.body = {
        name: 'Event Name',
        date: '2024-12-25'
      };

      eventController.createEvent(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event location is required'
      });
    });
  });

  describe('updateEvent', () => {
    it('should update event successfully', () => {
      const updateData = {
        name: 'Updated Event Name',
        status: 'ongoing' as const
      };

      const mockUpdatedEvent: Event = {
        id: 'event-123',
        name: 'Updated Event Name',
        description: 'Description',
        date: '2024-12-15',
        location: 'Hall A',
        capacity: 300,
        status: 'ongoing',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReq.params = { id: 'event-123' };
      mockReq.body = updateData;
      (eventService.updateEvent as jest.Mock).mockReturnValue(mockUpdatedEvent);

      eventController.updateEvent(mockReq as Request, mockRes as Response);

      expect(eventService.updateEvent).toHaveBeenCalledWith('event-123', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event updated successfully',
        data: mockUpdatedEvent
      });
    });

    it('should return 404 when event not found', () => {
      mockReq.params = { id: 'non-existent' };
      mockReq.body = { name: 'New Name' };
      (eventService.updateEvent as jest.Mock).mockReturnValue(undefined);

      eventController.updateEvent(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event with id non-existent not found'
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', () => {
      mockReq.params = { id: 'event-123' };
      (eventService.deleteEvent as jest.Mock).mockReturnValue(true);

      eventController.deleteEvent(mockReq as Request, mockRes as Response);

      expect(eventService.deleteEvent).toHaveBeenCalledWith('event-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Event deleted successfully'
      });
    });

    it('should return 404 when event not found', () => {
      mockReq.params = { id: 'non-existent' };
      (eventService.deleteEvent as jest.Mock).mockReturnValue(false);

      eventController.deleteEvent(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Event with id non-existent not found'
      });
    });
  });
});
