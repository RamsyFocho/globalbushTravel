"use client"
import { HeroSection } from "@/components/hero-section"
import { SearchTabs } from "@/components/search-tabs"
import { FeaturedDestinations } from "@/components/featured-destinations"
import dynamic from 'next/dynamic';

const TravelExplorer = dynamic(() => import('@/components/destinationsFeature/TravelExplorer'), {
  ssr: false,
});
import { WhyChooseUs } from "@/components/why-choose-us"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StructuredData, organizationSchema } from "@/components/structured-data"
import { generateMetadata, seoPages } from "@/lib/seo/metadata"
import TravelOffersSection from "@/components/OfferCard/TravelOffersSection"

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
        <TravelOffersSection/>
        <TravelExplorer/>
        <WhyChooseUs />
        <TestimonialsSection />
      </div>
    </>
  )
}
