// Hotel service for free/mock hotel API integration
export interface Hotel {
  id: string
  name: string
  address: string
  city: string
  country: string
  rating: number
  price: number
  currency: string
  images: string[]
  amenities: string[]
  description: string
  reviews: {
    count: number
    average: number
  }
  coordinates: {
    lat: number
    lng: number
  }
}

export interface HotelSearchParams {
  destination: string
  checkIn: string
  checkOut: string
  rooms: number
  guests: number
  priceRange?: [number, number]
  rating?: number
}

class HotelService {
  private baseUrl = process.env.HOTEL_API_URL || "https://api.hotelapi.co"
  private apiKey = process.env.HOTEL_API_KEY || ""

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    try {
      // In development, return mock data
      if (process.env.NODE_ENV === "development") {
        return this.getMockHotels(params.destination)
      }

      const searchParams = new URLSearchParams({
        destination: params.destination,
        checkin: params.checkIn,
        checkout: params.checkOut,
        rooms: params.rooms.toString(),
        guests: params.guests.toString(),
      })

      const response = await fetch(`${this.baseUrl}/search?${searchParams}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to search hotels")
      }

      const data = await response.json()
      return this.transformHotelResponse(data)
    } catch (error) {
      console.error("Hotel search error:", error)
      // Fallback to mock data on error
      return this.getMockHotels(params.destination)
    }
  }

  private getMockHotels(destination: string): Hotel[] {
    const baseHotels = [
      {
        id: "1",
        name: "Grand Luxury Hotel",
        address: "123 Main Street",
        city: destination,
        country: "Nigeria",
        rating: 5,
        price: 299,
        currency: "USD",
        images: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
        amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
        description: "Experience luxury at its finest with our premium accommodations and world-class amenities.",
        reviews: {
          count: 1247,
          average: 4.8,
        },
        coordinates: {
          lat: 6.5244,
          lng: 3.3792,
        },
      },
      {
        id: "2",
        name: "Business Center Hotel",
        address: "456 Business District",
        city: destination,
        country: "Nigeria",
        rating: 4,
        price: 189,
        currency: "USD",
        images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
        amenities: ["WiFi", "Business Center", "Restaurant", "Gym", "Conference Rooms"],
        description: "Perfect for business travelers with modern facilities and convenient location.",
        reviews: {
          count: 892,
          average: 4.5,
        },
        coordinates: {
          lat: 6.5344,
          lng: 3.3892,
        },
      },
      {
        id: "3",
        name: "Boutique Comfort Inn",
        address: "789 Comfort Lane",
        city: destination,
        country: "Nigeria",
        rating: 3,
        price: 129,
        currency: "USD",
        images: ["/placeholder.svg?height=300&width=400"],
        amenities: ["WiFi", "Restaurant", "Parking", "Airport Shuttle"],
        description: "Comfortable and affordable accommodation with friendly service.",
        reviews: {
          count: 456,
          average: 4.2,
        },
        coordinates: {
          lat: 6.5144,
          lng: 3.3692,
        },
      },
    ]

    return baseHotels.map((hotel) => ({
      ...hotel,
      city: destination,
    }))
  }

  private transformHotelResponse(data: any): Hotel[] {
    // Transform hotel API response to our Hotel interface
    return (
      data.hotels?.map((hotel: any) => ({
        id: hotel.id?.toString() || "",
        name: hotel.name || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        rating: hotel.star_rating || 0,
        price: Number.parseFloat(hotel.price) || 0,
        currency: hotel.currency || "USD",
        images: hotel.images || ["/placeholder.svg?height=300&width=400"],
        amenities: hotel.amenities || [],
        description: hotel.description || "",
        reviews: {
          count: hotel.review_count || 0,
          average: hotel.review_score || 0,
        },
        coordinates: {
          lat: hotel.latitude || 0,
          lng: hotel.longitude || 0,
        },
      })) || []
    )
  }

  async getHotelDetails(hotelId: string): Promise<Hotel | null> {
    try {
      if (process.env.NODE_ENV === "development") {
        const mockHotels = this.getMockHotels("Lagos")
        return mockHotels.find((hotel) => hotel.id === hotelId) || null
      }

      const response = await fetch(`${this.baseUrl}/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get hotel details")
      }

      const data = await response.json()
      const transformed = this.transformHotelResponse({ hotels: [data.hotel] })
      return transformed[0] || null
    } catch (error) {
      console.error("Hotel details error:", error)
      return null
    }
  }
}

export const hotelService = new HotelService()
