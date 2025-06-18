"use client"

import { useState } from "react"
import { EnhancedHotelSearchResults } from "@/components/enhanced-hotel-search-results"
import { EnhancedHotelFilters } from "@/components/enhanced-hotel-filters"

export function HotelSearchWithFilters() {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    console.log("Hotel filters changed:", newFilters)
    setFilters(newFilters)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <EnhancedHotelFilters onFiltersChange={handleFiltersChange} />
      </div>
      <div className="lg:col-span-3">
        <EnhancedHotelSearchResults />
      </div>
    </div>
  )
} 