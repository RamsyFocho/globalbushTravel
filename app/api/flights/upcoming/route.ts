import { NextRequest, NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userLocation = searchParams.get('location') || 'DLA' // Default to DLA if no location provided

    console.log("Getting upcoming flights from location:", userLocation)

    const flights = await flightService.getUpcomingFlightsFromLocation(userLocation)

    return NextResponse.json({ 
      flights,
      location: userLocation,
      count: flights.length
    })
  } catch (error) {
    console.error("Upcoming flights API error:", error)
    return NextResponse.json({ 
      error: "Failed to get upcoming flights",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 