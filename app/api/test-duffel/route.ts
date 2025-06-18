import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.DUFFEL_API_KEY || "***REMOVED***"

    const response = await fetch("https://api.duffel.com/air/airports?limit=5", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
    })

    const responseText = await response.text()

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      apiKeyUsed: apiKey.substring(0, 20) + "...",
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
