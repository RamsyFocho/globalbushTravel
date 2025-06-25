"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { useEffect, useState } from "react";
import { fetchCurrencyList } from "@/lib/utils/currencyUtils";

export default function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  const [currencies, setCurrencies] = useState<
    { code: string; name: string; flag: string }[]
  >([]);

  useEffect(() => {
    fetchCurrencyList().then(setCurrencies);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Currency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        {currencies.map((cur) => (
          <option key={cur.code} value={cur.code}>
            {cur.flag} {cur.code}
          </option>
        ))}
      </select>
    </div>
  );
}
