# GlobalBush Travel - System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Flight Module](#flight-module)
4. [Hotel Module](#hotel-module)
5. [Location Services](#location-services)
6. [API Routes](#api-routes)
7. [Data Flow](#data-flow)
8. [Environment Configuration](#environment-configuration)
9. [Development Guidelines](#development-guidelines)
10. [Recent Updates](#recent-updates)

## Overview

GlobalBush Travel is a Next.js 14 application that provides flight and hotel booking services with real-time integration to external APIs (Duffel for flights). The system follows a modular architecture with clear separation of concerns.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks
- **API Integration**: Duffel API (flights), Mock data (hotels)
- **Deployment**: Vercel-ready

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   External APIs │
│   Components    │◄──►│   (Next.js)     │◄──►│   (Duffel, etc) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Services      │    │   Utilities     │    │   Environment   │
│   (Business     │    │   (Helpers,     │    │   Variables     │
│    Logic)       │    │    Sorting)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Flight Module

### Core Components

#### 1. Flight Service (`lib/api/flight-service.ts`)
**Purpose**: Central business logic for all flight-related operations

**Key Methods**:
```typescript
// Main flight search
async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]>

// Direct Duffel API integration
async searchFlightsDirect(params: FlightSearchParams): Promise<FlightOffer[]>

// Location search
async searchLocations(query: string): Promise<LocationSuggestion[]>

// Upcoming flights from user location
async getUpcomingFlightsFromLocation(userLocation: string): Promise<FlightOffer[]>
```

**Data Flow**:
1. Receives search parameters
2. Constructs Duffel API request with proper headers
3. Sends POST to `/air/offer_requests`
4. Polls for offers using offer request ID
5. Transforms Duffel response to internal format
6. Returns FlightOffer[] array

**Code Reference - Key Implementation**:
```typescript
// File: lib/api/flight-service.ts
export class FlightService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.DUFFEL_API_KEY || ''
    this.apiUrl = process.env.DUFFEL_API_URL || 'https://api.duffel.com'
  }

  async searchFlightsDirect(params: FlightSearchParams): Promise<FlightOffer[]> {
    const requestBody = {
      data: {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate
          }
        ],
        passengers: Array(params.passengers).fill({ type: 'adult' }),
        cabin_class: params.cabinClass || 'economy'
      }
    }

    // Add return flight for round trips
    if (params.returnDate) {
      requestBody.data.slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate
      })
    }

    const response = await fetch(`${this.apiUrl}/air/offer_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1'
      },
      body: JSON.stringify(requestBody)
    })

    // Poll for offers and transform response
    // ... implementation details
  }
}
```

#### 2. Flight Search Form (`components/flight-search-form.tsx`)
**Purpose**: User interface for flight search input

**Features**:
- Origin/destination autocomplete
- Date selection (departure/return)
- Passenger count selection
- Cabin class selection
- Trip type selection (one-way, round-trip, multi-city)

**Code Reference**:
```typescript
// File: components/flight-search-form.tsx
interface FlightSearchFormProps {
  onSearch?: (params: any) => void
  initialValues?: any
  className?: string
}

export function FlightSearchForm({ onSearch, initialValues, className }: FlightSearchFormProps) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy',
    tripType: 'round-trip'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(formData)
  }

  // Component implementation with form fields
}
```

#### 3. Enhanced Flight Search Results (`components/enhanced-flight-search-results.tsx`)
**Purpose**: Displays flight search results with filtering and sorting

**Features**:
- Real-time flight data display
- Price, duration, stops filtering
- Airline filtering
- Sorting options
- Responsive design

**Data Flow**:
1. Receives search parameters from parent
2. Calls `flightService.searchFlights()`
3. Transforms FlightOffer to Flight interface
4. Applies filters and sorting
5. Renders flight cards

**Code Reference**:
```typescript
// File: components/enhanced-flight-search-results.tsx
interface EnhancedFlightSearchResultsProps {
  searchParams: FlightSearchParams | null
  className?: string
}

export function EnhancedFlightSearchResults({ searchParams, className }: EnhancedFlightSearchResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    maxPrice: 1000,
    maxStops: 2,
    airlines: [] as string[]
  })

  useEffect(() => {
    if (searchParams) {
      searchFlights(searchParams)
    }
  }, [searchParams])

  const searchFlights = async (params: FlightSearchParams) => {
    setLoading(true)
    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      const data = await response.json()
      setFlights(data.flights || [])
    } catch (error) {
      console.error('Flight search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtering and sorting logic
  const filteredFlights = flights.filter(flight => {
    return flight.price <= filters.maxPrice &&
           flight.stops <= filters.maxStops &&
           (filters.airlines.length === 0 || filters.airlines.includes(flight.airline))
  })

  // Component render with flight cards
}
```

#### 4. Upcoming Flights (`components/upcoming-flights.tsx`)
**Purpose**: Shows upcoming flights from user's location when no search is performed

**Features**:
- Location-based flight suggestions
- Popular destinations
- Sortable results
- Real Duffel API integration

**Code Reference**:
```typescript
// File: components/upcoming-flights.tsx
interface UpcomingFlightsProps {
  userLocation?: string
  className?: string
}

export function UpcomingFlights({ userLocation, className }: UpcomingFlightsProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price')

  useEffect(() => {
    if (userLocation) {
      fetchUpcomingFlights(userLocation)
    }
  }, [userLocation])

  const fetchUpcomingFlights = async (location: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/flights/upcoming?location=${location}`)
      const data = await response.json()
      setFlights(data.flights || [])
    } catch (error) {
      console.error('Error fetching upcoming flights:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sorting logic
  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price - b.price
      case 'duration': return a.duration.localeCompare(b.duration)
      case 'departure': return new Date(a.departure.date).getTime() - new Date(b.departure.date).getTime()
      default: return 0
    }
  })

  // Component render
}
```

#### 5. Flights Page (`app/flights/page.tsx`)
**Purpose**: Main flights page that orchestrates all flight-related components

**Features**:
- Location detection
- Search form integration
- Results display
- Upcoming flights fallback

**Code Reference**:
```typescript
// File: app/flights/page.tsx
export default function FlightsPage() {
  const [userLocation, setUserLocation] = useState<string>('')
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    detectUserLocation()
  }, [])

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const nearestAirport = await getNearestAirport(latitude, longitude)
          setUserLocation(nearestAirport)
        },
        () => {
          setUserLocation('DLA') // Fallback to Douala
        }
      )
    } else {
      setUserLocation('DLA')
    }
  }

  const handleSearch = (params: FlightSearchParams) => {
    setSearchParams(params)
    setHasSearched(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FlightSearchForm onSearch={handleSearch} />
      
      {hasSearched && searchParams ? (
        <EnhancedFlightSearchResults searchParams={searchParams} />
      ) : (
        <UpcomingFlights userLocation={userLocation} />
      )}
    </div>
  )
}
```

### API Routes

#### 1. Flight Search (`app/api/flights/search/route.ts`)
**Endpoint**: `POST /api/flights/search`

**Purpose**: Handles flight search requests from frontend

**Request Format**:
```json
{
  "origin": "JFK",
  "destination": "LAX",
  "departureDate": "2025-07-15",
  "returnDate": "2025-07-22",
  "passengers": 1,
  "cabinClass": "economy"
}
```

**Response Format**:
```json
{
  "flights": [
    {
      "id": "off_0000AvFvljvCKvEHglSUQo",
      "airline": "American Airlines",
      "flightNumber": "4",
      "departure": {
        "time": "10:50",
        "airport": "JFK",
        "city": "New York",
        "date": "2025-07-15"
      },
      "arrival": {
        "time": "13:42",
        "airport": "LAX",
        "city": "Los Angeles",
        "date": "2025-07-15"
      },
      "duration": "PT5H52M",
      "stops": 0,
      "price": 227.28,
      "currency": "USD"
    }
  ]
}
```

**Code Reference**:
```typescript
// File: app/api/flights/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { FlightService } from '@/lib/api/flight-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const flightService = new FlightService()
    
    const flights = await flightService.searchFlightsDirect(body)
    
    return NextResponse.json({ flights })
  } catch (error) {
    console.error('Flight search error:', error)
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    )
  }
}
```

#### 2. Upcoming Flights (`app/api/flights/upcoming/route.ts`)
**Endpoint**: `GET /api/flights/upcoming?location=JFK`

**Purpose**: Returns upcoming flights from a specific location

**Response Format**:
```json
{
  "flights": [...],
  "location": "JFK",
  "count": 20
}
```

**Code Reference**:
```typescript
// File: app/api/flights/upcoming/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { FlightService } from '@/lib/api/flight-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'JFK'
    
    const flightService = new FlightService()
    const flights = await flightService.getUpcomingFlightsFromLocation(location)
    
    return NextResponse.json({
      flights,
      location,
      count: flights.length
    })
  } catch (error) {
    console.error('Upcoming flights error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming flights' },
      { status: 500 }
    )
  }
}
```

#### 3. Location Search (`app/api/locations/search/route.ts`)
**Endpoint**: `GET /api/locations/search?q=New York`

**Purpose**: Provides location autocomplete functionality

**Response Format**:
```json
{
  "locations": [
    {
      "id": "1",
      "type": "airport",
      "iata_code": "JFK",
      "name": "John F. Kennedy International Airport",
      "city_name": "New York",
      "country_name": "United States",
      "display_name": "New York (JFK) - John F. Kennedy International Airport, United States"
    }
  ]
}
```

**Code Reference**:
```typescript
// File: app/api/locations/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { FlightService } from '@/lib/api/flight-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    if (!query) {
      return NextResponse.json({ locations: [] })
    }
    
    const flightService = new FlightService()
    const locations = await flightService.searchLocations(query)
    
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Location search error:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}
```

### Data Models

#### FlightOffer Interface
```typescript
interface FlightOffer {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    city: string
    date: string
  }
  arrival: {
    time: string
    airport: string
    city: string
    date: string
  }
  duration: string
  stops: number
  stopDetails?: string
  price: number
  currency: string
  amenities: string[]
  baggage: string
  class: string
}
```

#### FlightSearchParams Interface
```typescript
interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: string
}
```

#### Flight Interface (Frontend)
```typescript
interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    city: string
    date: string
  }
  arrival: {
    time: string
    airport: string
    city: string
    date: string
  }
  duration: string
  stops: number
  price: number
  currency: string
}
```

## Hotel Module

### Core Components

#### 1. Hotel Service (`lib/api/hotel-service.ts`)
**Purpose**: Business logic for hotel-related operations

**Key Methods**:
```typescript
async searchHotels(params: HotelSearchParams): Promise<HotelOffer[]>
async getHotelDetails(hotelId: string): Promise<HotelOffer | null>
```

**Code Reference**:
```typescript
// File: lib/api/hotel-service.ts
export class HotelService {
  async searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
    // Mock implementation - replace with real hotel API
    return mockHotels.filter(hotel => 
      hotel.location.toLowerCase().includes(params.location.toLowerCase())
    )
  }
}
```

#### 2. Hotel Search Form (`components/hotel-search-form.tsx`)
**Purpose**: User interface for hotel search

**Features**:
- Location input
- Check-in/check-out dates
- Guest count
- Room count
- Amenities filtering

#### 3. Hotel Search Results (`components/hotel-search-results.tsx`)
**Purpose**: Displays hotel search results

### API Routes

#### Hotel Search (`app/api/hotels/search/route.ts`)
**Endpoint**: `POST /api/hotels/search`

**Request Format**:
```json
{
  "location": "New York",
  "checkIn": "2025-07-15",
  "checkOut": "2025-07-22",
  "guests": 2,
  "rooms": 1
}
```

## Location Services

### Components

#### 1. Location Autocomplete (`components/location-autocomplete.tsx`)
**Purpose**: Provides location search with autocomplete

**Features**:
- Real-time search suggestions
- Airport and city support
- IATA code display
- Keyboard navigation

**Code Reference**:
```typescript
// File: components/location-autocomplete.tsx
interface LocationAutocompleteProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string, location?: LocationSuggestion) => void
}

export function LocationAutocomplete({ id, label, placeholder, value, onChange }: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSuggestions(data.locations || [])
    } catch (error) {
      console.error('Location search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Component render with suggestions dropdown
}
```

### Data Models

#### LocationSuggestion Interface
```typescript
interface LocationSuggestion {
  id: string
  type: "airport" | "city"
  iata_code: string
  name: string
  city_name: string
  country_name: string
  country_code: string
  display_name: string
}
```

## API Routes

### Complete API Structure

```
/api/
├── flights/
│   ├── search/          # POST - Flight search
│   └── upcoming/        # GET - Upcoming flights
├── hotels/
│   └── search/          # POST - Hotel search
├── locations/
│   └── search/          # GET - Location autocomplete
├── test-duffel/         # GET - Duffel API test
├── test-duffel-direct/  # GET - Direct Duffel test
├── test-duffel-complete/# GET - Complete flow test
├── test-duffel-debug/   # GET - Debug test
├── test-flight-service/ # GET - Flight service test
├── test-origin-destination/ # GET - Origin/destination test
└── test-env/            # GET - Environment test
```

### Test Routes Purpose

- **test-duffel**: Basic Duffel API connectivity test
- **test-duffel-direct**: Direct API call test without service layer
- **test-duffel-complete**: Complete flight search flow test
- **test-duffel-debug**: Detailed debugging with logging
- **test-flight-service**: Flight service method testing
- **test-origin-destination**: Origin/destination order validation
- **test-env**: Environment variables verification

## Data Flow

### Flight Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as FlightSearchForm
    participant P as FlightsPage
    participant A as API Route
    participant S as FlightService
    participant D as Duffel API

    U->>F: Enter search criteria
    F->>P: handleSearch(params)
    P->>A: POST /api/flights/search
    A->>S: searchFlightsDirect(params)
    S->>D: POST /air/offer_requests
    D-->>S: Offer request ID
    S->>D: GET /air/offers?offer_request_id=xxx
    D-->>S: Flight offers
    S-->>A: Transformed FlightOffer[]
    A-->>P: JSON response
    P->>F: Update UI with results
```

### Location Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant L as LocationAutocomplete
    participant A as API Route
    participant S as FlightService
    participant D as Duffel API

    U->>L: Type location
    L->>A: GET /api/locations/search?q=query
    A->>S: searchLocationsDirect(query)
    S->>D: GET /places/suggestions?query=query
    D-->>S: Location suggestions
    S-->>A: Transformed LocationSuggestion[]
    A-->>L: JSON response
    L->>U: Display suggestions
```

### Upcoming Flights Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as FlightsPage
    participant G as Geolocation
    participant A as API Route
    participant S as FlightService
    participant D as Duffel API

    U->>P: Visit /flights (no search)
    P->>G: getCurrentPosition()
    G-->>P: Coordinates
    P->>P: getNearestAirport(coords)
    P->>A: GET /api/flights/upcoming?location=DLA
    A->>S: getUpcomingFlightsFromLocation(DLA)
    S->>D: Multiple flight searches
    D-->>S: Flight offers
    S-->>A: Combined results
    A-->>P: JSON response
    P->>U: Display upcoming flights
```

## Environment Configuration

### Required Environment Variables

```env
# Duffel API Configuration
DUFFEL_API_KEY=your_duffel_api_key_here
DUFFEL_API_URL=https://api.duffel.com

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Setup

1. Create `.env.local` file in project root
2. Add required environment variables
3. Restart development server
4. Test API connectivity using `/api/test-env`

## Development Guidelines

### Adding New Features

1. **Create Service Layer**: Add business logic to appropriate service file
2. **Create API Route**: Add new route in `app/api/` directory
3. **Create Component**: Add UI component in `components/` directory
4. **Update Documentation**: Modify this file to reflect changes
5. **Add Tests**: Create test routes for debugging

### Code Organization

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── flights/           # Flight pages
│   ├── hotels/            # Hotel pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── lib/                   # Utilities and services
│   ├── api/              # API services
│   ├── utils/            # Helper functions
│   └── seo/              # SEO utilities
├── hooks/                 # Custom React hooks
├── styles/                # Global styles
└── public/                # Static assets
```

### Testing Strategy

1. **API Testing**: Use test routes in `/api/test-*`
2. **Component Testing**: Test individual components
3. **Integration Testing**: Test complete user flows
4. **Error Handling**: Test fallback scenarios

### Error Handling

- **API Failures**: Fallback to mock data
- **Network Issues**: Retry with exponential backoff
- **Invalid Input**: Client-side validation
- **Missing Data**: Graceful degradation

### Performance Considerations

- **Caching**: Implement caching for location data
- **Pagination**: Add pagination for large result sets
- **Lazy Loading**: Load components on demand
- **Optimization**: Use React.memo for expensive components

## Recent Updates

### Latest Changes (Current Version - December 2024)

1. **Updated Fallback Location**
   - Changed default fallback location from JFK to DLA (Douala)
   - Updated location detection to use Douala when geolocation fails
   - Added DLA to popular destinations and mock locations
   - Updated city mapping to include Douala and other African cities

2. **Added Upcoming Flights Feature**
   - Location detection with geolocation API
   - Real Duffel API integration for popular destinations
   - Sortable results by price, duration, and departure time
   - Fallback to DLA when location detection fails

3. **Enhanced Origin/Destination Order**
   - Proper data validation in flight service
   - Consistent display order in search results
   - API response verification with test routes
   - Filtering out flights that don't match requested direction

4. **Improved Error Handling**
   - Better fallback mechanisms for API failures
   - Detailed error logging for debugging
   - User-friendly error messages
   - Graceful degradation when services are unavailable

5. **Enhanced Flight Service**
   - Complete Duffel API v1 integration
   - Proper request/response transformation
   - Polling mechanism for offer requests
   - Support for round-trip and one-way flights

### Files Modified in Latest Update

- `app/flights/page.tsx` - Updated fallback location from JFK to DLA
- `app/api/flights/upcoming/route.ts` - Updated comment to reflect DLA as default
- `lib/api/flight-service.ts` - Added DLA to popular destinations, mock locations, and city mapping
- `SYSTEM_ARCHITECTURE.md` - Updated documentation to reflect DLA as fallback location

### Key Features Implemented

1. **Location Detection**: Automatic detection of user's location using browser geolocation
2. **Upcoming Flights**: Real-time flight suggestions from user's location to popular destinations
3. **Search Integration**: Seamless integration between search form and results display
4. **Data Validation**: Proper validation of origin/destination order and data consistency
5. **Error Recovery**: Robust error handling with fallback mechanisms

### Technical Improvements

1. **API Integration**: Complete Duffel API integration with proper headers and JSON format
2. **Data Transformation**: Efficient transformation between Duffel and internal data formats
3. **State Management**: Proper React state management for search parameters and results
4. **Performance**: Optimized API calls and component rendering
5. **Debugging**: Comprehensive test routes for troubleshooting

---

**Last Updated**: December 2024
**Version**: 1.1.0
**Maintainer**: Development Team

---

*This documentation should be updated whenever new features are added or existing components are modified to ensure all developers understand the current system structure. Each update should include detailed code references and implementation details.*
