import express, { Router, Request, Response } from 'express';
import { Event, CreateEventRequest } from '../models/Event';

const router: Router = express.Router();

// In-memory storage for demo purposes
const events: Map<string, Event> = new Map();

// GET all events
router.get('/', (_req: Request, res: Response) => {
  try {
    const eventList = Array.from(events.values());
    res.status(200).json({
      success: true,
      data: eventList,
      count: eventList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new event
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, date, location, capacity }: CreateEventRequest = req.body;

    // Basic validation
    if (!name || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, date, location'
      });
    }

    const id = `event-${Date.now()}`;
    const now = new Date();

    const newEvent: Event = {
      id,
      name,
      description: description || '',
      date,
      location,
      capacity: capacity || 0,
      status: 'upcoming',
      createdAt: now,
      updatedAt: now
    };

    events.set(id, newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET event by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = events.get(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
