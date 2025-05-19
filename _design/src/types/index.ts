export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

export type EventCategory = 
  | 'concert' 
  | 'sports' 
  | 'theater' 
  | 'comedy' 
  | 'conference' 
  | 'exhibition' 
  | 'other';

export type Event = {
  id: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  city: string;
  date: string; // ISO date string
  time: string;
  category: EventCategory;
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
  featured: boolean;
};

export type SeatCategory = {
  id: string;
  name: string;
  price: number;
  available: number;
};

export type Seat = {
  id: string;
  row: string;
  number: string;
  category: string;
  price: number;
  status: 'available' | 'reserved' | 'booked';
};

export type Booking = {
  id: string;
  userId: string;
  eventId: string;
  seats: Seat[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingDate: string; // ISO date string
  ticketId?: string;
};

export type SearchFilters = {
  query?: string;
  category?: EventCategory;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
};