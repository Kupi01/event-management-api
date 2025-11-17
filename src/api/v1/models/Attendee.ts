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
