import { NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function GET() {
  try {
    // Test parameters matching your Postman request
    const testParams = {
      origin: "JFK",
      destination: "LAX", 
      departureDate: "2025-07-15",
      passengers: 1,
      cabinClass: "economy"
    }

    console.log("=== TESTING FLIGHT SERVICE ===")
    console.log("Test parameters:", testParams)

    // Call the exact same method used by the flight search
    const flights = await flightService.searchFlightsDirect(testParams)

    console.log("=== FLIGHT SERVICE RESULT ===")
    console.log("Flights returned:", flights.length)
    console.log("First flight:", flights[0])

    return NextResponse.json({
      message: "Flight service test completed",
      testParams,
      flightsFound: flights.length,
      sampleFlight: flights[0] || null,
      allFlights: flights.slice(0, 3), // Show first 3 flights
      isMockData: flights.length > 0 && flights[0]?.id === "1" // Check if it's mock data
    })
  } catch (error) {
    console.error("Flight service test error:", error)
    return NextResponse.json({ 
      error: "Flight service test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
} 