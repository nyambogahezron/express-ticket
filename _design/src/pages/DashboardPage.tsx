import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, Settings, LogOut, Bookmark, CreditCard, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { EVENTS } from '../data/mockData';
import BookingList from '../components/dashboard/BookingList';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState('bookings');
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">You need to log in</h2>
        <p className="mb-6">Please log in to view your dashboard.</p>
        <Link to="/login" className="btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  // Get upcoming bookings (non-cancelled and in the future)
  const upcomingBookings = bookings.filter(booking => {
    if (booking.status === 'cancelled') return false;
    
    const event = EVENTS.find(e => e.id === booking.eventId);
    if (!event) return false;
    
    const eventDate = new Date(`${event.date}T${event.time}`);
    return eventDate > new Date();
  });

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-semibold mr-3">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-2">
                <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700">
                  Edit Profile
                </Link>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 font-medium">
                Menu
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'bookings' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Ticket className="h-5 w-5 mr-2" />
                  My Bookings
                </button>
                
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'upcoming' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </button>
                
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'saved' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className="h-5 w-5 mr-2" />
                  Saved Events
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'payment' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </button>
                
                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'support' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Help & Support
                </button>
                
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-md flex items-center text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
                <BookingList bookings={bookings} events={EVENTS} />
              </div>
            )}
            
            {activeTab === 'upcoming' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
                {upcomingBookings.length > 0 ? (
                  <BookingList bookings={upcomingBookings} events={EVENTS} />
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
                    <p className="text-gray-600 mb-6">You don't have any upcoming events scheduled.</p>
                    <Link to="/events" className="btn-primary">
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Saved Events</h2>
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Events</h3>
                  <p className="text-gray-600 mb-6">You haven't saved any events yet.</p>
                  <Link to="/events" className="btn-primary">
                    Browse Events
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-center text-gray-600 py-8">
                    You don't have any payment methods saved yet.
                  </p>
                  <div className="text-center">
                    <button className="btn-primary">
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="font-medium mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name</label>
                        <input type="text" className="input" defaultValue={user.name} />
                      </div>
                      <div>
                        <label className="label">Email Address</label>
                        <input type="email" className="input" defaultValue={user.email} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Current Password</label>
                        <input type="password" className="input" />
                      </div>
                      <div />
                      <div>
                        <label className="label">New Password</label>
                        <input type="password" className="input" />
                      </div>
                      <div>
                        <label className="label">Confirm New Password</label>
                        <input type="password" className="input" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'support' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                    <div className="space-y-4 mt-4">
                      <div className="border-b border-gray-200 pb-4">
                        <h4 className="font-medium mb-2">How do I cancel a booking?</h4>
                        <p className="text-gray-600">
                          You can cancel a booking by going to My Bookings, selecting the booking you want to cancel, 
                          and clicking the "Cancel Booking" button. Please note that some events may have specific 
                          cancellation policies.
                        </p>
                      </div>
                      <div className="border-b border-gray-200 pb-4">
                        <h4 className="font-medium mb-2">How do I download my e-tickets?</h4>
                        <p className="text-gray-600">
                          You can download your e-tickets by going to My Bookings, selecting the booking, and clicking the 
                          "Download E-Tickets" button. E-tickets are also sent to your email address.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Can I transfer my tickets to someone else?</h4>
                        <p className="text-gray-600">
                          Yes, you can transfer your tickets by using the "Share Booking" option in the booking details page. 
                          The recipient will receive a link to access the tickets.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Contact Support</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 text-blue-800">
                      Our support team is available Monday to Friday, 9 AM to 5 PM PST.
                    </div>
                    <form>
                      <div className="mb-4">
                        <label className="label">Subject</label>
                        <input type="text" className="input" placeholder="How can we help you?" />
                      </div>
                      <div className="mb-4">
                        <label className="label">Message</label>
                        <textarea 
                          className="input min-h-[120px]" 
                          placeholder="Please describe your issue in detail"
                        ></textarea>
                      </div>
                      <button type="submit" className="btn-primary">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;