import request from 'supertest';
import app from '../../src/app';

describe('Event Routes', () => {
  describe('GET /api/v1/events', () => {
    it('should return all events', async () => {
      const res = await request(app).get('/api/v1/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/events', () => {
    it('should create a new event', async () => {
      const newEvent = {
        name: 'Tech Conference',
        description: 'Annual tech conference',
        date: '2024-12-15',
        location: 'Convention Center',
        capacity: 500
      };

      const res = await request(app)
        .post('/api/v1/events')
        .send(newEvent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Tech Conference');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidEvent = {
        name: 'Test Event'
        // missing date and location
      };

      const res = await request(app)
        .post('/api/v1/events')
        .send(invalidEvent);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

});
