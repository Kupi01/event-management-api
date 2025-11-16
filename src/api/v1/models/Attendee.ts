export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: Date;
  status: 'registered' | 'attended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAttendeeRequest {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  status?: 'registered' | 'attended' | 'cancelled';
}

export interface UpdateAttendeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'registered' | 'attended' | 'cancelled';
}
