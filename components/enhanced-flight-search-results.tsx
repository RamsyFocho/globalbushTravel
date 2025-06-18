"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Wifi, Utensils, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { DataSortFilter } from "@/components/data-sort-filter"
import { flightSortOptions, sortData } from "@/lib/utils/sorting"
import { toast } from "react-toastify"
import { flightService, type FlightOffer } from "@/lib/api/flight-service"

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

interface EnhancedFlightSearchResultsProps {
  filters?: Record<string, any>
  searchParams?: any
}

export function EnhancedFlightSearchResults({ filters = {}, searchParams }: EnhancedFlightSearchResultsProps) {
  const [currentSort, setCurrentSort] = useState("price-asc")
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert FlightOffer to Flight interface
  const convertFlightOfferToFlight = (offer: FlightOffer): Flight => {
    return {
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
      aircraft: "Boeing 777", // Mock aircraft info
      carbonEmissions: Math.floor(Math.random() * 500) + 800, // Mock carbon emissions
    }
  }

  // Search flights when searchParams change
  useEffect(() => {
    if (searchParams?.from && searchParams?.to && searchParams?.departureDate) {
      setLoading(true)
      setError(null)

      const searchFlightParams = {
        origin: searchParams.from,
        destination: searchParams.to,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        passengers: searchParams.passengers || 1,
        cabinClass: searchParams.cabinClass || "economy",
      }

      flightService.searchFlights(searchFlightParams)
        .then((flightOffers) => {
          const convertedFlights = flightOffers.map(convertFlightOfferToFlight)
          setFlights(convertedFlights)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Flight search error:", err)
          setError("Failed to search flights. Please try again.")
          setLoading(false)
        })
    }
  }, [searchParams])

  const filteredAndSortedFlights = useMemo(() => {
    let filtered = [...flights]

    // Apply filters
    if (filters.price) {
      filtered = filtered.filter((flight) => flight.price >= filters.price.min && flight.price <= filters.price.max)
    }

    if (filters.airline && filters.airline.length > 0) {
      filtered = filtered.filter((flight) => filters.airline.includes(flight.airline))
    }

    if (filters.stops && filters.stops.length > 0) {
      filtered = filtered.filter((flight) => filters.stops.includes(flight.stops))
    }

    if (filters.durationMinutes) {
      filtered = filtered.filter(
        (flight) =>
          flight.durationMinutes >= filters.durationMinutes.min &&
          flight.durationMinutes <= filters.durationMinutes.max,
      )
    }

    // Apply sorting
    const sortOption = flightSortOptions.find((option) => option.value === currentSort)
    return sortOption ? sortData(filtered, sortOption) : filtered
  }, [flights, filters, currentSort])

  const handleFilterClear = (filterKey: string) => {
    // This would be handled by parent component
    console.log("Clear filter:", filterKey)
  }

  const handleClearAllFilters = () => {
    // This would be handled by parent component
    console.log("Clear all filters")
  }

  const handleBookFlight = (flight: Flight) => {
    toast.success(`Flight ${flight.flightNumber} selected! Redirecting to booking...`)
  }

  if (!searchParams?.from || !searchParams?.to) {
    return (
      <div className="text-center py-12">
        <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Ready to search for flights?</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your travel details above to find the best flight options.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Searching for flights...</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we find the best options for your trip.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Plane className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Search Error</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
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
        activeFilters={filters}
        onFilterClear={handleFilterClear}
        onClearAllFilters={handleClearAllFilters}
        resultCount={filteredAndSortedFlights.length}
      />

      <div className="space-y-4">
        {filteredAndSortedFlights.map((flight) => (
          <Card
            key={flight.id}
            className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
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
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{flight.airline}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{flight.flightNumber}</p>
                    {flight.aircraft && <p className="text-xs text-gray-400 dark:text-gray-500">{flight.aircraft}</p>}
                  </div>
                </div>

                {/* Flight Details */}
                <div className="lg:col-span-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{flight.departure.time}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{flight.departure.airport}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{flight.departure.city}</p>
                    </div>

                    <div className="flex-1 mx-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        <Plane className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="text-center mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          {flight.duration}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
                        </p>
                        {flight.stopDetails && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{flight.stopDetails}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{flight.arrival.time}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{flight.arrival.airport}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{flight.arrival.city}</p>
                    </div>
                  </div>

                  {/* Amenities and Details */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      {flight.amenities.includes("wifi") && (
                        <div className="flex items-center space-x-1">
                          <Wifi className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">WiFi</span>
                        </div>
                      )}
                      {flight.amenities.includes("meals") && (
                        <div className="flex items-center space-x-1">
                          <Utensils className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Meals</span>
                        </div>
                      )}
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {flight.baggage}
                      </Badge>
                    </div>

                    {flight.carbonEmissions && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">CO₂: {flight.carbonEmissions}kg</div>
                    )}
                  </div>
                </div>

                {/* Price and Book */}
                <div className="lg:col-span-4 text-right">
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-grassland-600 dark:text-grassland-400">${flight.price}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{flight.class}</p>
                  </div>
                  <Button
                    className="w-full lg:w-auto bg-grassland-600 hover:bg-grassland-700 text-white"
                    onClick={() => handleBookFlight(flight)}
                  >
                    Select Flight
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Free cancellation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedFlights.length === 0 && flights.length > 0 && (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No flights found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters to find more options.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleClearAllFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {filteredAndSortedFlights.length === 0 && flights.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No flights available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No flights found for your selected route and dates. Try different dates or destinations.
          </p>
        </div>
      )}
    </div>
  )
}
