import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, Users, ArrowLeft, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { EVENTS, generateSeatsForEvent } from '../data/mockData';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import SeatSelection from '../components/ui/SeatSelection';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedSeats, setSelectedEvent, clearSelectedSeats } = useBooking();
  
  const [event, setEvent] = useState(EVENTS.find(e => e.id === eventId));
  const [seats, setSeats] = useState(generateSeatsForEvent(eventId || ''));
  const [activeTab, setActiveTab] = useState<'details' | 'seats'>('details');
  
  // Clear selected seats when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedSeats();
    };
  }, [clearSelectedSeats]);
  
  // Set selected event for the booking context
  useEffect(() => {
    if (event) {
      setSelectedEvent(event);
    }
  }, [event, setSelectedEvent]);

  // Handle event not found
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/events')}
          className="btn-primary"
        >
          Browse Events
        </button>
      </div>
    );
  }

  const eventDate = parseISO(`${event.date}T${event.time}`);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/events/${eventId}` } });
      return;
    }
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="pt-16">
      {/* Event Header */}
      <div 
        className="bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${event.imageUrl})` 
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <button 
            onClick={() => navigate(-1)}
            className="text-white mb-6 flex items-center hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between">
            <div>
              <div className="text-accent-400 text-sm font-medium mb-2 uppercase tracking-wider">
                {event.category}
              </div>
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-y-2 text-gray-300 mb-4">
                <div className="flex items-center mr-6">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{formattedTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.venue}, {event.city}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 text-white">
              <div className="text-lg">Tickets from</div>
              <div className="text-3xl font-bold">${event.minPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-3 px-4 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Event Details
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm ${
                  activeTab === 'seats'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('seats')}
              >
                Select Seats
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'details' ? (
              <div className="animate-fade-in">
                {/* Event Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                      Date and Time
                    </h3>
                    <div className="text-gray-700">
                      <div>{formattedDate}</div>
                      <div>{formattedTime}</div>
                      <div className="text-sm text-gray-500 mt-1">Doors open 1 hour before showtime</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                      Location
                    </h3>
                    <div className="text-gray-700">
                      <div>{event.venue}</div>
                      <div>{event.address}</div>
                      <div>{event.city}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-primary-600" />
                      Category
                    </h3>
                    <div className="text-gray-700 capitalize">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary-600" />
                      Price Range
                    </h3>
                    <div className="text-gray-700">
                      ${event.minPrice.toFixed(2)} - ${event.maxPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Venue Map - Placeholder */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Venue Location</h2>
                  <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    Interactive Map Would Go Here
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Select Your Seats</h2>
                  <p className="text-gray-600">
                    Click on the available seats below to select them for purchase.
                  </p>
                </div>
                
                <SeatSelection seats={seats} />
              </div>
            )}
          </div>
          
          {/* Right Column - Booking Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              {selectedSeats.length > 0 ? (
                <div>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Selected Seats:</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>
                    
                    <div className="text-sm max-h-40 overflow-y-auto space-y-2">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between">
                          <span>
                            Seat {seat.row}{seat.number} ({seat.category})
                          </span>
                          <span>${seat.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Total:</span>
                    <span className="text-primary-600">
                      ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleProceedToCheckout}
                    className="btn-primary w-full py-3"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center py-6 bg-gray-50 rounded-md mb-4">
                    <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No seats selected yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose your seats from the seating chart
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('seats')}
                    className="btn-secondary w-full mb-3"
                  >
                    Select Seats
                  </button>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                * All purchases are subject to our Terms of Service and are final. 
                A 12% service fee will be added during checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;