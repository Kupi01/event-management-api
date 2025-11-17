import cron from 'node-cron';
import { getAllEvents, updateEvent } from '../api/v1/services/eventService';
import { Event } from '../api/v1/models/Event';

/**
 * Updates the status of events based on their date
 * Events that have passed are marked as 'completed'
 */
const updateEventStatus = () => {
  const events = getAllEvents();
  const now = new Date();
  let updatedCount = 0;

  events.forEach((event: Event) => {
    const eventDate = new Date(event.date);
    
    // Mark past events as completed
    if (eventDate < now && event.status !== 'completed') {
      updateEvent(event.id, { status: 'completed' });
      updatedCount++;
      console.log(`[Scheduler] Event "${event.name}" marked as completed`);
    }
  });

  if (updatedCount === 0) {
    console.log('[Scheduler] No event status updates needed');
  } else {
    console.log(`[Scheduler] Updated ${updatedCount} event(s) to completed status`);
  }
};

/**
 * Initializes all scheduled tasks
 */
export const startScheduler = () => {
  console.log('[Scheduler] Starting scheduled tasks...');

  // Update event status every minute
  cron.schedule('* * * * *', () => {
    console.log('[Scheduler] Running event status update...');
    updateEventStatus();
  });

  console.log('[Scheduler] Scheduled task initialized');
  console.log('[Scheduler] - Event status update: Every minute');
};
