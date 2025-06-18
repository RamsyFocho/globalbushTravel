"use client"

import { useState, useEffect, useCallback } from "react"
import { EnhancedFlightSearchResults } from "@/components/enhanced-flight-search-results"
import { EnhancedFlightFilters } from "@/components/enhanced-flight-filters"
import { FlightSearchForm } from "@/components/flight-search-form"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FlightSearchParams {
  from?: string
  to?: string
  departureDate?: string
  returnDate?: string
  passengers?: number
  tripType?: string
  cabinClass?: string
}

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({})
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showSearchForm, setShowSearchForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Check if user came from homepage with search params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hasSearchParams = urlParams.has("from") || urlParams.has("to") || urlParams.has("date")

    if (!hasSearchParams) {
      setShowSearchForm(true)
    } else {
      setSearchParams({
        from: urlParams.get("from") || "",
        to: urlParams.get("to") || "",
        departureDate: urlParams.get("date") || "",
        returnDate: urlParams.get("returnDate") || "",
        passengers: Number(urlParams.get("passengers")) || 1,
        tripType: urlParams.get("tripType") || "round-trip",
        cabinClass: urlParams.get("cabinClass") || "economy",
      })
    }
  }, [])

  const handleSearch = useCallback((newSearchParams: FlightSearchParams) => {
    setSearchParams(newSearchParams)
    setShowSearchForm(false)

    // Update URL with search params
    const urlParams = new URLSearchParams()
    Object.entries(newSearchParams).forEach(([key, value]) => {
      if (value) urlParams.set(key, value.toString())
    })

    window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
  }, [])

  // Memoized filter change handler to prevent infinite loops
  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters)
  }, [])

  const getSearchSummary = () => {
    if (!searchParams.from || !searchParams.to) return "Please enter your flight details to search"

    const cabinClassLabels: Record<string, string> = {
      economy: "Economy",
      premium_economy: "Premium Economy", 
      business: "Business",
      first: "First Class"
    }

    const cabinClassLabel = cabinClassLabels[searchParams.cabinClass || "economy"] || "Economy"

    return `${searchParams.from} → ${searchParams.to} • ${searchParams.departureDate} • ${searchParams.passengers} Passenger${searchParams.passengers !== 1 ? "s" : ""} • ${cabinClassLabel}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Flight Search</h1>
        <p className="text-gray-600 dark:text-gray-400">{getSearchSummary()}</p>
      </div>

      {/* Search Form Section */}
      {(showSearchForm || !searchParams.from || !searchParams.to) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Flights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlightSearchForm onSearch={handleSearch} initialValues={searchParams} />
          </CardContent>
        </Card>
      )}

      {/* Modify Search Button */}
      {searchParams.from && searchParams.to && !showSearchForm && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowSearchForm(!showSearchForm)}
            className="border-grassland-600 text-grassland-600 hover:bg-grassland-50 dark:border-grassland-400 dark:text-grassland-400 dark:hover:bg-grassland-900"
          >
            <Search className="h-4 w-4 mr-2" />
            Modify Search
          </Button>
        </div>
      )}

      {/* Results Section */}
      {searchParams.from && searchParams.to && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mb-6">
                  <EnhancedFlightFilters onFiltersChange={handleFiltersChange} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <EnhancedFlightFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <EnhancedFlightSearchResults filters={filters} searchParams={searchParams} />
          </div>
        </div>
      )}
    </div>
  )
}
