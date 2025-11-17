import express, { Router } from 'express';
import {
  getAllAttendees,
  getAttendeeById,
  getAttendeesByEventId,
  createAttendee,
  updateAttendee,
  deleteAttendee
} from '../controllers/attendeeController';

const router: Router = express.Router();

/**
 * @swagger
 * /api/v1/attendees:
 *   get:
 *     summary: Get all attendees
 *     tags: [Attendees]
 *     description: Retrieve a list of all attendees
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
 *                     type: object
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
 *         description: Attendee found
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
 *         description: List of attendees for the event
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *     responses:
 *       201:
 *         description: Attendee created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/attendees', createAttendee);

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
 *     responses:
 *       200:
 *         description: Attendee updated successfully
 *       404:
 *         description: Attendee not found
 */
router.put('/attendees/:id', updateAttendee);

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
router.delete('/attendees/:id', deleteAttendee);

export default router;
