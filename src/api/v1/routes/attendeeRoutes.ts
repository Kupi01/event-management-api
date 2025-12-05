import express, { Router } from 'express';
import {
  getAllAttendees,
  getAttendeeById,
  getAttendeesByEventId,
  createAttendee,
  updateAttendee,
  deleteAttendee
} from '../controllers/attendeeController';
import { validateRequest } from '../middleware/validateRequest';
import { createAttendeeSchema, updateAttendeeSchema } from '../validations/attendeeSchema';
import authenticate from '../middleware/authenticate';
import isAuthorized from '../middleware/authorize';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendees
 *   description: Attendee management endpoints
 */

/**
 * @swagger
 * /api/v1/attendees:
 *   get:
 *     summary: Get all attendees
 *     tags: [Attendees]
 *     description: Retrieve a list of all attendees with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filter by event ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [registered, attended, cancelled]
 *         description: Filter by attendee status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, registrationDate]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of attendees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendee'
 *                 count:
 *                   type: number
 */
router.get('/attendees', getAllAttendees);

/**
 * @swagger
 * /api/v1/attendees/{id}:
 *   get:
 *     summary: Get attendee by ID
 *     tags: [Attendees]
 *     description: Retrieve a specific attendee by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendee ID
 *     responses:
 *       200:
 *         description: Attendee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       404:
 *         description: Attendee not found
 */
router.get('/attendees/:id', getAttendeeById);

/**
 * @swagger
 * /api/v1/events/{eventId}/attendees:
 *   get:
 *     summary: Get attendees by event ID
 *     tags: [Attendees]
 *     description: Retrieve all attendees for a specific event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of attendees for the event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendee'
 *                 count:
 *                   type: number
 */
router.get('/events/:eventId/attendees', getAttendeesByEventId);

/**
 * @swagger
 * /api/v1/attendees:
 *   post:
 *     summary: Create a new attendee
 *     tags: [Attendees]
 *     description: Register a new attendee for an event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - name
 *               - email
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: event-123456
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 pattern: ^\+?[1-9]\d{1,14}$
 *                 example: +12345678901
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *                 default: registered
 *     responses:
 *       201:
 *         description: Attendee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Attendee'
 *       400:
 *         description: Validation error
 */
router.post('/attendees', authenticate, validateRequest(createAttendeeSchema), createAttendee);

/**
 * @swagger
 * /api/v1/attendees/{id}:
 *   put:
 *     summary: Update an attendee
 *     tags: [Attendees]
 *     description: Update an existing attendee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *     responses:
 *       200:
 *         description: Attendee updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Attendee not found
 */
router.put('/attendees/:id', authenticate, isAuthorized({ hasRole: ['admin', 'organizer'], allowSameUser: true }), validateRequest(updateAttendeeSchema), updateAttendee);

/**
 * @swagger
 * /api/v1/attendees/{id}:
 *   delete:
 *     summary: Delete an attendee
 *     tags: [Attendees]
 *     description: Delete an attendee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendee ID
 *     responses:
 *       200:
 *         description: Attendee deleted successfully
 *       404:
 *         description: Attendee not found
 */
router.delete('/attendees/:id', authenticate, isAuthorized({ hasRole: ['admin'] }), deleteAttendee);

export default router;
