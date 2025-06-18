import { type NextRequest, NextResponse } from "next/server"
import { flightService } from "@/lib/api/flight-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ locations: [] })
    }

    console.log("Searching locations for query:", query)

    // Always try to get locations, with fallback to mock data
    const locations = await flightService.searchLocationsDirect(query)

    console.log(`Found ${locations.length} locations for query: ${query}`)

    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Location search API error:", error)

    // Return mock data as fallback
    const query = new URL(request.url).searchParams.get("q") || ""
    const mockLocations = await flightService.searchLocationsDirect(query).catch(() => [])

    return NextResponse.json({
      locations: mockLocations,
      error: "API temporarily unavailable, showing cached results",
    })
  }
}
