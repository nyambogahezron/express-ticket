import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Booking, Event } from '../../types';

interface BookingListProps {
  bookings: Booking[];
  events: Event[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings, events }) => {
  // Helper function to get event by ID
  const getEventById = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  );

  if (sortedBookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring events!</p>
        <Link to="/events" className="btn-primary">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedBookings.map(booking => {
        const event = getEventById(booking.eventId);
        if (!event) return null;

        const eventDate = parseISO(`${event.date}T${event.time}`);
        const formattedDate = format(eventDate, 'EEE, MMM d, yyyy');
        const formattedTime = format(eventDate, 'h:mm a');
        const isPast = new Date() > eventDate;
        
        // Status styles
        let statusColor;
        let statusIcon;
        
        if (booking.status === 'confirmed') {
          statusColor = 'text-green-600 bg-green-50 border-green-200';
          statusIcon = <CheckCircle className="h-4 w-4" />;
        } else if (booking.status === 'cancelled') {
          statusColor = 'text-red-600 bg-red-50 border-red-200';
          statusIcon = <XCircle className="h-4 w-4" />;
        } else {
          statusColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
          statusIcon = <Calendar className="h-4 w-4" />;
        }

        return (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Event Image */}
              <div className="sm:w-1/4 h-40 sm:h-auto">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Booking Details */}
              <div className="p-5 sm:w-3/4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg mb-2">
                      {event.title}
                    </h3>
                    <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${statusColor}`}>
                      {statusIcon}
                      <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{formattedDate} at {formattedTime}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                  </div>
                  
                  <div className="mt-1 text-sm">
                    <span className="text-gray-600">{booking.seats.length} tickets</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">Total: ${booking.totalAmount.toFixed(2)}</span>
                    {booking.ticketId && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-gray-700">Ticket ID: {booking.ticketId}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  {booking.status === 'confirmed' && !isPast && (
                    <Link 
                      to={`/bookings/${booking.id}`}
                      className="btn-primary flex items-center text-sm"
                    >
                      View Tickets
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                  
                  {booking.status === 'confirmed' && isPast && (
                    <Link 
                      to={`/review/${event.id}`}
                      className="btn-secondary flex items-center text-sm"
                    >
                      Leave Review
                    </Link>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <span className="text-sm text-red-600">
                      {booking.paymentStatus === 'refunded' ? 'Refunded' : 'Cancellation Processed'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;