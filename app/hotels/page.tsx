import type { Metadata } from "next"
import { EnhancedHotelSearchResults } from "@/components/enhanced-hotel-search-results"
import { EnhancedHotelFilters } from "@/components/enhanced-hotel-filters"
import { Breadcrumb } from "@/components/breadcrumb"
import { StructuredData, organizationSchema } from "@/components/structured-data"
import { generateMetadata, seoPages } from "@/lib/seo/metadata"
import { HotelSearchWithFilters } from "@/components/hotel-search-with-filters"

export const metadata: Metadata = generateMetadata(seoPages.hotels)

export default function HotelsPage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hotel Search Results</h1>
          <p className="text-gray-600 dark:text-gray-400">Lagos • Dec 15 - Dec 18, 2024 • 2 Guests, 1 Room</p>
        </div>

        <HotelSearchWithFilters />
      </div>
    </>
  )
}
