import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as eventService from '../services/eventService';
import { Event } from '../models/Event';

/**
 * Retrieves all events
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllEvents = (req: Request, res: Response): void => {
  try {
    const events: Event[] = eventService.getAllEvents();
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Get all events', 
      data: events,
      count: events.length
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve events'
    });
  }
};

/**
 * Retrieves a specific event by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEventById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const event: Event | undefined = eventService.getEventById(id);

    if (!event) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Event with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event found', 
      data: event 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve event'
    });
  }
};

/**
 * Creates a new event after basic validation
 * @param req - Express request object
 * @param res - Express response object
 */
export const createEvent = (req: Request, res: Response): void => {
  try {
    // Extract and validate required fields
    const { name, date, location, description, capacity, status } = req.body;

    // Basic validation - check if required fields exist
    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Event name is required'
      });
      return;
    }

    if (!date) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Event date is required'
      });
      return;
    }

    if (!location) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Event location is required'
      });
      return;
    }

    // Explicitly create event data object with only needed properties
    const eventData: {
      name: string;
      date: string;
      location: string;
      description?: string;
      capacity?: number;
      status?: 'upcoming' | 'ongoing' | 'completed';
    } = {
      name,
      date,
      location,
      description,
      capacity,
      status
    };

    const newEvent: Event = eventService.createEvent(eventData);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Event created successfully', 
      data: newEvent 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

/**
 * Updates an existing event
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateEvent = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, description, date, location, capacity, status } = req.body;

    // Explicitly create update data with only updatable properties
    // This demonstrates Pick<Event, ...> type usage at runtime
    const updateData: {
      name?: string;
      description?: string;
      date?: string;
      location?: string;
      capacity?: number;
      status?: 'upcoming' | 'ongoing' | 'completed';
    } = {
      name,
      description,
      date,
      location,
      capacity,
      status
    };

    const updatedEvent: Event | undefined = eventService.updateEvent(id, updateData);

    if (!updatedEvent) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Event with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event updated successfully', 
      data: updatedEvent 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

/**
 * Deletes an event by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteEvent = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted: boolean = eventService.deleteEvent(id);

    if (!deleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Event with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};
