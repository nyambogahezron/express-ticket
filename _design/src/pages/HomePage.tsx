import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ChevronsDown, Calendar, Music, Users, Ticket, Trophy, Image, Smile } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { EVENTS, CATEGORIES, CITIES } from '../data/mockData';
import EventCard from '../components/ui/EventCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Featured events (first 3)
  const featuredEvents = EVENTS.filter(event => event.featured).slice(0, 3);
  
  // Upcoming events (all but sorted by date)
  const upcomingEvents = [...EVENTS]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchTerm) queryParams.append('query', searchTerm);
    if (selectedCity) queryParams.append('city', selectedCity);
    if (selectedDate) queryParams.append('dateFrom', selectedDate);
    
    navigate({
      pathname: '/events',
      search: queryParams.toString()
    });
  };

  // Setup dates for date selector
  const dateOptions = [
    { value: '', label: 'Any Date' },
    { value: format(new Date(), 'yyyy-MM-dd'), label: 'Today' },
    { value: format(addDays(new Date(), 1), 'yyyy-MM-dd'), label: 'Tomorrow' },
    { value: format(addDays(new Date(), 7), 'yyyy-MM-dd'), label: 'This Week' },
    { value: format(addDays(new Date(), 30), 'yyyy-MM-dd'), label: 'This Month' },
  ];

  // Scroll animation for "scroll down" button
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Concert crowd" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find and Book <span className="text-accent-500">Amazing Events</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Discover concerts, sports, theater, comedy, and more. Your perfect experience is just a click away.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events, artists, teams..."
                    className="w-full bg-white px-4 py-3 pl-10 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:w-1/4">
                <select 
                  className="w-full bg-white px-4 py-3 rounded-md appearance-none"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Any Location</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-1/4">
                <select 
                  className="w-full bg-white px-4 py-3 rounded-md appearance-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <button 
                type="submit" 
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-md transition-colors font-medium flex items-center justify-center"
              >
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
          
          {/* Scroll Down Button */}
          <button
            onClick={scrollToContent}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white opacity-80 hover:opacity-100 transition-opacity animate-bounce"
          >
            <span className="text-sm mb-1">Scroll Down</span>
            <ChevronsDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse By Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map(category => {
              let Icon;
              switch (category.icon) {
                case 'music': Icon = Music; break;
                case 'trophy': Icon = Trophy; break;
                case 'ticket': Icon = Ticket; break;
                case 'smile': Icon = Smile; break;
                case 'users': Icon = Users; break;
                case 'image': Icon = Image; break;
                default: Icon = Calendar;
              }
              
              return (
                <Link 
                  key={category.id} 
                  to={`/events?category=${category.id}`}
                  className="flex flex-col items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center font-medium">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Link to="/events" className="text-primary-600 font-medium flex items-center mt-4 md:mt-0">
              View All Events
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-8">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} featured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Upcoming Events</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/events" className="btn-primary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                quote: "TicketR made booking tickets for the Taylor Swift concert so easy. The seat selection tool is fantastic!",
                avatar: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=100",
                rating: 5
              },
              {
                name: "Michael Chen",
                quote: "I've been using TicketR for all my sporting events. The user interface is clean and the checkout process is seamless.",
                avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
                rating: 5
              },
              {
                name: "Jessica Patel",
                quote: "I love how I can quickly find events happening in my city. TicketR has become my go-to platform for all events.",
                avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Next Event?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event-goers who have found their perfect experience through TicketR.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 font-medium">
              Browse Events
            </Link>
            <Link to="/signup" className="btn bg-accent-500 text-white hover:bg-accent-600 px-8 py-3 font-medium">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;