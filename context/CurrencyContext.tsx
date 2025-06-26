"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { convertCurrency } from "@/lib/currencyFormater/convertCurrency";
import { fetchUserCurrency } from "@/lib/utils/currencyUtils";
import axios from "axios";

// --- Types ---
type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number, from?: string) => string;
  format: (amount: number, from?: string) => Promise<string>;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// --- Helper: Synchronous currency conversion with cached rates ---
const rateCache = new Map<string, number>();

async function fetchRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;
  const cacheKey = `${from}-${to}`;
  if (!rateCache.has(cacheKey)) {
    try {
      const res = await axios.get(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}`
      );
      if (res.data && res.data.info && typeof res.data.info.rate === 'number') {
        rateCache.set(cacheKey, res.data.info.rate);
      } else {
        console.warn('Exchange rate API response missing rate:', res.data);
        rateCache.set(cacheKey, 1); // fallback to 1 if rate missing
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      rateCache.set(cacheKey, 1); // fallback to 1 on error
    }
  }
  return rateCache.get(cacheKey)!;
}

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState("XAF");
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState<{ [from: string]: number }>({});

  // Fetch and cache rates when currency changes
  useEffect(() => {
    setLoading(true);
    const fetchAllRates = async () => {
      // Add more base currencies as needed
      const bases = ["USD", "EUR", "XAF"];
      const newRates: { [from: string]: number } = {};
      await Promise.all(
        bases.map(async (from) => {
          const rate = await fetchRate(from, currency);
          newRates[from] = rate;
        })
      );
      setRates(newRates);
      setLoading(false);
    };
    fetchAllRates();
  }, [currency]);

  // Synchronous formatter using cached rates
  const formatCurrency = (amount: number, from = "USD"): string => {
    if (from === currency) {
      return new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: currency,
      }).format(amount);
    }
    const cacheKey = `${from}-${currency}`;
    const rate = rateCache.get(cacheKey) || rates[from];
    if (!rate) {
      // Fallback: show original amount with currency code
      return `${amount} ${currency}`;
    }
    const converted = amount * rate;
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: currency,
    }).format(converted);
  };

  // Async formatter for background/fallback use
  const format = async (amount: number, from = "USD"): Promise<string> => {
    const rate = await fetchRate(from, currency);
    const converted = amount * rate;
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: currency,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, format, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
