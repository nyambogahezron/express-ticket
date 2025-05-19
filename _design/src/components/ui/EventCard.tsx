import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const formattedDate = format(parseISO(`${event.date}T${event.time}`), 'MMM d, yyyy · h:mm a');
  
  // Basic card for list views
  if (!featured) {
    return (
      <Link to={`/events/${event.id}`} className="group">
        <div className="card overflow-hidden h-full transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-medium px-2 py-1 m-2 rounded">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
            
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue}, {event.city}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-primary-600 font-semibold">
                ${event.minPrice}{event.minPrice !== event.maxPrice && ` - $${event.maxPrice}`}
              </div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                View Details →
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Featured card with larger display
  return (
    <Link to={`/events/${event.id}`} className="group">
      <div className="card overflow-hidden h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="sm:flex">
          <div className="relative sm:w-2/5 h-64 sm:h-auto overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-medium px-3 py-1.5 m-3 rounded-full">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
          </div>
          
          <div className="p-6 sm:w-3/5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-xl sm:text-2xl mb-3">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.venue}, {event.city}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm">
                <Tag className="h-4 w-4 mr-2" />
                <span className="capitalize">{event.category}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-primary-600 font-semibold text-lg">
                ${event.minPrice}{event.minPrice !== event.maxPrice && ` - $${event.maxPrice}`}
              </div>
              <div className="btn-primary">
                Get Tickets
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;