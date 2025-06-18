import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.DUFFEL_API_KEY || "***REMOVED***"

    // Test the places/suggestions endpoint
    const suggestionsResponse = await fetch("https://api.duffel.com/places/suggestions?query=dou", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
    })

    const suggestionsData = await suggestionsResponse.json()

    // Test the airports endpoint
    const airportsResponse = await fetch("https://api.duffel.com/air/airports?name=dou&limit=5", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
    })

    const airportsData = await airportsResponse.json()

    return NextResponse.json({
      success: true,
      suggestions: {
        status: suggestionsResponse.status,
        data: suggestionsData,
      },
      airports: {
        status: airportsResponse.status,
        data: airportsData,
      },
      apiKeyUsed: apiKey.substring(0, 20) + "...",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
} 