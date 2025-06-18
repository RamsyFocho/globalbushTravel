import type { Metadata } from "next"

export interface SEOData {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  structuredData?: any
}

export function generateMetadata(seoData: SEOData): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    canonical: seoData.canonical ? `${baseUrl}${seoData.canonical}` : undefined,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonical ? `${baseUrl}${seoData.canonical}` : baseUrl,
      siteName: "Global Bush Travel",
      images: seoData.ogImage
        ? [
            {
              url: seoData.ogImage,
              width: 1200,
              height: 630,
              alt: seoData.title,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export const seoPages = {
  home: {
    title: "Global Bush Travel - Your Gateway to the World | Book Flights, Hotels & Packages",
    description:
      "Discover amazing destinations with Global Bush Travel. Book flights, hotels, holiday packages, visa assistance, and airport transfers. Your trusted travel partner since 2020.",
    keywords:
      "travel booking, flights, hotels, holiday packages, visa assistance, airport transfers, travel agency, Nigeria travel, international flights",
    canonical: "/",
  },
  flights: {
    title: "Flight Booking - Compare & Book Cheap Flights | Global Bush Travel",
    description:
      "Find and book cheap flights to destinations worldwide. Compare prices from top airlines, enjoy flexible booking options, and get the best deals on international and domestic flights.",
    keywords:
      "cheap flights, flight booking, airline tickets, international flights, domestic flights, flight deals, compare flights",
    canonical: "/flights",
  },
  hotels: {
    title: "Hotel Booking - Find & Book Hotels Worldwide | Global Bush Travel",
    description:
      "Book hotels worldwide with Global Bush Travel. Find the best hotel deals, compare prices, read reviews, and enjoy free cancellation on most bookings.",
    keywords:
      "hotel booking, cheap hotels, hotel deals, accommodation, hotel reservations, luxury hotels, budget hotels",
    canonical: "/hotels",
  },
  packages: {
    title: "Holiday Packages - All-Inclusive Travel Deals | Global Bush Travel",
    description:
      "Discover amazing holiday packages and travel deals. All-inclusive packages with flights, hotels, meals, and tours. Create unforgettable memories with our curated travel experiences.",
    keywords: "holiday packages, travel packages, vacation deals, all-inclusive holidays, tour packages, travel deals",
    canonical: "/packages",
  },
  visa: {
    title: "Visa Services - Professional Visa Assistance | Global Bush Travel",
    description:
      "Get professional visa assistance for your travel needs. Our experts help with visa applications, document preparation, and consultation services for all destinations.",
    keywords: "visa services, visa assistance, visa application, travel visa, passport services, visa consultation",
    canonical: "/visa",
  },
  transfers: {
    title: "Airport Transfers - Reliable Transportation Services | Global Bush Travel",
    description:
      "Book reliable airport transfer services. Professional drivers, comfortable vehicles, and competitive prices for airport pickups and drop-offs worldwide.",
    keywords:
      "airport transfers, airport taxi, airport shuttle, transportation services, airport pickup, private transfers",
    canonical: "/transfers",
  },
}
