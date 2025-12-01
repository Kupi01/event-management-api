import cron from 'node-cron';
import { getAllEvents, updateEvent } from './eventService';
import { getAllAttendees, updateAttendee } from './attendeeService';

/**
 * Updates the status of events based on their date
 * Events that have passed are marked as 'completed'
 */
const updateEventStatus = async (): Promise<void> => {
  const events = await getAllEvents();
  const now = new Date();
  let updatedCount = 0;

  for (const event of events) {
    const eventDate = new Date(event.date);
    
    // Mark past events as completed
    if (eventDate < now && event.status !== 'completed') {
      await updateEvent(event.id, { status: 'completed' });
      updatedCount++;
      console.log(`[Scheduler] Event "${event.name}" marked as completed`);
    }
  }

  if (updatedCount === 0) {
    console.log('[Scheduler] No event status updates needed');
  } else {
    console.log(`[Scheduler] Updated ${updatedCount} event(s) to completed status`);
  }
};

/**
 * Automatically marks attendees as 'attended' for events that occurred yesterday
 * Only affects attendees with 'registered' status
 */
const autoMarkAttendance = async (): Promise<void> => {
  const events = await getAllEvents();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalUpdated = 0;

  for (const event of events) {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    // Check if event occurred yesterday
    if (eventDate.getTime() === yesterday.getTime()) {
      const attendees = await getAllAttendees({ eventId: event.id, status: 'registered' });
      
      for (const attendee of attendees) {
        await updateAttendee(attendee.id, { status: 'attended' });
        totalUpdated++;
        console.log(`[Scheduler] Marked attendee "${attendee.name}" as attended for event "${event.name}"`);
      }
    }
  }

  if (totalUpdated === 0) {
    console.log('[Scheduler] No attendance updates needed');
  } else {
    console.log(`[Scheduler] Auto-marked ${totalUpdated} attendee(s) as attended`);
  }
};

/**
 * Sends reminder notifications for upcoming events (within 24 hours)
 * Logs events that need reminders sent to attendees
 */
const sendEventReminders = async (): Promise<void> => {
  const events = await getAllEvents({ status: 'upcoming' });
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let reminderCount = 0;

  for (const event of events) {
    const eventDate = new Date(event.date);
    
    // Check if event is within the next 24 hours
    if (eventDate > now && eventDate <= tomorrow) {
      const attendees = await getAllAttendees({ eventId: event.id, status: 'registered' });
      
      if (attendees.length > 0) {
        console.log(`[Scheduler] Reminder: Event "${event.name}" starting soon (${eventDate.toISOString()})`);
        console.log(`[Scheduler] - ${attendees.length} attendee(s) to notify`);
        
        // In production, you would send actual emails/notifications here
        for (const attendee of attendees) {
          console.log(`[Scheduler]   - Sending reminder to ${attendee.email}`);
        }
        
        reminderCount++;
      }
    }
  }

  if (reminderCount === 0) {
    console.log('[Scheduler] No upcoming events requiring reminders');
  } else {
    console.log(`[Scheduler] Sent reminders for ${reminderCount} upcoming event(s)`);
  }
};

/**
 * Cleans up cancelled attendees for completed events
 * Removes attendees with 'cancelled' status from events that ended more than 30 days ago
 */
const cleanupOldCancelledAttendees = async (): Promise<void> => {
  const events = await getAllEvents({ status: 'completed' });
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let cleanedCount = 0;

  for (const event of events) {
    const eventDate = new Date(event.date);
    
    // Check if event completed more than 30 days ago
    if (eventDate < thirtyDaysAgo) {
      const cancelledAttendees = await getAllAttendees({ eventId: event.id, status: 'cancelled' });
      
      for (const attendee of cancelledAttendees) {
        // In production, you would delete from repository
        console.log(`[Scheduler] Would cleanup cancelled attendee "${attendee.name}" from old event "${event.name}"`);
        cleanedCount++;
      }
    }
  }

  if (cleanedCount === 0) {
    console.log('[Scheduler] No old cancelled attendees to cleanup');
  } else {
    console.log(`[Scheduler] Identified ${cleanedCount} old cancelled attendee(s) for cleanup`);
  }
};

/**
 * Generates daily event summary report
 * Logs statistics about events and attendees
 */
const generateDailySummary = async (): Promise<void> => {
  const allEvents = await getAllEvents();
  const upcomingEvents = await getAllEvents({ status: 'upcoming' });
  const ongoingEvents = await getAllEvents({ status: 'ongoing' });
  const completedEvents = await getAllEvents({ status: 'completed' });
  const allAttendees = await getAllAttendees();

  console.log('[Scheduler] ===== Daily Event Summary =====');
  console.log(`[Scheduler] Total Events: ${allEvents.length}`);
  console.log(`[Scheduler] - Upcoming: ${upcomingEvents.length}`);
  console.log(`[Scheduler] - Ongoing: ${ongoingEvents.length}`);
  console.log(`[Scheduler] - Completed: ${completedEvents.length}`);
  console.log(`[Scheduler] Total Attendees: ${allAttendees.length}`);
  console.log('[Scheduler] ================================');
};

/**
 * Initializes all scheduled tasks
 */
export const startScheduler = (): void => {
  console.log('[Scheduler] Starting scheduled tasks...');

  // 1. Update event status every minute
  cron.schedule('* * * * *', () => {
    console.log('[Scheduler] Running event status update...');
    updateEventStatus().catch(error => {
      console.error('[Scheduler] Error updating event status:', error);
    });
  });

  // 2. Auto-mark attendance daily at 2:00 AM
  cron.schedule('0 2 * * *', () => {
    console.log('[Scheduler] Running auto-attendance marking...');
    autoMarkAttendance().catch(error => {
      console.error('[Scheduler] Error marking attendance:', error);
    });
  });

  // 3. Send event reminders daily at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('[Scheduler] Running event reminder notifications...');
    sendEventReminders().catch(error => {
      console.error('[Scheduler] Error sending reminders:', error);
    });
  });

  // 4. Cleanup old cancelled attendees weekly on Sundays at 3:00 AM
  cron.schedule('0 3 * * 0', () => {
    console.log('[Scheduler] Running cleanup of old cancelled attendees...');
    cleanupOldCancelledAttendees().catch(error => {
      console.error('[Scheduler] Error during cleanup:', error);
    });
  });

  // 5. Generate daily summary report at 11:59 PM
  cron.schedule('59 23 * * *', () => {
    console.log('[Scheduler] Generating daily summary report...');
    generateDailySummary().catch(error => {
      console.error('[Scheduler] Error generating summary:', error);
    });
  });

  console.log('[Scheduler] All scheduled tasks initialized');
  console.log('[Scheduler] - Event status update: Every minute');
  console.log('[Scheduler] - Auto-mark attendance: Daily at 2:00 AM');
  console.log('[Scheduler] - Event reminders: Daily at 9:00 AM');
  console.log('[Scheduler] - Cleanup cancelled attendees: Sundays at 3:00 AM');
  console.log('[Scheduler] - Daily summary report: Daily at 11:59 PM');
};
