// Flight service for Duffel API integration
export interface FlightOffer {
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

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass?: string
}

export interface Airport {
  id: string
  iata_code: string
  name: string
  city: {
    name: string
    iata_code?: string
  }
  country: {
    name: string
    iso_code: string
  }
  time_zone: string
}

export interface LocationSuggestion {
  id: string
  type: "airport" | "city"
  iata_code: string
  name: string
  city_name: string
  country_name: string
  country_code: string
  display_name: string
}

class FlightService {
  private baseUrl = "https://api.duffel.com"
  private apiKey = process.env.DUFFEL_API_KEY || "***REMOVED***"

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2",
      Accept: "application/json",
    }
  }

  // Client-side method that calls our API route
  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) return [];
  
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
  
      if (!response.ok) {
        console.error('Location search failed:', response.status, response.statusText);
        return this.getMockLocations(query);
      }
  
      const json = await response.json();
      return json.locations ?? [];
    } catch (err) {
      console.error('Location search error:', err);
      return this.getMockLocations(query);
    }
  }
  

  // Server-side method for direct Duffel API calls
  async searchLocationsDirect(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) {
      return []
    }

    try {
      // Use the places/suggestions endpoint for better location search
      const url = `${this.baseUrl}/places/suggestions?query=${encodeURIComponent(query)}`
      console.log("Calling Duffel places API:", url)

      const response = await fetch(url, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Duffel API error (${response.status}):`, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Duffel places API response:", data)

      if (data.data && data.data.length > 0) {
        return this.transformPlacesResponse(data.data.slice(0, 8))
      }

      // If no results from places API, try airports as fallback
      console.log("No results from places API, trying airports...")
      return await this.searchLocationsDirectFallback(query)
    } catch (error) {
      console.error("Duffel places search error:", error)
      // Try airports as fallback
      return await this.searchLocationsDirectFallback(query)
    }
  }

  private async searchLocationsDirectFallback(query: string): Promise<LocationSuggestion[]> {
    try {
      // Try multiple search approaches for better results
      const searchPromises = [
        // Search by name
        this.searchDuffelAirports(`name=${encodeURIComponent(query)}`),
        // Search by IATA code if query looks like one
        query.length === 3 ? this.searchDuffelAirports(`iata_code=${encodeURIComponent(query.toUpperCase())}`) : null,
        // Search by city name
        this.searchDuffelAirports(`city_name=${encodeURIComponent(query)}`),
      ].filter(Boolean)

      const results = await Promise.allSettled(searchPromises)

      // Combine all successful results
      const allAirports: Airport[] = []
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          allAirports.push(...result.value)
        }
      })

      // Remove duplicates based on IATA code
      const uniqueAirports = allAirports.filter(
        (airport, index, self) => index === self.findIndex((a) => a.iata_code === airport.iata_code),
      )

      if (uniqueAirports.length > 0) {
        return this.transformLocationResponse(uniqueAirports.slice(0, 8))
      }

      // If no results from API, return mock data
      console.log("No results from Duffel API, using mock data")
      return this.getMockLocations(query)
    } catch (error) {
      console.error("Duffel location search fallback error:", error)
      return this.getMockLocations(query)
    }
  }

  private async searchDuffelAirports(queryParam: string): Promise<Airport[]> {
    try {
      const url = `${this.baseUrl}/air/airports?${queryParam}&limit=10`
      console.log("Calling Duffel API:", url)

      const response = await fetch(url, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Duffel API error (${response.status}):`, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Duffel API response:", data)

      return data.data || []
    } catch (error) {
      console.error("Error calling Duffel airports API:", error)
      throw error
    }
  }

  private transformLocationResponse(airports: Airport[]): LocationSuggestion[] {
    return airports.map((airport) => ({
      id: airport.id,
      type: "airport" as const,
      iata_code: airport.iata_code,
      name: airport.name,
      city_name: airport.city.name,
      country_name: airport.country.name,
      country_code: airport.country.iso_code,
      display_name: `${airport.city.name} (${airport.iata_code}) - ${airport.name}, ${airport.country.name}`,
    }))
  }

  private transformPlacesResponse(places: any[]): LocationSuggestion[] {
    return places.map((place) => ({
      id: place.id,
      type: place.type || "airport",
      iata_code: place.iata_code || place.airport_iata_code || "",
      name: place.name || place.airport_name || "",
      city_name: place.city_name || place.city?.name || "",
      country_name: place.country_name || place.country?.name || "",
      country_code: place.country_code || place.country?.iso_code || "",
      display_name: place.display_name || `${place.city_name || place.city?.name} (${place.iata_code || place.airport_iata_code}) - ${place.name || place.airport_name}, ${place.country_name || place.country?.name}`,
    }))
  }

  private getMockLocations(query: string): LocationSuggestion[] {
    const mockLocations: LocationSuggestion[] = [
      {
        id: "1",
        type: "airport",
        iata_code: "LOS",
        name: "Murtala Muhammed International Airport",
        city_name: "Lagos",
        country_name: "Nigeria",
        country_code: "NG",
        display_name: "Lagos (LOS) - Murtala Muhammed International Airport, Nigeria",
      },
      {
        id: "2",
        type: "airport",
        iata_code: "ABV",
        name: "Nnamdi Azikiwe International Airport",
        city_name: "Abuja",
        country_name: "Nigeria",
        country_code: "NG",
        display_name: "Abuja (ABV) - Nnamdi Azikiwe International Airport, Nigeria",
      },
      {
        id: "3",
        type: "airport",
        iata_code: "LHR",
        name: "Heathrow Airport",
        city_name: "London",
        country_name: "United Kingdom",
        country_code: "GB",
        display_name: "London (LHR) - Heathrow Airport, United Kingdom",
      },
      {
        id: "4",
        type: "airport",
        iata_code: "LGW",
        name: "Gatwick Airport",
        city_name: "London",
        country_name: "United Kingdom",
        country_code: "GB",
        display_name: "London (LGW) - Gatwick Airport, United Kingdom",
      },
      {
        id: "5",
        type: "airport",
        iata_code: "DXB",
        name: "Dubai International Airport",
        city_name: "Dubai",
        country_name: "United Arab Emirates",
        country_code: "AE",
        display_name: "Dubai (DXB) - Dubai International Airport, United Arab Emirates",
      },
      {
        id: "6",
        type: "airport",
        iata_code: "JFK",
        name: "John F. Kennedy International Airport",
        city_name: "New York",
        country_name: "United States",
        country_code: "US",
        display_name: "New York (JFK) - John F. Kennedy International Airport, United States",
      },
      {
        id: "7",
        type: "airport",
        iata_code: "LAX",
        name: "Los Angeles International Airport",
        city_name: "Los Angeles",
        country_name: "United States",
        country_code: "US",
        display_name: "Los Angeles (LAX) - Los Angeles International Airport, United States",
      },
      {
        id: "8",
        type: "airport",
        iata_code: "CDG",
        name: "Charles de Gaulle Airport",
        city_name: "Paris",
        country_name: "France",
        country_code: "FR",
        display_name: "Paris (CDG) - Charles de Gaulle Airport, France",
      },
      {
        id: "9",
        type: "airport",
        iata_code: "ORY",
        name: "Orly Airport",
        city_name: "Paris",
        country_name: "France",
        country_code: "FR",
        display_name: "Paris (ORY) - Orly Airport, France",
      },
      {
        id: "10",
        type: "airport",
        iata_code: "IST",
        name: "Istanbul Airport",
        city_name: "Istanbul",
        country_name: "Turkey",
        country_code: "TR",
        display_name: "Istanbul (IST) - Istanbul Airport, Turkey",
      },
      {
        id: "11",
        type: "airport",
        iata_code: "SAW",
        name: "Sabiha Gökçen International Airport",
        city_name: "Istanbul",
        country_name: "Turkey",
        country_code: "TR",
        display_name: "Istanbul (SAW) - Sabiha Gökçen International Airport, Turkey",
      },
      {
        id: "12",
        type: "airport",
        iata_code: "NRT",
        name: "Narita International Airport",
        city_name: "Tokyo",
        country_name: "Japan",
        country_code: "JP",
        display_name: "Tokyo (NRT) - Narita International Airport, Japan",
      },
      {
        id: "13",
        type: "airport",
        iata_code: "HND",
        name: "Haneda Airport",
        city_name: "Tokyo",
        country_name: "Japan",
        country_code: "JP",
        display_name: "Tokyo (HND) - Haneda Airport, Japan",
      },
      {
        id: "14",
        type: "airport",
        iata_code: "SYD",
        name: "Kingsford Smith Airport",
        city_name: "Sydney",
        country_name: "Australia",
        country_code: "AU",
        display_name: "Sydney (SYD) - Kingsford Smith Airport, Australia",
      },
      {
        id: "15",
        type: "airport",
        iata_code: "MEL",
        name: "Melbourne Airport",
        city_name: "Melbourne",
        country_name: "Australia",
        country_code: "AU",
        display_name: "Melbourne (MEL) - Melbourne Airport, Australia",
      },
      {
        id: "16",
        type: "airport",
        iata_code: "CAI",
        name: "Cairo International Airport",
        city_name: "Cairo",
        country_name: "Egypt",
        country_code: "EG",
        display_name: "Cairo (CAI) - Cairo International Airport, Egypt",
      },
      {
        id: "17",
        type: "airport",
        iata_code: "CPT",
        name: "Cape Town International Airport",
        city_name: "Cape Town",
        country_name: "South Africa",
        country_code: "ZA",
        display_name: "Cape Town (CPT) - Cape Town International Airport, South Africa",
      },
      {
        id: "18",
        type: "airport",
        iata_code: "JNB",
        name: "O.R. Tambo International Airport",
        city_name: "Johannesburg",
        country_name: "South Africa",
        country_code: "ZA",
        display_name: "Johannesburg (JNB) - O.R. Tambo International Airport, South Africa",
      },
      {
        id: "19",
        type: "airport",
        iata_code: "FCO",
        name: "Leonardo da Vinci International Airport",
        city_name: "Rome",
        country_name: "Italy",
        country_code: "IT",
        display_name: "Rome (FCO) - Leonardo da Vinci International Airport, Italy",
      },
      {
        id: "20",
        type: "airport",
        iata_code: "FRA",
        name: "Frankfurt Airport",
        city_name: "Frankfurt",
        country_name: "Germany",
        country_code: "DE",
        display_name: "Frankfurt (FRA) - Frankfurt Airport, Germany",
      },
      {
        id: "21",
        type: "airport",
        iata_code: "AMS",
        name: "Amsterdam Airport Schiphol",
        city_name: "Amsterdam",
        country_name: "Netherlands",
        country_code: "NL",
        display_name: "Amsterdam (AMS) - Amsterdam Airport Schiphol, Netherlands",
      },
      {
        id: "22",
        type: "airport",
        iata_code: "MAD",
        name: "Adolfo Suárez Madrid–Barajas Airport",
        city_name: "Madrid",
        country_name: "Spain",
        country_code: "ES",
        display_name: "Madrid (MAD) - Adolfo Suárez Madrid–Barajas Airport, Spain",
      },
      {
        id: "23",
        type: "airport",
        iata_code: "BCN",
        name: "Barcelona–El Prat Airport",
        city_name: "Barcelona",
        country_name: "Spain",
        country_code: "ES",
        display_name: "Barcelona (BCN) - Barcelona–El Prat Airport, Spain",
      },
      {
        id: "24",
        type: "airport",
        iata_code: "ZUR",
        name: "Zurich Airport",
        city_name: "Zurich",
        country_name: "Switzerland",
        country_code: "CH",
        display_name: "Zurich (ZUR) - Zurich Airport, Switzerland",
      },
      {
        id: "25",
        type: "airport",
        iata_code: "VIE",
        name: "Vienna International Airport",
        city_name: "Vienna",
        country_name: "Austria",
        country_code: "AT",
        display_name: "Vienna (VIE) - Vienna International Airport, Austria",
      },
      {
        id: "26",
        type: "airport",
        iata_code: "MUC",
        name: "Munich Airport",
        city_name: "Munich",
        country_name: "Germany",
        country_code: "DE",
        display_name: "Munich (MUC) - Munich Airport, Germany",
      },
      {
        id: "27",
        type: "airport",
        iata_code: "BRU",
        name: "Brussels Airport",
        city_name: "Brussels",
        country_name: "Belgium",
        country_code: "BE",
        display_name: "Brussels (BRU) - Brussels Airport, Belgium",
      },
      {
        id: "28",
        type: "airport",
        iata_code: "ARN",
        name: "Stockholm Arlanda Airport",
        city_name: "Stockholm",
        country_name: "Sweden",
        country_code: "SE",
        display_name: "Stockholm (ARN) - Stockholm Arlanda Airport, Sweden",
      },
      {
        id: "29",
        type: "airport",
        iata_code: "CPH",
        name: "Copenhagen Airport",
        city_name: "Copenhagen",
        country_name: "Denmark",
        country_code: "DK",
        display_name: "Copenhagen (CPH) - Copenhagen Airport, Denmark",
      },
      {
        id: "30",
        type: "airport",
        iata_code: "OSL",
        name: "Oslo Airport",
        city_name: "Oslo",
        country_name: "Norway",
        country_code: "NO",
        display_name: "Oslo (OSL) - Oslo Airport, Norway",
      },
    ]

    const lowerQuery = query.toLowerCase()
    return mockLocations
      .filter(
        (location) =>
          location.city_name.toLowerCase().includes(lowerQuery) ||
          location.name.toLowerCase().includes(lowerQuery) ||
          location.iata_code.toLowerCase().includes(lowerQuery) ||
          location.country_name.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 8)
  }

  // Client-side method that calls our API route
  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        console.error("Flight search failed:", response.status, response.statusText)
        return this.getMockFlights()
      }

      const data = await response.json()
      return data.flights || []
    } catch (error) {
      console.error("Flight search error:", error)
      return this.getMockFlights()
    }
  }

  // Server-side method for direct Duffel API calls
  async searchFlightsDirect(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      // For now, return mock data as Duffel flight search is complex
      // and requires proper offer request handling
      console.log("Using mock flight data for search:", params)
      
      const allFlights = this.getMockFlights()
      
      // Filter flights based on cabin class if specified
      if (params.cabinClass && params.cabinClass !== "economy") {
        const cabinClassMap: Record<string, string> = {
          "premium_economy": "Premium Economy",
          "business": "Business",
          "first": "First Class"
        }
        
        const requestedClass = cabinClassMap[params.cabinClass]
        if (requestedClass) {
          const filteredFlights = allFlights.filter(flight => flight.class === requestedClass)
          return filteredFlights.length > 0 ? filteredFlights : allFlights.filter(flight => flight.class === "Economy")
        }
      }
      
      // Return economy flights by default
      return allFlights.filter(flight => flight.class === "Economy")
    } catch (error) {
      console.error("Duffel flight search error:", error)
      return this.getMockFlights().filter(flight => flight.class === "Economy")
    }
  }

  private getMockFlights(): FlightOffer[] {
    return [
      {
        id: "1",
        airline: "Emirates",
        flightNumber: "EK 783",
        departure: {
          time: "14:30",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:45+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "7h 15m",
        stops: 1,
        stopDetails: "Dubai (DXB) 2h 30m",
        price: 1299,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment"],
        baggage: "23kg included",
        class: "Economy",
      },
      {
        id: "2",
        airline: "British Airways",
        flightNumber: "BA 075",
        departure: {
          time: "21:40",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:20+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "6h 40m",
        stops: 0,
        price: 1599,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment"],
        baggage: "23kg included",
        class: "Economy",
      },
      {
        id: "3",
        airline: "Turkish Airlines",
        flightNumber: "TK 624",
        departure: {
          time: "23:55",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "12:30+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "8h 35m",
        stops: 1,
        stopDetails: "Istanbul (IST) 3h 15m",
        price: 1199,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment"],
        baggage: "23kg included",
        class: "Economy",
      },
      {
        id: "4",
        airline: "Lufthansa",
        flightNumber: "LH 568",
        departure: {
          time: "16:15",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "08:45+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "8h 30m",
        stops: 1,
        stopDetails: "Frankfurt (FRA) 2h 45m",
        price: 1399,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment"],
        baggage: "23kg included",
        class: "Economy",
      },
      {
        id: "5",
        airline: "Air France",
        flightNumber: "AF 718",
        departure: {
          time: "11:20",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "19:55",
          airport: "LHR",
          city: "London",
          date: "2024-12-15",
        },
        duration: "6h 35m",
        stops: 0,
        price: 1750,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "premium-seats"],
        baggage: "23kg included",
        class: "Economy",
      },
      // Premium Economy Flights
      {
        id: "6",
        airline: "Emirates",
        flightNumber: "EK 783",
        departure: {
          time: "14:30",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:45+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "7h 15m",
        stops: 1,
        stopDetails: "Dubai (DXB) 2h 30m",
        price: 2499,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "premium-seats", "priority-boarding"],
        baggage: "32kg included",
        class: "Premium Economy",
      },
      {
        id: "7",
        airline: "British Airways",
        flightNumber: "BA 075",
        departure: {
          time: "21:40",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:20+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "6h 40m",
        stops: 0,
        price: 2899,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "premium-seats", "priority-boarding"],
        baggage: "32kg included",
        class: "Premium Economy",
      },
      // Business Class Flights
      {
        id: "8",
        airline: "Emirates",
        flightNumber: "EK 783",
        departure: {
          time: "14:30",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:45+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "7h 15m",
        stops: 1,
        stopDetails: "Dubai (DXB) 2h 30m",
        price: 5499,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "lie-flat-seats", "priority-boarding", "lounge-access"],
        baggage: "40kg included",
        class: "Business",
      },
      {
        id: "9",
        airline: "British Airways",
        flightNumber: "BA 075",
        departure: {
          time: "21:40",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:20+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "6h 40m",
        stops: 0,
        price: 6299,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "lie-flat-seats", "priority-boarding", "lounge-access"],
        baggage: "40kg included",
        class: "Business",
      },
      // First Class Flights
      {
        id: "10",
        airline: "Emirates",
        flightNumber: "EK 783",
        departure: {
          time: "14:30",
          airport: "LOS",
          city: "Lagos",
          date: "2024-12-15",
        },
        arrival: {
          time: "06:45+1",
          airport: "LHR",
          city: "London",
          date: "2024-12-16",
        },
        duration: "7h 15m",
        stops: 1,
        stopDetails: "Dubai (DXB) 2h 30m",
        price: 12999,
        currency: "USD",
        amenities: ["wifi", "meals", "entertainment", "private-suite", "priority-boarding", "lounge-access", "chauffeur"],
        baggage: "50kg included",
        class: "First Class",
      },
    ]
  }

  private transformDuffelResponse(data: any): FlightOffer[] {
    return (
      data.data?.map((offer: any) => ({
        id: offer.id,
        airline: offer.slices[0]?.segments[0]?.marketing_carrier?.name || "Unknown",
        flightNumber: offer.slices[0]?.segments[0]?.marketing_carrier_flight_number || "",
        departure: {
          time: new Date(offer.slices[0]?.segments[0]?.departing_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          airport: offer.slices[0]?.segments[0]?.origin?.iata_code || "",
          city: offer.slices[0]?.segments[0]?.origin?.city_name || "",
          date: offer.slices[0]?.segments[0]?.departing_at?.split("T")[0] || "",
        },
        arrival: {
          time: new Date(
            offer.slices[0]?.segments[offer.slices[0].segments.length - 1]?.arriving_at,
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          airport: offer.slices[0]?.segments[offer.slices[0].segments.length - 1]?.destination?.iata_code || "",
          city: offer.slices[0]?.segments[offer.slices[0].segments.length - 1]?.destination?.city_name || "",
          date: offer.slices[0]?.segments[offer.slices[0].segments.length - 1]?.arriving_at?.split("T")[0] || "",
        },
        duration: offer.slices[0]?.duration || "",
        stops: offer.slices[0]?.segments?.length - 1 || 0,
        price: Number.parseFloat(offer.total_amount) || 0,
        currency: offer.total_currency || "USD",
        amenities: ["wifi", "meals", "entertainment"], // Default amenities
        baggage: "23kg included", // Default baggage
        class: "Economy", // Default class
      })) || []
    )
  }

  async getFlightDetails(offerId: string): Promise<FlightOffer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/air/offers/${offerId}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to get flight details")
      }

      const data = await response.json()
      const transformed = this.transformDuffelResponse({ data: [data.data] })
      return transformed[0] || null
    } catch (error) {
      console.error("Flight details error:", error)
      return null
    }
  }
}

export const flightService = new FlightService()
