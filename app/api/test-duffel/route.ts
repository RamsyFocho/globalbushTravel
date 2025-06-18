import { NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function GET() {
  try {
    // Test parameters with a closer date
    const testParams = {
      origin: "JFK",
      destination: "LAX", 
      departureDate: "2024-12-20", // Using a closer date
      passengers: 1,
      cabinClass: "economy"
    }

    console.log("Testing Duffel API with parameters:", testParams)

    // This will send the correct JSON format to Duffel API
    const flights = await flightService.searchFlightsDirect(testParams)

    return NextResponse.json({
      message: "Duffel API test completed",
      testParams,
      flightsFound: flights.length,
      sampleFlight: flights[0] || null,
      // Show the exact payload that was sent to Duffel
      duffelPayload: {
        data: {
          slices: [
            {
              origin: testParams.origin,
              destination: testParams.destination,
              departure_date: testParams.departureDate,
            },
          ],
          passengers: Array.from({ length: testParams.passengers }, () => ({ type: "adult" })),
          cabin_class: testParams.cabinClass,
        },
      }
    })
  } catch (error) {
    console.error("Duffel API test error:", error)
    return NextResponse.json({ 
      error: "Duffel API test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
