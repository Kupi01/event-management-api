export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  date: string;
  location: string;
  capacity?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  date?: string;
  location?: string;
  capacity?: number;
  status?: 'upcoming' | 'ongoing' | 'completed';
}
