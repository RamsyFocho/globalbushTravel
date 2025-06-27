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
import { useRouter } from "next/navigation";
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

const FlightOfferDetails = ({ params }: { params: Promise<{ flight: string }> }) => {
  const {flight} = React.use(params);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleImageError = () => {
    setImageError(true);
  };

  const [flightParam, setFlightParam] = useState<string | null>(null);

  const offerId = decodeURIComponent(flight) || "off_123456789";
  console.log(offerId);

  useEffect(() => {
    // if (!flightParam) return;
    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/flights/offer/${offerId}`);
        if (!res.ok) throw new Error("Failed to fetch offer");
        const data = await res.json();
        setOffer(data.data ? data.data : data);
        setLoading(false);
      } catch (err) {
        setOffer(mockFlightOffer);
        setError("Failed to load flight offer");
        setLoading(false);
      }
    };
    fetchOffer();
  }, [offerId, flightParam]);

  // Defensive: fallback for Duffel/Mock structure
  if (!offer) return null;
  const slice = offer.slices ? offer.slices[0] : null;
  const owner = offer.owner || offer.airline || {};
  const conditions = offer.conditions || {};

  // Helper for Duffel's conditions object
  function formatCondition(obj: any, label: string) {
    if (!obj) return "N/A";
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      if ('allowed' in obj) {
        if (obj.allowed === true) {
          if (obj.penalty_amount && obj.penalty_currency) {
            return `${label} allowed with a penalty of ${obj.penalty_amount} ${obj.penalty_currency}`;
          }
          return `${label} allowed`;
        } else {
          return `${label} not allowed`;
        }
      }
      return JSON.stringify(obj);
    }
    return String(obj);
  }
  const refundPolicy = formatCondition(conditions.refund_before_departure, 'Refund');
  const changePolicy = formatCondition(conditions.change_before_departure, 'Change');

  // Defensive date formatting (support multiple field names)
  function safeFormatDate(dateString: any, fallback?: any) {
    const val = dateString || fallback;
    if (!val) return "N/A";
    const date = new Date(val);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function safeFormatTime(dateString: any, fallback?: any) {
    const val = dateString || fallback;
    if (!val) return "N/A";
    const date = new Date(val);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  
 const handleBack = ()=>{
  router.push("/flights");
 }
  // Helper to render airport info with logo
  function renderAirport(airport: any, label: string) {
    if (!airport) return null;
    // Try to get logo from Duffel static if IATA code exists
    const logoUrl = airport.iata_code
      ? `https://content.duffel.com/air/airports/square_logo/${airport.iata_code}.png`
      : null;
    return (
      <div className="flex items-center gap-3 mb-1">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={airport.iata_code}
            className="w-8 h-8 object-contain border rounded bg-white"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        )}
        <div>
          <div className="font-semibold text-purple-700 text-base">{label}: {airport.iata_code}</div>
          <div className="text-xs text-gray-600">{airport.name} ({airport.icao_code})</div>
          <div className="text-xs text-gray-500">{airport.city_name}, {airport.iata_country_code} | TZ: {airport.time_zone}</div>
          <div className="text-xs text-gray-400">Lat: {airport.latitude}, Lon: {airport.longitude}</div>
        </div>
      </div>
    );
  }

  // Helper to format ISO 8601 durations (e.g., PT7H43M)
  function formatISODuration(duration: string) {
    if (!duration) return "N/A";
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    const [, hours, minutes] = match;
    return `${hours ? hours + 'h ' : ''}${minutes ? minutes + 'm' : ''}`.trim();
  }

  // Helper to render a segment (with full airport info and logos)
  function renderSegment(segment: any, idx: number) {
    // Defensive: support both Duffel and mock field names
    const dep = segment.departing_at || segment.departure_datetime;
    const arr = segment.arriving_at || segment.arrival_datetime;
    return (
      <div key={segment.id || idx} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-lg text-purple-700">
            {segment.origin?.iata_code} → {segment.destination?.iata_code}
          </div>
          <div className="text-gray-500 text-sm">
            {safeFormatDate(dep)} {safeFormatTime(dep)}
            &nbsp;–&nbsp;
            {safeFormatDate(arr)} {safeFormatTime(arr)}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
          <div>Flight: {segment.marketing_carrier_flight_number || segment.operating_carrier_flight_number || segment.flight_number}</div>
          <div>Carrier: {segment.marketing_carrier?.name || segment.operating_carrier?.name}</div>
          <div>Duration: {formatISODuration(segment.duration)}</div>
          <div>Distance: {segment.distance ? `${parseFloat(segment.distance).toFixed(0)} km` : 'N/A'}</div>
          <div>Origin Terminal: {segment.origin_terminal || 'N/A'}</div>
          <div>Destination Terminal: {segment.destination_terminal || 'N/A'}</div>
        </div>
        {/* Airport info with logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          {renderAirport(segment.origin, 'Origin')}
          {renderAirport(segment.destination, 'Destination')}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Amenities: WiFi: {segment.passengers?.[0]?.cabin?.amenities?.wifi?.available ? 'Yes' : 'No'},
          Power: {segment.passengers?.[0]?.cabin?.amenities?.power?.available ? 'Yes' : 'No'}
        </div>
      </div>
    );
  }

  // Helper to render passengers
  function renderPassengers(passengers: any[]) {
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Passengers</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {passengers.map((p, i) => (
            <li key={p.id || i}>
              {p.type} {p.given_name || ''} {p.family_name || ''} (ID: {p.id})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Helper to render payment requirements
  function renderPayment(payment: any) {
    if (!payment) return null;
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Payment Requirements</h4>
        <div className="text-gray-700 text-sm">
          Requires instant payment: {payment.requires_instant_payment ? 'Yes' : 'No'}<br />
          Price guarantee expires: {safeFormatDate(payment.price_guarantee_expires_at)}<br />
          Payment required by: {safeFormatDate(payment.payment_required_by)}
        </div>
      </div>
    );
  }

  // Helper to render supported documents
  function renderSupportedDocs(docs: any[]) {
    if (!docs?.length) return null;
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Supported Passenger Identity Documents</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {docs.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>
    );
  }

  // Helper to render available services
  function renderServices(services: any[]) {
    if (!services?.length) return null;
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Available Services</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {services.map((s, i) => <li key={i}>{JSON.stringify(s)}</li>)}
        </ul>
      </div>
    );
  }

  // Helper to render loyalty programmes
  function renderLoyalty(loyalty: any[]) {
    if (!loyalty?.length) return null;
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Supported Loyalty Programmes</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {loyalty.map((l, i) => <li key={i}>{JSON.stringify(l)}</li>)}
        </ul>
      </div>
    );
  }

  // Helper to render private fares
  function renderPrivateFares(fares: any[]) {
    if (!fares?.length) return null;
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Private Fares</h4>
        <ul className="list-disc pl-6 text-gray-700">
          {fares.map((f, i) => <li key={i}>{JSON.stringify(f)}</li>)}
        </ul>
      </div>
    );
  }

  // Helper to render slice segments (show all segment/airport info)
  function renderSlices(slices: any[]) {
    if (!slices?.length) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Flight Segments</h3>
        {slices.map((slice, i) => (
          <div key={slice.id || i} className="mb-8">
            <div className="font-semibold text-purple-700 mb-2">
              {slice.origin?.iata_code} → {slice.destination?.iata_code} ({slice.origin?.city_name} → {slice.destination?.city_name})
            </div>
            <div className="text-gray-600 text-sm mb-2">Duration: {formatISODuration(slice.duration || slice.duration_minutes)}</div>
            {/* Show full airport info for slice origin/destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {renderAirport(slice.origin, 'Origin')}
              {renderAirport(slice.destination, 'Destination')}
            </div>
            {slice.segments && slice.segments.map(renderSegment)}
            {/* Slice-level conditions */}
            {slice.conditions && (
              <div className="mt-2 text-xs text-gray-500">
                Change before departure: {formatCondition(slice.conditions.change_before_departure, 'Change')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 sm:mb-8 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to flight search</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 sm:mb-6">
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
                <div className="bg-purple-50 p-2 sm:p-4 rounded-lg border">
                  {!imageError ? (
                    <img
                      src={owner.logo_symbol_url || owner.logo_url}
                      alt={owner.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      onError={handleImageError}
                    />
                  ) : (
                    <Plane className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {owner.name}
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {slice && slice.segments && slice.segments[0] ? (
                      <>
                        Flight {slice.segments[0].flight_number} • {slice.segments[0].aircraft}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg w-full sm:w-auto text-center mt-4 sm:mt-0">
                <span className="text-xl sm:text-2xl font-bold">
                  {offer.total_currency ? `${offer.total_currency} ` : "€"}{offer.total_amount}
                </span>
              </div>
            </div>

            {/* Route Timeline */}
            {slice && (
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between relative gap-4 sm:gap-0">
                  {/* Departure */}
                  <div className="text-center flex-1">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {safeFormatTime(slice.departure_datetime)}
                    </div>
                    <div className="text-purple-600 font-semibold text-lg mb-1">
                      {slice.origin?.iata_code}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {slice.origin?.city_name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {safeFormatDate(slice.departure_datetime)}
                    </div>
                  </div>
                  {/* Flight Path */}
                  <div className="flex-1 flex items-center justify-center relative mx-0 sm:mx-8 my-4 sm:my-0">
                    <div className="absolute w-full h-px bg-purple-300 top-1/2 hidden sm:block"></div>
                    <div className="bg-purple-600 rounded-full p-2 sm:p-3 relative z-10">
                      <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-90" />
                    </div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center hidden sm:block">
                      <div className="text-purple-600 font-medium text-sm">
                        {slice.duration}
                      </div>
                      <div className="text-gray-500 text-xs">Direct flight</div>
                    </div>
                  </div>
                  {/* Arrival */}
                  <div className="text-center flex-1">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {safeFormatTime(slice.arrival_datetime)}
                    </div>
                    <div className="text-purple-600 font-semibold text-lg mb-1">
                      {slice.destination?.iata_code}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {slice.destination?.city_name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {safeFormatDate(slice.arrival_datetime)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Content - Flight Information */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Flight Details Panel */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <Plane className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" />
                  Flight Information
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {slice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {/* Departure Details */}
                    <div className="space-y-2 sm:space-y-4">
                      <div className="flex items-center space-x-2 text-purple-600 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm">
                          Departure
                        </span>
                      </div>
                      <div className="pl-5 sm:pl-7">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {safeFormatTime(slice.departure_datetime)}
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <div className="font-semibold">{slice.origin?.name}</div>
                          <div className="text-xs sm:text-sm">
                            {slice.origin?.city_name}, {slice.origin?.country_name}
                          </div>
                          <div className="flex items-center text-xs sm:text-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {safeFormatDate(slice.departure_datetime)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Arrival Details */}
                    <div className="space-y-2 sm:space-y-4">
                      <div className="flex items-center space-x-2 text-purple-600 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold uppercase tracking-wide text-xs sm:text-sm">
                          Arrival
                        </span>
                      </div>
                      <div className="pl-5 sm:pl-7">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {safeFormatTime(slice.arrival_datetime)}
                        </div>
                        <div className="space-y-1 text-gray-600">
                          <div className="font-semibold">{slice.destination?.name}</div>
                          <div className="text-xs sm:text-sm">
                            {slice.destination?.city_name}, {slice.destination?.country_name}
                          </div>
                          <div className="flex items-center text-xs sm:text-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {safeFormatDate(slice.arrival_datetime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Duffel-specific: show emissions, payment, etc. */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm text-gray-600">Duration</div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {slice?.duration}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm text-gray-600">Aircraft</div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {slice?.segments && slice.segments[0]?.aircraft}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm text-gray-600">Cabin</div>
                      <div className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                        {offer.cabin_class}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm text-gray-600">Passengers</div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {offer.passengers ? offer.passengers.length : offer.passenger_count}
                      </div>
                    </div>
                  </div>
                  {/* Duffel-specific: Emissions */}
                  {offer.total_emissions_kg && (
                    <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
                      <span className="font-semibold">CO₂ emissions:</span> {offer.total_emissions_kg} kg
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Additional Information Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Baggage Information */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-600" />
                    Baggage Allowance
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" />
                      <span className="text-gray-700 text-xs sm:text-base">Carry-on bag</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-xs sm:text-base">
                      {offer.baggage?.carry_on || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3" />
                      <span className="text-gray-700 text-xs sm:text-base">Checked bag</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-xs sm:text-base">
                      {offer.baggage?.checked || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-purple-600" />
                    Booking Conditions
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-4">
                  <div className="flex items-start p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-xs sm:text-base">
                        Refund Policy
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        {refundPolicy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-xs sm:text-base">
                        Change Policy
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        {changePolicy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Sidebar - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4 sm:top-6">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Booking Summary
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">
                      Base fare
                    </span>
                    <span className="font-medium">
                      {offer.base_currency ? `${offer.base_currency} ` : "€"}{offer.base_amount || offer.total_amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Taxes and fees</span>
                    <span className="font-medium">
                      {offer.tax_currency ? `${offer.tax_currency} ` : "€"}{offer.tax_amount || "-"}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      {offer.total_currency ? `${offer.total_currency} ` : "€"}{offer.total_amount}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center group mb-3 sm:mb-4 text-sm sm:text-base">
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-center space-y-1 sm:space-y-2">
                  <p className="text-xs text-gray-500">
                    Price includes all mandatory taxes and fees
                  </p>
                  <p className="text-xs text-gray-500">
                    No hidden charges • Instant confirmation
                  </p>
                </div>
              </div>
              {/* Customer Support */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-b-lg">
                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-base">
                  Need assistance?
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  Our travel experts are here to help you 24/7
                </p>
                <button className="text-purple-600 text-xs sm:text-sm font-medium hover:text-purple-800 transition-colors">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Insert new detailed sections below main summary */}
        {renderSlices(offer.slices || [])}
        {renderPassengers(offer.passengers || [])}
        {renderPayment(offer.payment_requirements)}
        {renderSupportedDocs(offer.supported_passenger_identity_document_types || [])}
        {renderServices(offer.available_services || [])}
        {renderLoyalty(offer.supported_loyalty_programmes || [])}
        {renderPrivateFares(offer.private_fares || [])}
      </div>
    </div>
  );
};

export default FlightOfferDetails;
