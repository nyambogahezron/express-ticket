import React, { useState } from 'react';
import { Seat } from '../../types';
import { Info } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';

interface SeatSelectionProps {
  seats: Seat[];
  maxSelectableSeats?: number;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ 
  seats, 
  maxSelectableSeats = 8 
}) => {
  const { selectedSeats, selectSeat, deselectSeat } = useBooking();
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  // Get unique seat categories
  const categories = Array.from(new Set(seats.map(seat => seat.category)));

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      deselectSeat(seat.id);
    } else {
      if (selectedSeats.length >= maxSelectableSeats) {
        alert(`You can select a maximum of ${maxSelectableSeats} seats.`);
        return;
      }
      selectSeat(seat);
    }
  };

  const getSeatStatus = (seat: Seat): 'available' | 'selected' | 'booked' => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      return 'selected';
    }
    return seat.status === 'available' ? 'available' : 'booked';
  };

  return (
    <div className="mt-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-6 justify-center">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary-500 rounded mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
          <span className="text-sm">Booked</span>
        </div>
        {categories.map(category => (
          <div key={category} className="flex items-center">
            <div className="w-2 h-6 rounded-sm mr-2" style={{
              backgroundColor: 
                category === 'VIP' ? '#FFD700' : 
                category === 'Premium' ? '#10B981' :
                category === 'Standard' ? '#3B82F6' : '#9CA3AF'
            }}></div>
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>

      {/* Stage */}
      <div className="w-3/4 mx-auto h-8 bg-gray-800 text-white text-center text-sm flex items-center justify-center rounded-t-lg mb-10">
        STAGE
      </div>

      {/* Seat map */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-max">
          {sortedRows.map(row => (
            <div key={row} className="flex justify-center mb-2">
              <div className="flex items-center mr-2">
                <span className="text-sm font-semibold w-6 text-center">{row}</span>
              </div>
              <div className="flex space-x-1">
                {seatsByRow[row].map(seat => {
                  const status = getSeatStatus(seat);
                  const categoryColor = 
                    seat.category === 'VIP' ? 'border-yellow-400' : 
                    seat.category === 'Premium' ? 'border-green-500' :
                    seat.category === 'Standard' ? 'border-blue-500' : 'border-gray-500';
                  
                  return (
                    <div 
                      key={seat.id}
                      className={`
                        relative w-7 h-7 flex items-center justify-center 
                        rounded cursor-pointer transition-all duration-150
                        border-l-2 ${categoryColor}
                        ${status === 'available' ? 'bg-gray-200 hover:bg-gray-300' : ''}
                        ${status === 'selected' ? 'bg-primary-500 text-white scale-110' : ''}
                        ${status === 'booked' ? 'bg-gray-400 cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeat(seat)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      <span className="text-xs">{seat.number}</span>
                      
                      {/* Tooltip on hover */}
                      {hoveredSeat?.id === seat.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                          {seat.row}{seat.number} - {seat.category} (${seat.price})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info message */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>Selecting the best seats:</strong> You can select up to {maxSelectableSeats} seats. Seats in the same 
          row provide the best viewing experience. VIP and Premium seats include additional amenities.
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;