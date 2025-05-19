import React, { createContext, useState, useContext } from 'react';
import { Booking, Event, Seat } from '../types';
import { useAuth } from './AuthContext';

interface BookingContextType {
  selectedEvent: Event | null;
  selectedSeats: Seat[];
  bookings: Booking[];
  setSelectedEvent: (event: Event | null) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  createBooking: () => Promise<Booking>;
  getBookingById: (id: string) => Booking | undefined;
  cancelBooking: (id: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Sample bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: '1',
    eventId: '1',
    seats: [
      { id: 'A1', row: 'A', number: '1', category: 'VIP', price: 150, status: 'booked' },
      { id: 'A2', row: 'A', number: '2', category: 'VIP', price: 150, status: 'booked' },
    ],
    totalAmount: 300,
    status: 'confirmed',
    paymentStatus: 'completed',
    bookingDate: '2023-06-15T14:30:00Z',
    ticketId: 'TKT-12345',
  },
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const selectSeat = (seat: Seat) => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      return;
    }
    setSelectedSeats([...selectedSeats, { ...seat, status: 'reserved' }]);
  };

  const deselectSeat = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter(seat => seat.id !== seatId));
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const createBooking = async (): Promise<Booking> => {
    if (!selectedEvent || selectedSeats.length === 0 || !user) {
      throw new Error('Cannot create booking without event, seats, or user');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      userId: user.id,
      eventId: selectedEvent.id,
      seats: selectedSeats.map(seat => ({ ...seat, status: 'booked' })),
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'completed',
      bookingDate: new Date().toISOString(),
      ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setBookings([...bookings, newBooking]);
    clearSelectedSeats();
    setSelectedEvent(null);
    
    return newBooking;
  };

  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  const cancelBooking = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBookings(
      bookings.map(booking => 
        booking.id === id
          ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' }
          : booking
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        selectedEvent,
        selectedSeats,
        bookings,
        setSelectedEvent,
        selectSeat,
        deselectSeat,
        clearSelectedSeats,
        createBooking,
        getBookingById,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};