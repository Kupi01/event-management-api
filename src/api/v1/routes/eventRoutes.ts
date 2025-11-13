import { Router, Request, Response } from 'express';
import { EventController } from '../controllers/eventController';

const router = Router();
const eventController = new EventController();

// GET all events
router.get('/', async (req: Request, res: Response) => {
  await eventController.getAllEvents(req, res);
});

// GET event by ID
router.get('/:id', async (req: Request, res: Response) => {
  await eventController.getEventById(req, res);
});

// POST create event
router.post('/', async (req: Request, res: Response) => {
  await eventController.createEvent(req, res);
});

// PUT update event
router.put('/:id', async (req: Request, res: Response) => {
  await eventController.updateEvent(req, res);
});

// DELETE event
router.delete('/:id', async (req: Request, res: Response) => {
  await eventController.deleteEvent(req, res);
});

export default router;
