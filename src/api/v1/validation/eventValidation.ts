export class EventValidation {
  static validateCreateEvent(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Event name is required and must be a non-empty string');
    }

    if (!data.date || typeof data.date !== 'string') {
      errors.push('Event date is required and must be a string');
    }

    if (!data.location || typeof data.location !== 'string' || data.location.trim() === '') {
      errors.push('Event location is required and must be a non-empty string');
    }

    if (data.capacity !== undefined && typeof data.capacity !== 'number') {
      errors.push('Event capacity must be a number');
    }

    if (data.capacity !== undefined && data.capacity < 0) {
      errors.push('Event capacity cannot be negative');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateUpdateEvent(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Event name must be a non-empty string');
      }
    }

    if (data.date !== undefined) {
      if (typeof data.date !== 'string') {
        errors.push('Event date must be a string');
      }
    }

    if (data.location !== undefined) {
      if (typeof data.location !== 'string' || data.location.trim() === '') {
        errors.push('Event location must be a non-empty string');
      }
    }

    if (data.capacity !== undefined) {
      if (typeof data.capacity !== 'number') {
        errors.push('Event capacity must be a number');
      } else if (data.capacity < 0) {
        errors.push('Event capacity cannot be negative');
      }
    }

    if (data.status !== undefined) {
      const validStatuses = ['upcoming', 'ongoing', 'completed'];
      if (!validStatuses.includes(data.status)) {
        errors.push('Event status must be one of: upcoming, ongoing, completed');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
