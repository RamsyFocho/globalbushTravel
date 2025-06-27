// /api/flights/offer/[offerId]/route.ts
// Next.js App Router API Route (app directory)

export async function GET(
  req: Request,
  context: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await context.params;
  if (!offerId) {
    return new Response(JSON.stringify({ error: "Missing offerId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Calling for the duffel API");
    // Use the correct Duffel endpoint and required headers
    const apiUrl = `https://api.duffel.com/air/offers/${offerId}`;
    const duffelRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
      },
    });
    if (!duffelRes.ok) {
      console.log("response is not OK");
      const errorBody = await duffelRes.json();
      return new Response(
        JSON.stringify({
          error: "Duffel API error",
          details: errorBody.errors || errorBody,
        }),
        {
          status: duffelRes.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const data = await duffelRes.json();
    console.log(data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
