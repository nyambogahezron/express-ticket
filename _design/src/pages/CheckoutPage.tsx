import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, ShoppingCart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useBooking } from '../contexts/BookingContext';
import CheckoutForm from '../components/payment/CheckoutForm';
import BookingConfirmation from '../components/payment/BookingConfirmation';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedEvent, selectedSeats, getBookingById } = useBooking();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Handle no selected event or seats
  if (!selectedEvent || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Booking in Progress</h2>
        <p className="mb-6">It seems you haven't selected an event or seats yet.</p>
        <button 
          onClick={() => navigate('/events')}
          className="btn-primary"
        >
          Browse Events
        </button>
      </div>
    );
  }

  const eventDate = parseISO(`${selectedEvent.date}T${selectedEvent.time}`);
  const formattedDate = format(eventDate, 'EEE, MMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  const handlePaymentComplete = (newBookingId: string) => {
    setBookingId(newBookingId);
    setBookingComplete(true);
  };

  // If booking is complete, show confirmation
  if (bookingComplete && bookingId) {
    const booking = getBookingById(bookingId);
    if (!booking) {
      return <div>Error: Booking not found</div>;
    }
    return <BookingConfirmation booking={booking} event={selectedEvent} />;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Event
        </button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Checkout Form */}
          <div className="md:w-2/3">
            <CheckoutForm onPaymentComplete={handlePaymentComplete} />
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="font-semibold flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary-600" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{selectedEvent.title}</h3>
                  
                  <div className="text-sm text-gray-600 flex items-start mb-1">
                    <Calendar className="h-4 w-4 mr-1 mt-0.5" />
                    <span>{formattedDate} at {formattedTime}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                    <span>{selectedEvent.venue}, {selectedEvent.city}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="text-sm font-medium mb-2">Selected Seats ({selectedSeats.length})</div>
                  
                  <div className="max-h-48 overflow-y-auto text-sm">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between mb-1.5 last:mb-0">
                        <span>
                          Seat {seat.row}{seat.number} ({seat.category})
                        </span>
                        <span>${seat.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Service Fee (12%)</span>
                    <span>${(selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>${(selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 1.12).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;