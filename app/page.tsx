// "use client"
import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { SearchTabs } from "@/components/search-tabs"
import { FeaturedDestinations } from "@/components/featured-destinations"
import TravelExplorer from "@/components/destinationsFeature/TravelExplorer"
import { WhyChooseUs } from "@/components/why-choose-us"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StructuredData, organizationSchema } from "@/components/structured-data"
import { generateMetadata, seoPages } from "@/lib/seo/metadata"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://globalbushtravel.com"

export const metadata: Metadata = {
  title: "GlobalBushTravel - Your Trusted Travel Partner",
  description: "Book flights, hotels, and vacation packages with GlobalBushTravel. Your trusted partner for global travel solutions.",
  keywords: ["travel", "flights", "hotels", "vacation packages", "booking"],
  openGraph: {
    title: "GlobalBushTravel - Your Trusted Travel Partner",
    description: "Book flights, hotels, and vacation packages with GlobalBushTravel.",
    url: baseUrl,
    siteName: "GlobalBushTravel",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "GlobalBushTravel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalBushTravel - Your Trusted Travel Partner",
    description: "Book flights, hotels, and vacation packages with GlobalBushTravel.",
    images: [`${baseUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
  },
  other: {
    "google-site-verification": "your-verification-code",
    urlTemplate: `${baseUrl}/search?q={search_term_string}`,
  },
}

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Global Bush Travel",
  url: "https://globalbushtravel.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://globalbushtravel.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

export default function HomePage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={homePageSchema} />
      <div className="flex flex-col">
        <HeroSection />
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <SearchTabs />
        </div>
        <FeaturedDestinations />
        <TravelExplorer/>
        <WhyChooseUs />
        <TestimonialsSection />
      </div>
    </>
  )
}
