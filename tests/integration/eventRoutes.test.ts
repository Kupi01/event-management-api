import request from 'supertest';
import app from '../../src/app';
import * as eventController from '../../src/api/v1/controllers/eventController';

// Mock the controller functions
jest.mock('../../src/api/v1/controllers/eventController', () => ({
  getAllEvents: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get all events',
      data: [],
      count: 0
    });
  }),
  getEventById: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Event found',
      data: { id: '1', name: 'Test Event' }
    });
  }),
  createEvent: jest.fn((req, res) => {
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: '1', ...req.body }
    });
  }),
  updateEvent: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { id: '1', ...req.body }
    });
  }),
  deleteEvent: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  })
}));

describe('Event API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/events (Create)', () => {
    it('should call createEvent controller', async () => {
      const mockEvent = {
        name: 'Tech Conference',
        description: 'Annual tech conference',
        date: '2024-12-15',
        location: 'Convention Center',
        capacity: 500
      };

      await request(app)
        .post('/api/v1/events')
        .send(mockEvent);

      expect(eventController.createEvent).toHaveBeenCalled();
    });

    it('should return 201 status code', async () => {
      const mockEvent = {
        name: 'Workshop',
        date: '2024-11-20',
        location: 'Room 101'
      };

      const response = await request(app)
        .post('/api/v1/events')
        .send(mockEvent);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/v1/events (Read All)', () => {
    it('should call getAllEvents controller', async () => {
      await request(app).get('/api/v1/events');

      expect(eventController.getAllEvents).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/events');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/events/:id (Read One)', () => {
    it('should call getEventById controller', async () => {
      await request(app).get('/api/v1/events/event-123');

      expect(eventController.getEventById).toHaveBeenCalled();
    });

    it('should return 200 status code for valid ID', async () => {
      const response = await request(app).get('/api/v1/events/event-123');

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/v1/events/:id (Update)', () => {
    it('should call updateEvent controller', async () => {
      const updateData = {
        name: 'Updated Event',
        status: 'ongoing'
      };

      await request(app)
        .put('/api/v1/events/event-123')
        .send(updateData);

      expect(eventController.updateEvent).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const updateData = {
        capacity: 1000
      };

      const response = await request(app)
        .put('/api/v1/events/event-123')
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/events/:id (Delete)', () => {
    it('should call deleteEvent controller', async () => {
      await request(app).delete('/api/v1/events/event-123');

      expect(eventController.deleteEvent).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).delete('/api/v1/events/event-123');

      expect(response.status).toBe(200);
    });
  });
});
