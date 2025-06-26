"use client"
import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plane, Building2 } from "lucide-react";

const DEFAULT_LOCATION = "DLA";

// Add Offer type for better typing
interface Offer {
  id: string | number;
  type: string;
  from: string;
  to: string;
  image: string;
  payNow: number;
  installment: number;
  airline: string;
  airlineIcon: string;
  currency: string;
}

// Simple in-memory cache
const offerCache: {
  [key: string]: { data: any[]; timestamp: number };
} = {};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const TravelOffersSection = ({
  hotelOffers = [],
  title = "Offers",
  activeTab = "Flight",
  userLocation = DEFAULT_LOCATION,
}: {
  hotelOffers?: any[];
  title?: string;
  activeTab?: string;
  userLocation?: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState(activeTab);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const scrollRef = useRef(null);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    if (selectedTab === "Flight") {
      fetchOffers();
    }
    // eslint-disable-next-line
  }, [selectedTab, userLocation]);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);

    const cacheKey = `${userLocation}_${selectedTab}`;
    const now = Date.now();

    // Use cached data if valid
    if (
      offerCache[cacheKey] &&
      now - offerCache[cacheKey].timestamp < CACHE_DURATION
    ) {
      setOffers(offerCache[cacheKey].data);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/flights/upcoming?location=${userLocation}`
      );
      if (!response.ok) throw new Error("Failed to load offers");
      const data = await response.json();
      console.log(data);
      const mappedOffers = data.flights.map((offer: any) => ({
        id: offer.id,
        type: offer.class || "Round Trip",
        from: offer.departure.city || offer.departure.airport,
        to: offer.arrival.city || offer.arrival.airport,
        image: "/api/placeholder/200/120",
        payNow: parseFloat(offer.price),
        installment: Math.round(parseFloat(offer.price) / 3),
        currency: offer.currency,
        airline: offer.airline,
        // airlineIcon: `https://static.duffel.com/airlines/logo/${offer.airline_iata.toLowerCase()}.png` || '✈️' ,
        airlineIcon: "✈️",
      }));

      setOffers(mappedOffers);

      // Cache it
      offerCache[cacheKey] = {
        data: mappedOffers,
        timestamp: now,
      };
    } catch (err: any) {
      setError("Failed to load offers " + err);
    } finally {
      setLoading(false);
    }
  };

  const data =
    selectedTab === "Flight"
      ? offers
      : hotelOffers.length > 0
      ? hotelOffers
      : [];

  const itemsPerSlide =
    typeof window !== "undefined" && window.innerWidth >= 1024
      ? 6
      : typeof window !== "undefined" && window.innerWidth >= 768
      ? 4
      : 2;
  const totalSlides = Math.ceil(data.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentSlide(0);
  };

  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return data.slice(startIndex, startIndex + itemsPerSlide);
  };

  const OfferCard = ({ offer }: { offer: any }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={offer.image}
          alt={`${offer.from} to ${offer.to}`}
          className="w-full h-24 sm:h-28 object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {offer.type}
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs">
          {offer.airlineIcon}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            {offer.from} → {offer.to}
          </h3>
        </div>
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Pay Now:</p>
          <p className="font-bold text-lg sm:text-xl text-gray-900">
            {formatCurrency(offer.payNow, offer.currency)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-1.5 rounded">
              <span className="text-purple-600 font-bold text-xs">
                {formatCurrency(offer.installment, offer.currency)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              router.push(`/flights/${offer.id}`);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-md"
            title="View Offer"
          >
            View Offer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            {/* Tabs */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => handleTabChange("Flight")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedTab === "Flight"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Plane size={16} />
                Flight
              </button>
              <button
                onClick={() => handleTabChange("Hotel")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedTab === "Hotel"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Building2 size={16} />
                Hotel
              </button>
            </div>
          </div>
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-purple-50 disabled:opacity-50"
              disabled={totalSlides <= 1 || selectedTab === "Hotel"}
              title="Previous Slide"
            >
              <ChevronLeft size={20} className="text-purple-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-purple-50 disabled:opacity-50"
              title="Next Slide"
            >
              <ChevronRight size={20} className="text-purple-600" />
            </button>
          </div>
        </div>
        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-12 text-purple-600 font-semibold">
            Loading offers...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-semibold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {getCurrentSlideItems().map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelOffersSection;
