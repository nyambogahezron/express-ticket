import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EVENTS, filterEvents } from '../data/mockData';
import EventCard from '../components/ui/EventCard';
import SearchFiltersComponent from '../components/ui/SearchFilters';
import { SearchFilters } from '../types';

const EventsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredEvents, setFilteredEvents] = useState(EVENTS);
  
  // Initialize filters from URL search params
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (searchParams.get('query')) {
      initialFilters.query = searchParams.get('query') || undefined;
    }
    
    if (searchParams.get('category')) {
      initialFilters.category = searchParams.get('category') as any || undefined;
    }
    
    if (searchParams.get('city')) {
      initialFilters.city = searchParams.get('city') || undefined;
    }
    
    if (searchParams.get('dateFrom')) {
      initialFilters.dateFrom = searchParams.get('dateFrom') || undefined;
    }
    
    if (searchParams.get('dateTo')) {
      initialFilters.dateTo = searchParams.get('dateTo') || undefined;
    }
    
    if (searchParams.get('priceMin')) {
      initialFilters.priceMin = Number(searchParams.get('priceMin')) || undefined;
    }
    
    if (searchParams.get('priceMax')) {
      initialFilters.priceMax = Number(searchParams.get('priceMax')) || undefined;
    }
    
    setFilters(initialFilters);
    applyFilters(initialFilters);
  }, [searchParams]);

  // Apply filters to events
  const applyFilters = (filterValues: SearchFilters) => {
    const filtered = filterEvents(EVENTS, filterValues);
    setFilteredEvents(filtered);
  };

  return (
    <div className="pt-16">
      {/* Page Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
          <p className="text-primary-100">Find the perfect event for any occasion</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <SearchFiltersComponent 
          onApplyFilters={(newFilters) => {
            setFilters(newFilters);
            applyFilters(newFilters);
          }} 
        />
        
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
          </h2>
        </div>
        
        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria to find more events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;