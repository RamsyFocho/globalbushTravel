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
  private baseUrl = process.env.DUFFEL_API_URL || "https://api.duffel.com"
  private apiKey = process.env.DUFFEL_API_KEY

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error("DUFFEL_API_KEY environment variable is not set")
    }

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
      console.log("Searching flights with Duffel API:", params)

      // Check if API key is available
      if (!this.apiKey) {
        console.error("DUFFEL_API_KEY environment variable is not set")
        throw new Error("DUFFEL_API_KEY environment variable is not set")
      }

      // Prepare the offer request payload
      const offerRequestPayload = {
        data: {
          slices: [
            {
              origin: params.origin,
              destination: params.destination,
              departure_date: params.departureDate,
            },
          ],
          passengers: Array.from({ length: params.passengers }, () => ({ type: "adult" })),
          cabin_class: params.cabinClass || "economy",
        },
      }

      // Add return slice if return date is provided
      if (params.returnDate) {
        offerRequestPayload.data.slices.push({
          origin: params.destination,
          destination: params.origin,
          departure_date: params.returnDate,
        })
      }

      console.log("Duffel offer request payload:", JSON.stringify(offerRequestPayload, null, 2))
      console.log("Duffel API URL:", `${this.baseUrl}/air/offer_requests`)
      console.log("Duffel API Key (first 10 chars):", this.apiKey.substring(0, 10) + "...")

      // Make the offer request
      const offerResponse = await fetch(`${this.baseUrl}/air/offer_requests`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(offerRequestPayload),
      })

      console.log("Duffel offer request response status:", offerResponse.status)
      console.log("Duffel offer request response headers:", Object.fromEntries(offerResponse.headers.entries()))

      if (!offerResponse.ok) {
        const errorText = await offerResponse.text()
        console.error(`Duffel offer request error (${offerResponse.status}):`, errorText)
        throw new Error(`HTTP ${offerResponse.status}: ${offerResponse.statusText} - ${errorText}`)
      }

      const offerData = await offerResponse.json()
      console.log("Duffel offer request response:", JSON.stringify(offerData, null, 2))

      // Get the offer request ID
      const offerRequestId = offerData.data.id
      console.log("Offer request ID:", offerRequestId)

      // Poll for offers
      const offers = await this.pollForOffers(offerRequestId)
      console.log("Polling completed, offers found:", offers.length)

      if (offers.length > 0) {
        console.log("Returning real Duffel API results")
        return offers
      }

      // If no offers from API, return mock data
      console.log("No offers from Duffel API, using mock data")
      return this.getMockFlights()
    } catch (error) {
      console.error("Duffel flight search error:", error)
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        apiKey: this.apiKey ? "Present" : "Missing",
        baseUrl: this.baseUrl
      })
      return this.getMockFlights()
    }
  }

  private async pollForOffers(offerRequestId: string): Promise<FlightOffer[]> {
    const maxAttempts = 10
    const pollInterval = 2000 // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Polling for offers, attempt ${attempt + 1}/${maxAttempts}`)

        const offersResponse = await fetch(`${this.baseUrl}/air/offers?offer_request_id=${offerRequestId}`, {
          headers: this.getHeaders(),
        })

        console.log(`Poll attempt ${attempt + 1} response status:`, offersResponse.status)

        if (!offersResponse.ok) {
          const errorText = await offersResponse.text()
          console.error(`Duffel offers error (${offersResponse.status}):`, errorText)
          throw new Error(`HTTP ${offersResponse.status}: ${offersResponse.statusText}`)
        }

        const offersData = await offersResponse.json()
        console.log(`Poll attempt ${attempt + 1} offers count:`, offersData.data?.length || 0)

        if (offersData.data && offersData.data.length > 0) {
          console.log(`Found ${offersData.data.length} offers from Duffel API`)
          const transformedOffers = this.transformDuffelResponse(offersData)
          console.log(`Transformed ${transformedOffers.length} offers`)
          return transformedOffers
        }

        console.log(`No offers yet, waiting ${pollInterval}ms before next attempt...`)
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      } catch (error) {
        console.error(`Error polling for offers (attempt ${attempt + 1}):`, error)
        if (attempt === maxAttempts - 1) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }

    console.log("No offers found after maximum polling attempts")
    return []
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
    try {
      console.log("Transforming Duffel response:", {
        hasData: !!data.data,
        dataLength: data.data?.length || 0
      })

      if (!data.data || !Array.isArray(data.data)) {
        console.error("Invalid data structure in Duffel response")
        return []
      }

      const transformed = data.data.map((offer: any, index: number) => {
        try {
          const firstSlice = offer.slices?.[0]
          const firstSegment = firstSlice?.segments?.[0]
          const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1]

          if (!firstSlice || !firstSegment) {
            console.error(`Offer ${index + 1} missing slice or segment data`)
            return null
          }

          return {
            id: offer.id,
            airline: firstSegment.marketing_carrier?.name || "Unknown",
            flightNumber: firstSegment.marketing_carrier_flight_number || "",
            departure: {
              time: new Date(firstSegment.departing_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              airport: firstSegment.origin?.iata_code || "",
              city: firstSegment.origin?.city_name || "",
              date: firstSegment.departing_at?.split("T")[0] || "",
            },
            arrival: {
              time: new Date(lastSegment.arriving_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              airport: lastSegment.destination?.iata_code || "",
              city: lastSegment.destination?.city_name || "",
              date: lastSegment.arriving_at?.split("T")[0] || "",
            },
            duration: firstSlice.duration || "",
            stops: firstSlice.segments?.length - 1 || 0,
            price: Number.parseFloat(offer.total_amount) || 0,
            currency: offer.total_currency || "USD",
            amenities: ["wifi", "meals", "entertainment"],
            baggage: "23kg included",
            class: "Economy",
          }
        } catch (error) {
          console.error(`Error transforming offer ${index + 1}:`, error)
          return null
        }
      }).filter(Boolean)

      console.log(`Successfully transformed ${transformed.length} offers`)
      return transformed
    } catch (error) {
      console.error("Error in transformDuffelResponse:", error)
      return []
    }
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
