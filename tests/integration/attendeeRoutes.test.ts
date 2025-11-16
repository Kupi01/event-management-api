import request from 'supertest';
import app from '../../src/app';
import * as attendeeController from '../../src/api/v1/controllers/attendeeController';

// Mock the controller functions
jest.mock('../../src/api/v1/controllers/attendeeController', () => ({
  getAllAttendees: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get all attendees',
      data: [],
      count: 0
    });
  }),
  getAttendeeById: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Attendee found',
      data: { id: '1', name: 'John Doe', email: 'john@example.com' }
    });
  }),
  getAttendeesByEventId: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get all attendees for event event-1',
      data: [],
      count: 0
    });
  }),
  createAttendee: jest.fn((req, res) => {
    res.status(201).json({
      success: true,
      message: 'Attendee created successfully',
      data: { id: '1', ...req.body }
    });
  }),
  updateAttendee: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Attendee updated successfully',
      data: { id: '1', ...req.body }
    });
  }),
  deleteAttendee: jest.fn((req, res) => {
    res.status(200).json({
      success: true,
      message: 'Attendee deleted successfully'
    });
  })
}));

describe('Attendee API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/attendees (Create)', () => {
    it('should call createAttendee controller', async () => {
      const mockAttendee = {
        eventId: 'event-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      };

      await request(app)
        .post('/api/v1/attendees')
        .send(mockAttendee);

      expect(attendeeController.createAttendee).toHaveBeenCalled();
    });

    it('should return 201 status code', async () => {
      const mockAttendee = {
        eventId: 'event-1',
        name: 'Jane Smith',
        email: 'jane@example.com'
      };

      const response = await request(app)
        .post('/api/v1/attendees')
        .send(mockAttendee);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/v1/attendees (Read All)', () => {
    it('should call getAllAttendees controller', async () => {
      await request(app).get('/api/v1/attendees');

      expect(attendeeController.getAllAttendees).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/attendees');

      expect(response.status).toBe(200);
    });

    it('should return correct response structure', async () => {
      const response = await request(app).get('/api/v1/attendees');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('GET /api/v1/attendees/:id (Read One)', () => {
    it('should call getAttendeeById controller', async () => {
      await request(app).get('/api/v1/attendees/attendee-123');

      expect(attendeeController.getAttendeeById).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/attendees/attendee-123');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/events/:eventId/attendees (Read By Event)', () => {
    it('should call getAttendeesByEventId controller', async () => {
      await request(app).get('/api/v1/events/event-1/attendees');

      expect(attendeeController.getAttendeesByEventId).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/v1/events/event-1/attendees');

      expect(response.status).toBe(200);
    });

    it('should return correct response structure', async () => {
      const response = await request(app).get('/api/v1/events/event-1/attendees');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('PUT /api/v1/attendees/:id (Update)', () => {
    it('should call updateAttendee controller', async () => {
      const updateData = {
        name: 'John Updated',
        status: 'attended'
      };

      await request(app)
        .put('/api/v1/attendees/attendee-123')
        .send(updateData);

      expect(attendeeController.updateAttendee).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const updateData = {
        status: 'cancelled'
      };

      const response = await request(app)
        .put('/api/v1/attendees/attendee-123')
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/attendees/:id (Delete)', () => {
    it('should call deleteAttendee controller', async () => {
      await request(app).delete('/api/v1/attendees/attendee-123');

      expect(attendeeController.deleteAttendee).toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const response = await request(app).delete('/api/v1/attendees/attendee-123');

      expect(response.status).toBe(200);
    });

    it('should return success message', async () => {
      const response = await request(app).delete('/api/v1/attendees/attendee-123');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });
  });
});
