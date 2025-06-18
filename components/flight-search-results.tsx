import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Wifi, Utensils } from "lucide-react"
import Image from "next/image"

const flights = [
  {
    id: 1,
    airline: "Emirates",
    logo: "/placeholder.svg?height=40&width=40",
    flightNumber: "EK 783",
    departure: {
      time: "14:30",
      airport: "LOS",
      city: "Lagos",
    },
    arrival: {
      time: "06:45+1",
      airport: "LHR",
      city: "London",
    },
    duration: "7h 15m",
    stops: "1 Stop",
    stopDetails: "Dubai (DXB) 2h 30m",
    price: 1299,
    currency: "USD",
    amenities: ["wifi", "meals", "entertainment"],
    baggage: "23kg included",
    class: "Economy",
  },
  {
    id: 2,
    airline: "British Airways",
    logo: "/placeholder.svg?height=40&width=40",
    flightNumber: "BA 075",
    departure: {
      time: "21:40",
      airport: "LOS",
      city: "Lagos",
    },
    arrival: {
      time: "06:20+1",
      airport: "LHR",
      city: "London",
    },
    duration: "6h 40m",
    stops: "Direct",
    stopDetails: null,
    price: 1599,
    currency: "USD",
    amenities: ["wifi", "meals", "entertainment"],
    baggage: "23kg included",
    class: "Economy",
  },
  {
    id: 3,
    airline: "Turkish Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    flightNumber: "TK 624",
    departure: {
      time: "23:55",
      airport: "LOS",
      city: "Lagos",
    },
    arrival: {
      time: "12:30+1",
      airport: "LHR",
      city: "London",
    },
    duration: "8h 35m",
    stops: "1 Stop",
    stopDetails: "Istanbul (IST) 3h 15m",
    price: 1199,
    currency: "USD",
    amenities: ["wifi", "meals", "entertainment"],
    baggage: "23kg included",
    class: "Economy",
  },
]

export function FlightSearchResults() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{flights.length} flights found</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="border rounded px-3 py-1 text-sm">
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
            <option>Duration</option>
            <option>Departure Time</option>
          </select>
        </div>
      </div>

      {flights.map((flight) => (
        <Card key={flight.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Airline Info */}
              <div className="lg:col-span-2 flex items-center space-x-3">
                <Image
                  src={flight.logo || "/placeholder.svg"}
                  alt={flight.airline}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <p className="font-semibold text-sm">{flight.airline}</p>
                  <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                </div>
              </div>

              {/* Flight Details */}
              <div className="lg:col-span-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xl font-bold">{flight.departure.time}</p>
                    <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                    <p className="text-xs text-gray-500">{flight.departure.city}</p>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <Plane className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-xs text-gray-500">{flight.duration}</p>
                      <p className="text-xs text-gray-500">{flight.stops}</p>
                      {flight.stopDetails && <p className="text-xs text-gray-400">{flight.stopDetails}</p>}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold">{flight.arrival.time}</p>
                    <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                    <p className="text-xs text-gray-500">{flight.arrival.city}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center space-x-4 mt-3">
                  {flight.amenities.includes("wifi") && (
                    <div className="flex items-center space-x-1">
                      <Wifi className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">WiFi</span>
                    </div>
                  )}
                  {flight.amenities.includes("meals") && (
                    <div className="flex items-center space-x-1">
                      <Utensils className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Meals</span>
                    </div>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {flight.baggage}
                  </Badge>
                </div>
              </div>

              {/* Price and Book */}
              <div className="lg:col-span-4 text-right">
                <div className="mb-2">
                  <p className="text-2xl font-bold text-grassland-600">${flight.price}</p>
                  <p className="text-xs text-gray-500">per person</p>
                  <p className="text-xs text-gray-500">{flight.class}</p>
                </div>
                <Button className="w-full lg:w-auto bg-grassland-600 hover:bg-grassland-700">Select Flight</Button>
                <p className="text-xs text-gray-500 mt-1">Free cancellation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
