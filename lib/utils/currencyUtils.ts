// lib/currencyUtils.ts
import axios from "axios";

function toEmojiFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// Get list of supported currencies
export async function fetchCurrencyList(): Promise<
  { code: string; flag: string }[]
> {
  try {
    const res = await axios.get(
      "https://restcountries.com/v3.1/all?fields=currencies,cca2"
    );

    const seen = new Set<string>();
    const currencyList: { code: string; flag: string }[] = [];

    for (const country of res.data) {
      const { currencies, cca2 } = country;
      if (!currencies || !cca2) continue;

      const flag = toEmojiFlag(cca2);

      for (const code of Object.keys(currencies)) {
        if (!seen.has(code)) {
          seen.add(code);
          currencyList.push({ code, flag });
        }
      }
    }

    // Sort alphabetically by currency code
    return currencyList.sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error("Failed to fetch currency list:", error);
    return [
      { code: "USD", flag: "🇺🇸" },
      { code: "XAF", flag: "🇨🇲" },
    ].sort((a, b) => a.code.localeCompare(b.code));
  }
}
// Get user’s country using IP
export async function fetchUserCurrency(): Promise<string> {
  try {
    const res = await axios.get("https://ipapi.co/json/");
    return res.data.currency || "XAF";
  } catch {
    return "XAF";
  }
}
