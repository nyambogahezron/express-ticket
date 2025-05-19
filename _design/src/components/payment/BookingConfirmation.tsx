import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Ticket, Download, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Booking, Event } from '../../types';

interface BookingConfirmationProps {
  booking: Booking;
  event: Event;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, event }) => {
  const formattedDate = format(parseISO(`${event.date}T${event.time}`), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(parseISO(`${event.date}T${event.time}`), 'h:mm a');
  
  return (
    <div className="max-w-2xl mx-auto animate-scale-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-1">
          Your tickets have been reserved and your payment has been processed successfully.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
        <div className="bg-primary-600 text-white p-4">
          <h3 className="text-lg font-semibold">Booking Details</h3>
          <p className="text-sm opacity-90">Booking Reference: {booking.id}</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              <h4 className="font-bold text-xl mb-2">{event.title}</h4>
              
              <div className="flex items-start text-gray-600 mb-2">
                <Calendar className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>
              
              <div className="flex items-start text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{event.venue}</div>
                  <div>{event.address}, {event.city}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <Ticket className="h-5 w-5 mr-2 flex-shrink-0" />
                <div className="font-medium">{booking.seats.length} Tickets</div>
              </div>
              
              <div className="font-medium">
                Ticket ID: {booking.ticketId}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-lg mb-3">Your Seats</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {booking.seats.map(seat => (
                <div key={seat.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Seat {seat.row}{seat.number}</span>
                    <span className="text-primary-600 font-semibold">${seat.price}</span>
                  </div>
                  <div className="text-sm text-gray-600">{seat.category}</div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
              <span className="font-semibold">Total Amount Paid:</span>
              <span className="font-semibold text-primary-600">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="btn-primary flex-1 flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
              Download E-Tickets
            </button>
            <button className="btn-secondary flex-1 flex items-center justify-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share Booking
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Link to="/bookings" className="btn-secondary">
          View All Bookings
        </Link>
        <Link to="/events" className="btn-primary">
          Browse More Events
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;