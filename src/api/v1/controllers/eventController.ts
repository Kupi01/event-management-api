import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.eventService.getAllEvents();
      res.status(200).json({
        success: true,
        data: events,
        count: events.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch events'
      });
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);

      if (!event) {
        res.status(404).json({
          success: false,
          error: `Event with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch event'
      });
    }
  }

  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.eventService.createEvent(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create event'
      });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.eventService.updateEvent(id, req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update event'
      });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.eventService.deleteEvent(id);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete event'
      });
    }
  }
}
