import { type NextRequest, NextResponse } from "next/server"
import { hotelService } from "@/lib/api/hotel-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, checkIn, checkOut, rooms, guests, priceRange, rating } = body

    if (!destination || !checkIn || !checkOut || !rooms || !guests) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const hotels = await hotelService.searchHotels({
      destination,
      checkIn,
      checkOut,
      rooms: Number.parseInt(rooms),
      guests: Number.parseInt(guests),
      priceRange,
      rating,
    })

    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Hotel search API error:", error)
    return NextResponse.json({ error: "Failed to search hotels" }, { status: 500 })
  }
}
