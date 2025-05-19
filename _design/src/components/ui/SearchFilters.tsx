import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Tag, DollarSign, X } from 'lucide-react';
import { CATEGORIES, CITIES } from '../../data/mockData';
import { SearchFilters } from '../../types';

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ onApplyFilters }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    if (value === '' || value === null) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleSearch = () => {
    onApplyFilters({ ...filters, query: searchQuery });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onApplyFilters({});
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search for events, venues, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* Filter Toggle Button */}
        <button
          onClick={toggleFilters}
          className={`btn-secondary flex items-center px-4 ${isFiltersOpen ? 'bg-primary-50 border-primary-300 text-primary-700' : ''}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
        
        {/* Search Button */}
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
      </div>
      
      {/* Expanded Filters */}
      {isFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="label flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Category
              </label>
              <select
                id="category"
                className="input"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || null)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* City Filter */}
            <div>
              <label htmlFor="city" className="label flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </label>
              <select
                id="city"
                className="input"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || null)}
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Range */}
            <div>
              <label htmlFor="dateFrom" className="label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  id="dateFrom"
                  className="input"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  placeholder="From"
                />
                <input
                  type="date"
                  id="dateTo"
                  className="input"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <label htmlFor="priceMin" className="label flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="priceMin"
                  className="input"
                  placeholder="Min"
                  min="0"
                  value={filters.priceMin || ''}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : null)}
                />
                <input
                  type="number"
                  id="priceMax"
                  className="input"
                  placeholder="Max"
                  min="0"
                  value={filters.priceMax || ''}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
          
          {/* Filter Actions */}
          <div className="flex justify-end mt-4">
            <button onClick={clearFilters} className="btn-secondary mr-2 flex items-center">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
            <button onClick={handleSearch} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFiltersComponent;