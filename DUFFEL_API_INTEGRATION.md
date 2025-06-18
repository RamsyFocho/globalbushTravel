# Duffel API Integration

## Overview

The flight search functionality is fully integrated with the Duffel API using the correct format and endpoints.

## API Flow

1. **Frontend** → User submits flight search form
2. **Client-side** → `flightService.searchFlights()` calls `/api/flights/search`
3. **API Route** → `/api/flights/search` calls `flightService.searchFlightsDirect()`
4. **Server-side** → Sends request to Duffel API `/air/offer_requests`

## Correct JSON Format

The system sends the following JSON format to Duffel's `/air/offer_requests` endpoint:

```json
{
  "data": {
    "slices": [
      {
        "origin": "JFK",
        "destination": "LAX", 
        "departure_date": "2025-07-15"
      }
    ],
    "passengers": [
      {"type": "adult"}
    ],
    "cabin_class": "economy"
  }
}
```

### For Round-trip flights:
```json
{
  "data": {
    "slices": [
      {
        "origin": "JFK",
        "destination": "LAX",
        "departure_date": "2025-07-15"
      },
      {
        "origin": "LAX", 
        "destination": "JFK",
        "departure_date": "2025-07-22"
      }
    ],
    "passengers": [
      {"type": "adult"}
    ],
    "cabin_class": "economy"
  }
}
```

## Supported Cabin Classes

- `economy` - Economy Class
- `premium_economy` - Premium Economy Class  
- `business` - Business Class
- `first` - First Class

## API Endpoints Used

1. **POST** `/air/offer_requests` - Create offer request
2. **GET** `/air/offers?offer_request_id={id}` - Poll for offers
3. **GET** `/places/suggestions` - Location search (for autocomplete)

## Environment Variables Required

```env
DUFFEL_API_KEY=your_duffel_api_key_here
DUFFEL_API_URL=https://api.duffel.com
```

## Testing

You can test the integration by visiting:
- `/api/test-duffel` - Tests the Duffel API integration
- `/flights` - Full flight search page
- Home page flight search form

## Error Handling

- If Duffel API fails, falls back to mock data
- Proper error logging and user feedback
- Graceful degradation for missing environment variables

## Implementation Files

- `lib/api/flight-service.ts` - Main service with Duffel API integration
- `app/api/flights/search/route.ts` - API route handler
- `components/flight-search-form.tsx` - Search form with cabin class selection
- `components/enhanced-flight-search-results.tsx` - Results display
- `app/flights/page.tsx` - Flights page with search functionality 