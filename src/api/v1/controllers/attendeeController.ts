import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as attendeeService from '../services/attendeeService';
import { Attendee } from '../models/Attendee';

/**
 * Retrieves all attendees with optional filtering and sorting
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllAttendees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId, status, sortBy, order } = req.query;

    const queryParams: attendeeService.AttendeeQueryParams = {
      eventId: eventId as string | undefined,
      status: status as 'registered' | 'attended' | 'cancelled' | undefined,
      sortBy: sortBy as 'name' | 'registrationDate' | undefined,
      order: order as 'asc' | 'desc' | undefined
    };

    const attendees: Attendee[] = await attendeeService.getAllAttendees(queryParams);
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Attendees retrieved successfully', 
      data: attendees,
      count: attendees.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific attendee by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAttendeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const attendee: Attendee | undefined = await attendeeService.getAttendeeById(id);

    if (!attendee) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Attendee with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Attendee retrieved successfully', 
      data: attendee 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all attendees for a specific event
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAttendeesByEventId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId } = req.params;
    const attendees: Attendee[] = await attendeeService.getAttendeesByEventId(eventId);

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: `Attendees for event ${eventId} retrieved successfully`, 
      data: attendees,
      count: attendees.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new attendee (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createAttendee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newAttendee: Attendee = await attendeeService.createAttendee(req.body);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Attendee created successfully', 
      data: newAttendee 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing attendee (already validated by middleware)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateAttendee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedAttendee: Attendee | undefined = await attendeeService.updateAttendee(id, req.body);

    if (!updatedAttendee) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Attendee with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Attendee updated successfully', 
      data: updatedAttendee 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an attendee by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteAttendee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted: boolean = await attendeeService.deleteAttendee(id);

    if (!deleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Attendee with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Attendee deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};
