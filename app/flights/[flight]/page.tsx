"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plane,
  Clock,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Shield,
} from "lucide-react";

// Mock flight offer data for demonstration
const mockFlightOffer = {
  id: "off_123456789",
  airline: {
    name: "Air France",
    iata_code: "AF",
    logo_url: "https://static.duffel.com/airlines/logo/AF.png",
  },
  total_amount: "875.50",
  total_currency: "EUR",
  cabin_class: "economy",
  passenger_count: 1,
  slices: [
    {
      id: "sli_outbound",
      origin: {
        iata_code: "DLA",
        name: "Douala International Airport",
        city_name: "Douala",
        country_name: "Cameroon",
      },
      destination: {
        iata_code: "CDG",
        name: "Charles de Gaulle Airport",
        city_name: "Paris",
        country_name: "France",
      },
      departure_datetime: "2025-07-15T14:30:00",
      arrival_datetime: "2025-07-16T06:45:00",
      duration: "16h 15m",
      segments: [
        {
          aircraft: "Boeing 777",
          flight_number: "AF 482",
          duration: "6h 30m",
        },
      ],
    },
  ],
  baggage: {
    carry_on: "1 x 8kg",
    checked: "1 x 23kg included",
  },
  conditions: {
    refund_before_departure: "Non-refundable",
    change_before_departure: "Changes allowed with fee (€150)",
  },
};

const FlightOfferDetails = ({params}:{params:{flight:string}}) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  // Mock offer ID - in real app, this would come from URL params
  const offerId = decodeURIComponent(params.flight) || "off_123456789";
  console.log(offerId);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/flights/offer/${offerId}`);
        if (!res.ok) throw new Error("Failed to fetch offer");
        const data = await res.json();
        setOffer(data);
      } catch (err) {
        setOffer(mockFlightOffer);
        setError("Failed to load flight offer");
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleBack = () => {
    // In real app, use React Router: navigate(-1) or navigate('/offers')
    window.history.back();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-8"></div>

            {/* Header skeleton */}
            <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div>
                    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-purple-200 rounded w-40"></div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-white rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-40 bg-white rounded-lg"></div>
                  <div className="h-40 bg-white rounded-lg"></div>
                </div>
              </div>
              <div className="h-96 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Flight
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!offer) return null;

  const slice = offer.slices[0];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to flight search</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-6">
                <div className="bg-purple-50 p-4 rounded-lg border">
                  {!imageError ? (
                    <img
                      src={offer.airline.logo_url}
                      alt={offer.airline.name}
                      className="w-16 h-16 object-contain"
                      onError={handleImageError}
                    />
                  ) : (
                    <Plane className="w-16 h-16 text-purple-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {offer.airline.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Flight {slice.segments[0].flight_number} •{" "}
                    {slice.segments[0].aircraft}
                  </p>
                </div>
              </div>
              <div className="bg-purple-600 text-white px-6 py-3 rounded-lg">
                <span className="text-2xl font-bold">
                  €{offer.total_amount}
                </span>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between relative">
                {/* Departure */}
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatTime(slice.departure_datetime)}
                  </div>
                  <div className="text-purple-600 font-semibold text-lg mb-1">
                    {slice.origin.iata_code}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {slice.origin.city_name}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {formatDate(slice.departure_datetime)}
                  </div>
                </div>

                {/* Flight Path */}
                <div className="flex-1 flex items-center justify-center relative mx-8">
                  <div className="absolute w-full h-px bg-purple-300 top-1/2"></div>
                  <div className="bg-purple-600 rounded-full p-3 relative z-10">
                    <Plane className="w-6 h-6 text-white transform rotate-90" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-purple-600 font-medium text-sm">
                      {slice.duration}
                    </div>
                    <div className="text-gray-500 text-xs">Direct flight</div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatTime(slice.arrival_datetime)}
                  </div>
                  <div className="text-purple-600 font-semibold text-lg mb-1">
                    {slice.destination.iata_code}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {slice.destination.city_name}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {formatDate(slice.arrival_datetime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Content - Flight Information */}
          <div className="lg:col-span-3 space-y-6">
            {/* Flight Details Panel */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Plane className="w-6 h-6 mr-3 text-purple-600" />
                  Flight Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Departure Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-purple-600 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold uppercase tracking-wide text-sm">
                        Departure
                      </span>
                    </div>
                    <div className="pl-7">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatTime(slice.departure_datetime)}
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <div className="font-semibold">{slice.origin.name}</div>
                        <div className="text-sm">
                          {slice.origin.city_name}, {slice.origin.country_name}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(slice.departure_datetime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrival Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-purple-600 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold uppercase tracking-wide text-sm">
                        Arrival
                      </span>
                    </div>
                    <div className="pl-7">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatTime(slice.arrival_datetime)}
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <div className="font-semibold">
                          {slice.destination.name}
                        </div>
                        <div className="text-sm">
                          {slice.destination.city_name},{" "}
                          {slice.destination.country_name}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(slice.arrival_datetime)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Clock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-semibold text-gray-900">
                        {slice.duration}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Plane className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Aircraft</div>
                      <div className="font-semibold text-gray-900">
                        {slice.segments[0].aircraft}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Cabin</div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {offer.cabin_class}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Passengers</div>
                      <div className="font-semibold text-gray-900">
                        {offer.passenger_count}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Baggage Information */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-3 text-purple-600" />
                    Baggage Allowance
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Carry-on bag</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {offer.baggage.carry_on}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Checked bag</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {offer.baggage.checked}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-purple-600" />
                    Booking Conditions
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Refund Policy
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {offer.conditions.refund_before_departure}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Change Policy
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {offer.conditions.change_before_departure}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Booking Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Base fare (1 passenger)
                    </span>
                    <span className="font-medium">
                      €{(parseFloat(offer.total_amount) * 0.78).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Taxes and fees</span>
                    <span className="font-medium">
                      €{(parseFloat(offer.total_amount) * 0.15).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">
                      €{(parseFloat(offer.total_amount) * 0.07).toFixed(2)}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      €{offer.total_amount}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center group mb-4">
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Price includes all mandatory taxes and fees
                  </p>
                  <p className="text-xs text-gray-500">
                    No hidden charges • Instant confirmation
                  </p>
                </div>
              </div>

              {/* Customer Support */}
              <div className="p-6 bg-gray-50 rounded-b-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Need assistance?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our travel experts are here to help you 24/7
                </p>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-800 transition-colors">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightOfferDetails;
