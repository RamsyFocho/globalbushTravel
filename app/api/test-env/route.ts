import { NextResponse } from "next/server"

export async function GET() {
  const duffelApiKey = process.env.DUFFEL_API_KEY
  const duffelApiUrl = process.env.DUFFEL_API_URL

  return NextResponse.json({
    duffelApiKey: duffelApiKey ? `${duffelApiKey.substring(0, 10)}...` : "NOT SET",
    duffelApiUrl: duffelApiUrl || "NOT SET",
    hasApiKey: !!duffelApiKey,
    environment: process.env.NODE_ENV,
  })
} 