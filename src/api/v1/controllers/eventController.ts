import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as eventService from '../services/eventService';
import { Event } from '../models/Event';

/**
 * Retrieves all events with optional filtering and sorting
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, location, sortBy, order } = req.query;

    const queryParams: eventService.EventQueryParams = {
      status: status as 'upcoming' | 'ongoing' | 'completed' | undefined,
      location: location as string | undefined,
      sortBy: sortBy as 'date' | 'name' | 'capacity' | undefined,
      order: order as 'asc' | 'desc' | undefined
    };

    const events: Event[] = await eventService.getAllEvents(queryParams);
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Events retrieved successfully', 
      data: events,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific event by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event: Event | undefined = await eventService.getEventById(id);

    if (!event) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Event with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event retrieved successfully', 
      data: event 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new event (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newEvent: Event = await eventService.createEvent(req.body);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Event created successfully', 
      data: newEvent 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing event (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedEvent: Event | undefined = await eventService.updateEvent(id, req.body);

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
    next(error);
  }
};

/**
 * Deletes an event by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted: boolean = await eventService.deleteEvent(id);

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
    next(error);
  }
};
