import Script from "next/script"

interface StructuredDataProps {
  data: any
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "GlobalBushTravel",
  description: "Your trusted partner for global travel solutions including flights, hotels, and vacation packages.",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-800-123-4567",
    contactType: "customer service",
    availableLanguage: ["English"],
    areaServed: "NG",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "NG",
    addressLocality: "Lagos",
    addressRegion: "Lagos State",
  },
  sameAs: [
    "https://facebook.com/globalbushtravel",
    "https://twitter.com/globalbushtravel",
    "https://instagram.com/globalbushtravel",
  ],
}

export function generateFlightSchema(flight: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Flight",
    flightNumber: flight.flightNumber,
    airline: {
      "@type": "Airline",
      name: flight.airline,
      iataCode: flight.airline.substring(0, 2),
    },
    departureAirport: {
      "@type": "Airport",
      name: flight.departure.city,
      iataCode: flight.departure.airport,
    },
    arrivalAirport: {
      "@type": "Airport",
      name: flight.arrival.city,
      iataCode: flight.arrival.airport,
    },
    departureTime: flight.departure.date + "T" + flight.departure.time,
    arrivalTime: flight.arrival.date + "T" + flight.arrival.time,
    offers: {
      "@type": "Offer",
      price: flight.price,
      priceCurrency: flight.currency,
      availability: "https://schema.org/InStock",
    },
  }
}

export function generateHotelSchema(hotel: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressCountry: hotel.country,
    },
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.rating,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.reviews.average,
      reviewCount: hotel.reviews.count,
    },
    priceRange: "$" + hotel.price,
    amenityFeature: hotel.amenities.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
    })),
  }
}
