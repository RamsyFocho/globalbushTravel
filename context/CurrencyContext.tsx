"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { convertCurrency } from "@/lib/currencyFormater/convertCurrency";
import { fetchUserCurrency } from "@/lib/utils/currencyUtils";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  format: (amount: number, from?: string) => Promise<string>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState("XAF");
  const [cache, setCache] = useState<Map<string, number>>(new Map());

  // Wrapper to also persist user preference
  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency);
  };

  const format = useCallback(
    async (amount: number, from = "USD"): Promise<string> => {
      const key = `${from}_${currency}`;
      let rate = cache.get(key);

      if (!rate) {
        const converted = await convertCurrency(1, from, currency);
        rate = converted;
        setCache(new Map(cache.set(key, rate)));
      }

      const result = amount * rate;
      return new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: currency,
      }).format(result);
    },
    [currency, cache]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("preferredCurrency");
      if (local) return setCurrencyState(local);
    }

    fetchUserCurrency().then(setCurrencyState);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
