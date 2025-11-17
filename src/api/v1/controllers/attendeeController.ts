import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import * as attendeeService from '../services/attendeeService';
import { Attendee } from '../models/Attendee';

/**
 * Retrieves all attendees
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllAttendees = (req: Request, res: Response): void => {
  try {
    const attendees: Attendee[] = attendeeService.getAllAttendees();
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Get all attendees', 
      data: attendees,
      count: attendees.length
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve attendees'
    });
  }
};

/**
 * Retrieves a specific attendee by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAttendeeById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const attendee: Attendee | undefined = attendeeService.getAttendeeById(id);

    if (!attendee) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        message: `Attendee with id ${id} not found` 
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Attendee found', 
      data: attendee 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve attendee'
    });
  }
};

/**
 * Retrieves all attendees for a specific event
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAttendeesByEventId = (req: Request, res: Response): void => {
  try {
    const { eventId } = req.params;
    const attendees: Attendee[] = attendeeService.getAttendeesByEventId(eventId);

    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: `Get all attendees for event ${eventId}`, 
      data: attendees,
      count: attendees.length
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve attendees'
    });
  }
};

/**
 * Creates a new attendee after basic validation
 * @param req - Express request object
 * @param res - Express response object
 */
export const createAttendee = (req: Request, res: Response): void => {
  try {
    const { eventId, name, email, phone, status } = req.body;

    // Basic validation
    if (!eventId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Event ID is required'
      });
      return;
    }

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Attendee name is required'
      });
      return;
    }

    if (!email) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const attendeeData: {
      eventId: string;
      name: string;
      email: string;
      phone?: string;
      status?: 'registered' | 'attended' | 'cancelled';
    } = {
      eventId,
      name,
      email,
      phone,
      status
    };

    const newAttendee: Attendee = attendeeService.createAttendee(attendeeData);
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: 'Attendee created successfully', 
      data: newAttendee 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create attendee'
    });
  }
};

/**
 * Updates an existing attendee
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateAttendee = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;

    const updateData: {
      name?: string;
      email?: string;
      phone?: string;
      status?: 'registered' | 'attended' | 'cancelled';
    } = {
      name,
      email,
      phone,
      status
    };

    const updatedAttendee: Attendee | undefined = attendeeService.updateAttendee(id, updateData);

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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update attendee'
    });
  }
};

/**
 * Deletes an attendee by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteAttendee = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted: boolean = attendeeService.deleteAttendee(id);

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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete attendee'
    });
  }
};
