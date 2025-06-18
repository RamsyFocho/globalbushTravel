"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Wifi, Utensils, Clock, Loader2, MapPin } from "lucide-react"
import { DataSortFilter } from "@/components/data-sort-filter"
import { flightSortOptions, sortData } from "@/lib/utils/sorting"
import { toast } from "react-toastify"

interface Flight {
  id: string
  airline: string
  logo: string
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
  durationMinutes: number
  stops: number
  stopDetails?: string
  price: number
  currency: string
  amenities: string[]
  baggage: string
  class: string
  aircraft?: string
  carbonEmissions?: number
}

interface UpcomingFlightsProps {
  userLocation: string
}

export function UpcomingFlights({ userLocation }: UpcomingFlightsProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSort, setCurrentSort] = useState("price-asc")

  useEffect(() => {
    if (userLocation) {
      loadUpcomingFlights()
    }
  }, [userLocation])

  const loadUpcomingFlights = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/flights/upcoming?location=${userLocation}`)
      
      if (!response.ok) {
        throw new Error("Failed to load upcoming flights")
      }

      const data = await response.json()
      
      // Convert FlightOffer to Flight interface
      const convertedFlights = data.flights.map((offer: any) => ({
        id: offer.id,
        airline: offer.airline,
        logo: "/placeholder.svg?height=40&width=40",
        flightNumber: offer.flightNumber,
        departure: offer.departure,
        arrival: offer.arrival,
        duration: offer.duration,
        durationMinutes: parseInt(offer.duration.split('h')[0]) * 60 + parseInt(offer.duration.split('h')[1]?.split('m')[0] || '0'),
        stops: offer.stops,
        stopDetails: offer.stopDetails,
        price: offer.price,
        currency: offer.currency,
        amenities: offer.amenities,
        baggage: offer.baggage,
        class: offer.class,
        aircraft: "Boeing 777",
        carbonEmissions: Math.floor(Math.random() * 500) + 800,
      }))

      setFlights(convertedFlights)
    } catch (err) {
      console.error("Error loading upcoming flights:", err)
      setError("Failed to load upcoming flights. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const sortedFlights = sortData(flights, flightSortOptions.find(option => option.value === currentSort) || flightSortOptions[0])

  const handleBookFlight = (flight: Flight) => {
    toast.success(`Flight ${flight.flightNumber} selected! Redirecting to booking...`)
  }

  const handleFilterClear = (filterKey: string) => {
    console.log("Clear filter:", filterKey)
  }

  const handleClearAllFilters = () => {
    console.log("Clear all filters")
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading upcoming flights...</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Finding the best flight options from your location.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Plane className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Flights</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button 
          onClick={loadUpcomingFlights} 
          className="bg-grassland-600 hover:bg-grassland-700 text-white"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DataSortFilter
        sortOptions={flightSortOptions}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        activeFilters={{}}
        onFilterClear={handleFilterClear}
        onClearAllFilters={handleClearAllFilters}
        resultCount={sortedFlights.length}
      />

      {sortedFlights.length === 0 ? (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No upcoming flights found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try searching for specific flights or check back later for new options.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Plane className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{flight.airline}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{flight.flightNumber}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">{flight.departure.time}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{flight.departure.airport}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{flight.departure.city}</p>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                          <Plane className="h-4 w-4 rotate-90" />
                          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{flight.arrival.airport}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{flight.arrival.city}</p>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{flight.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{flight.stops} stop{flight.stops !== 1 ? 's' : ''}</span>
                      </div>
                      {flight.amenities.includes('wifi') && (
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          <span>WiFi</span>
                        </div>
                      )}
                      {flight.amenities.includes('meals') && (
                        <div className="flex items-center gap-1">
                          <Utensils className="h-4 w-4" />
                          <span>Meals</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {flight.currency} {flight.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">per passenger</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {flight.class}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {flight.baggage}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => handleBookFlight(flight)}
                      className="bg-grassland-600 hover:bg-grassland-700 text-white"
                    >
                      Book Flight
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 