// /api/flight/offer/[id]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log(id);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id) return res.status(400).json({ error: 'Missing ID' });

  try {
    // Your logic to fetch from Duffel
    const response = await fetch(`https://api.duffel.com/v1/offer/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_TOKEN}`,
        'Duffel-Version': 'v1',
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
