import { NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function GET() {
  try {
    // Test search from JFK to LAX
    const searchParams = {
      origin: "JFK",
      destination: "LAX",
      departureDate: "2025-07-15",
      passengers: 1,
      cabinClass: "economy"
    }

    console.log("Testing origin/destination order with params:", searchParams)

    const flights = await flightService.searchFlightsDirect(searchParams)

    // Check that all flights have the correct origin/destination order
    const flightsWithCorrectOrder = flights.filter(flight => 
      flight.departure.airport === searchParams.origin && 
      flight.arrival.airport === searchParams.destination
    )

    const flightsWithWrongOrder = flights.filter(flight => 
      flight.departure.airport !== searchParams.origin || 
      flight.arrival.airport !== searchParams.destination
    )

    return NextResponse.json({
      message: "Origin/Destination order test completed",
      searchParams,
      totalFlights: flights.length,
      flightsWithCorrectOrder: flightsWithCorrectOrder.length,
      flightsWithWrongOrder: flightsWithWrongOrder.length,
      sampleCorrectFlight: flightsWithCorrectOrder[0] || null,
      sampleWrongFlight: flightsWithWrongOrder[0] || null,
      allFlights: flights.slice(0, 3).map(flight => ({
        id: flight.id,
        airline: flight.airline,
        departure: flight.departure,
        arrival: flight.arrival,
        price: flight.price
      }))
    })
  } catch (error) {
    console.error("Origin/Destination test error:", error)
    return NextResponse.json({ 
      error: "Origin/Destination test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
} 