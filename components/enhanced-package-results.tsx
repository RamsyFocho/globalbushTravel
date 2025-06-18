"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Users } from "lucide-react"
import { DataSortFilter } from "@/components/data-sort-filter"
import { packageSortOptions, sortData, filterData } from "@/lib/utils/sorting"
import { toast } from "react-toastify"

interface Package {
  id: string
  title: string
  destination: string
  duration: string
  durationDays: number
  price: number
  image: string
  rating: number
  reviews: number
  inclusions: string[]
  description: string
  maxGuests: number
  category: string
}

const mockPackages: Package[] = [
  {
    id: "1",
    title: "Dubai Desert Safari & City Tour",
    destination: "Dubai, UAE",
    duration: "5 Days, 4 Nights",
    durationDays: 5,
    price: 1299,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    reviews: 234,
    inclusions: ["Flights", "Hotels", "Meals", "Tours", "Transfers"],
    description: "Experience the magic of Dubai with desert adventures and city exploration.",
    maxGuests: 8,
    category: "Adventure",
  },
  {
    id: "2",
    title: "Paris Romance Package",
    destination: "Paris, France",
    duration: "7 Days, 6 Nights",
    durationDays: 7,
    price: 1899,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    reviews: 456,
    inclusions: ["Flights", "Hotels", "Breakfast", "Seine Cruise", "Transfers"],
    description: "Fall in love with the City of Light on this romantic getaway.",
    maxGuests: 2,
    category: "Romance",
  },
  {
    id: "3",
    title: "Tokyo Cultural Experience",
    destination: "Tokyo, Japan",
    duration: "6 Days, 5 Nights",
    durationDays: 6,
    price: 1599,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    reviews: 189,
    inclusions: ["Flights", "Hotels", "Cultural Tours", "Traditional Meals"],
    description: "Immerse yourself in Japanese culture and modern city life.",
    maxGuests: 6,
    category: "Cultural",
  },
  {
    id: "4",
    title: "Safari Adventure Kenya",
    destination: "Nairobi, Kenya",
    duration: "8 Days, 7 Nights",
    durationDays: 8,
    price: 2299,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    reviews: 312,
    inclusions: ["Flights", "Safari Lodge", "All Meals", "Game Drives", "Park Fees"],
    description: "Witness the Great Migration and explore Kenya's stunning wildlife.",
    maxGuests: 12,
    category: "Wildlife",
  },
]

export function EnhancedPackageResults() {
  const [currentSort, setCurrentSort] = useState("price-asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  const filteredAndSortedPackages = useMemo(() => {
    const filtered = filterData(mockPackages, activeFilters)
    const sortOption = packageSortOptions.find((option) => option.value === currentSort)
    return sortOption ? sortData(filtered, sortOption) : filtered
  }, [activeFilters, currentSort])

  const handleFilterClear = (filterKey: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[filterKey]
    setActiveFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setActiveFilters({})
  }

  const handleBookPackage = (pkg: Package) => {
    toast.success(`${pkg.title} selected! Redirecting to booking...`)
  }

  return (
    <div className="space-y-6">
      <DataSortFilter
        sortOptions={packageSortOptions}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        activeFilters={activeFilters}
        onFilterClear={handleFilterClear}
        onClearAllFilters={handleClearAllFilters}
        resultCount={filteredAndSortedPackages.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPackages.map((pkg) => (
          <Card key={pkg.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={pkg.image || "/placeholder.svg"}
                alt={pkg.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{pkg.rating}</span>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-grassland-600">{pkg.category}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{pkg.destination}</span>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{pkg.title}</h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{pkg.duration}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Up to {pkg.maxGuests}</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{pkg.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {pkg.inclusions.slice(0, 3).map((inclusion) => (
                  <Badge
                    key={inclusion}
                    variant="secondary"
                    className="text-xs bg-grassland-100 text-grassland-700 dark:bg-grassland-900 dark:text-grassland-300"
                  >
                    {inclusion}
                  </Badge>
                ))}
                {pkg.inclusions.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-grassland-100 text-grassland-700 dark:bg-grassland-900 dark:text-grassland-300"
                  >
                    +{pkg.inclusions.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-grassland-600 dark:text-grassland-400 text-xl">${pkg.price}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
                </div>
                <Button
                  size="sm"
                  className="bg-grassland-600 hover:bg-grassland-700"
                  onClick={() => handleBookPackage(pkg)}
                >
                  Book Now
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">({pkg.reviews} reviews)</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedPackages.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No packages found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters to find more options.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleClearAllFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
