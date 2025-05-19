import { Event, EventCategory, Seat } from '../types';

// Mock Events
export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift - The Eras Tour',
    description: 'Experience the musical journey through Taylor Swift\'s incredible career, featuring songs from all her studio albums.',
    venue: 'SoFi Stadium',
    address: '1001 Stadium Dr',
    city: 'Los Angeles',
    date: '2025-04-15',
    time: '19:30',
    category: 'concert',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 120,
    maxPrice: 450,
    featured: true,
  },
  {
    id: '2',
    title: 'Lakers vs. Warriors',
    description: 'An exciting NBA matchup between the Los Angeles Lakers and the Golden State Warriors.',
    venue: 'Crypto.com Arena',
    address: '1111 S Figueroa St',
    city: 'Los Angeles',
    date: '2025-04-22',
    time: '20:00',
    category: 'sports',
    imageUrl: 'https://images.pexels.com/photos/974506/pexels-photo-974506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 85,
    maxPrice: 350,
    featured: true,
  },
  {
    id: '3',
    title: 'Hamilton',
    description: 'The Tony Award-winning musical about Alexander Hamilton, featuring a score that blends hip-hop, jazz, R&B, and Broadway.',
    venue: 'Pantages Theatre',
    address: '6233 Hollywood Blvd',
    city: 'Los Angeles',
    date: '2025-05-10',
    time: '19:00',
    category: 'theater',
    imageUrl: 'https://images.pexels.com/photos/925683/pexels-photo-925683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 95,
    maxPrice: 295,
    featured: true,
  },
  {
    id: '4',
    title: 'Dave Chappelle Live',
    description: 'Stand-up comedy from the legendary comedian Dave Chappelle.',
    venue: 'The Forum',
    address: '3900 W Manchester Blvd',
    city: 'Inglewood',
    date: '2025-04-30',
    time: '21:00',
    category: 'comedy',
    imageUrl: 'https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 75,
    maxPrice: 250,
    featured: false,
  },
  {
    id: '5',
    title: 'Tech Innovation Summit 2025',
    description: 'Join industry leaders for discussions on AI, blockchain, and the future of technology.',
    venue: 'Los Angeles Convention Center',
    address: '1201 S Figueroa St',
    city: 'Los Angeles',
    date: '2025-06-05',
    time: '09:00',
    category: 'conference',
    imageUrl: 'https://images.pexels.com/photos/2773508/pexels-photo-2773508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 199,
    maxPrice: 599,
    featured: false,
  },
  {
    id: '6',
    title: 'Modern Art Exhibition',
    description: 'A showcase of contemporary art from around the world, featuring installations, paintings, and digital art.',
    venue: 'The Broad',
    address: '221 S Grand Ave',
    city: 'Los Angeles',
    date: '2025-05-20',
    time: '10:00',
    category: 'exhibition',
    imageUrl: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    minPrice: 25,
    maxPrice: 25,
    featured: false,
  },
];

// Mock Categories with Icons
export const CATEGORIES = [
  { id: 'concert', name: 'Concerts', icon: 'music' },
  { id: 'sports', name: 'Sports', icon: 'trophy' },
  { id: 'theater', name: 'Theater', icon: 'ticket' },
  { id: 'comedy', name: 'Comedy', icon: 'smile' },
  { id: 'conference', name: 'Conferences', icon: 'users' },
  { id: 'exhibition', name: 'Exhibitions', icon: 'image' },
  { id: 'other', name: 'Other', icon: 'calendar' },
];

// Generate mock seats for an event
export const generateSeatsForEvent = (eventId: string): Seat[] => {
  const seats: Seat[] = [];
  const categories = {
    VIP: { price: 200 },
    Premium: { price: 150 },
    Standard: { price: 100 },
    Budget: { price: 50 },
  };

  // Generate seats for each category
  Object.entries(categories).forEach(([category, { price }]) => {
    const rows = category === 'VIP' ? ['A', 'B'] : 
                 category === 'Premium' ? ['C', 'D', 'E'] :
                 category === 'Standard' ? ['F', 'G', 'H', 'I'] : ['J', 'K', 'L'];
    
    rows.forEach(row => {
      for (let num = 1; num <= 20; num++) {
        const seatNumber = num.toString().padStart(2, '0');
        const randomStatus = Math.random() > 0.3 ? 'available' : 'booked';
        
        seats.push({
          id: `${row}${seatNumber}`,
          row,
          number: seatNumber,
          category,
          price,
          status: randomStatus,
        });
      }
    });
  });

  return seats;
};

// Mock Cities
export const CITIES = [
  'Los Angeles', 
  'New York', 
  'Chicago', 
  'Miami', 
  'Las Vegas', 
  'San Francisco',
  'Austin',
  'Nashville',
  'Seattle',
  'Boston'
];

// Helper function to filter events
export const filterEvents = (events: Event[], filters: Record<string, any>): Event[] => {
  return events.filter(event => {
    // Filter by search query
    if (filters.query && !event.title.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.category && event.category !== filters.category) {
      return false;
    }
    
    // Filter by city
    if (filters.city && event.city !== filters.city) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom && new Date(event.date) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(event.date) > new Date(filters.dateTo)) {
      return false;
    }
    
    // Filter by price range
    if (filters.priceMin && event.minPrice < filters.priceMin) {
      return false;
    }
    
    if (filters.priceMax && event.maxPrice > filters.priceMax) {
      return false;
    }
    
    return true;
  });
};