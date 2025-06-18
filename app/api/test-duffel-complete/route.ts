import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.DUFFEL_API_KEY
    const baseUrl = process.env.DUFFEL_API_URL || "https://api.duffel.com"

    if (!apiKey) {
      return NextResponse.json({ error: "DUFFEL_API_KEY not set" }, { status: 500 })
    }

    // Step 1: Create offer request
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

    console.log("Step 1: Creating offer request...")
    const offerResponse = await fetch(`${baseUrl}/air/offer_requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!offerResponse.ok) {
      const errorText = await offerResponse.text()
      return NextResponse.json({ 
        error: "Offer request failed", 
        status: offerResponse.status,
        details: errorText
      }, { status: 500 })
    }

    const offerData = await offerResponse.json()
    const offerRequestId = offerData.data.id
    console.log("Step 1: Offer request created with ID:", offerRequestId)

    // Step 2: Poll for offers
    console.log("Step 2: Polling for offers...")
    const maxAttempts = 10
    const pollInterval = 2000
    let offers = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`Poll attempt ${attempt + 1}/${maxAttempts}`)
      
      const pollResponse = await fetch(`${baseUrl}/air/offers?offer_request_id=${offerRequestId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Duffel-Version": "v2",
          Accept: "application/json",
        },
      })

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text()
        console.error(`Poll error (${pollResponse.status}):`, errorText)
        continue
      }

      const pollData = await pollResponse.json()
      console.log(`Poll attempt ${attempt + 1}: Found ${pollData.data?.length || 0} offers`)

      if (pollData.data && pollData.data.length > 0) {
        offers = pollData
        console.log("Step 2: Offers found!")
        break
      }

      if (attempt < maxAttempts - 1) {
        console.log(`Waiting ${pollInterval}ms before next poll...`)
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
    }

    return NextResponse.json({
      success: true,
      offerRequestId,
      offerRequest: offerData,
      offers: offers,
      offersFound: offers?.data?.length || 0,
      pollingAttempts: maxAttempts
    })

  } catch (error) {
    console.error("Complete Duffel test error:", error)
    return NextResponse.json({ 
      error: "Complete Duffel test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
} 