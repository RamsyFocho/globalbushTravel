import { type NextRequest, NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, departureDate, returnDate, passengers, cabinClass } = body

    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log("Searching flights with Duffel API:", {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
    })

    // Use the direct server-side method
    const flights = await flightService.searchFlightsDirect({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers: typeof passengers === 'string' ? Number.parseInt(passengers) : passengers,
      cabinClass,
    })

    return NextResponse.json({ flights })
  } catch (error) {
    console.error("Flight search API error:", error)
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 })
  }
}
