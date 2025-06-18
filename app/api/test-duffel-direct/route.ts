import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.DUFFEL_API_KEY
    const baseUrl = process.env.DUFFEL_API_URL || "https://api.duffel.com"

    if (!apiKey) {
      return NextResponse.json({ error: "DUFFEL_API_KEY not set" }, { status: 500 })
    }

    // Test payload matching your Postman request
    const payload = {
      data: {
        slices: [
          {
            origin: "JFK",
            destination: "LAX",
            departure_date: "2025-07-15"
          }
        ],
        passengers: [{ type: "adult" }],
        cabin_class: "economy"
      }
    }

    console.log("Sending to Duffel API:", JSON.stringify(payload, null, 2))

    const response = await fetch(`${baseUrl}/air/offer_requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { raw: responseText }
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      payload: payload,
      response: responseData,
      success: response.ok
    })

  } catch (error) {
    console.error("Direct Duffel test error:", error)
    return NextResponse.json({ 
      error: "Direct Duffel test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
} 