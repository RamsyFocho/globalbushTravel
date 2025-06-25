// lib/convertCurrency.ts
import axios from "axios";

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  try {
    const res = await axios.get(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    return res.data.result;
  } catch (error) {
    console.error("Currency conversion failed:", error);
    return amount; // fallback to original amount
  }
}
