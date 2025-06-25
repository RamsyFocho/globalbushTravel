// lib/convertCurrency.ts
import axios from "axios";

// Caches conversion rates to avoid repeated API calls per session
const rateCache = new Map<string, number>();

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  try {
    if (from === to) return amount;

    const cacheKey = `${from}-${to}`;
    if (!rateCache.has(cacheKey)) {
      const res = await axios.get(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}`
      );
      rateCache.set(cacheKey, res.data.info.rate);
    }
    const rate = rateCache.get(cacheKey)!;
    return amount * rate;
  } catch (error) {
    console.error("Currency conversion failed:", error);
    return amount;
  }
}
