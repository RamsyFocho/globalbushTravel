"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell, SpadeIcon as Spa } from "lucide-react"
import Image from "next/image"
import { DataSortFilter } from "@/components/data-sort-filter"
import { hotelSortOptions, sortData, filterData } from "@/lib/utils/sorting"
import { toast } from "react-toastify"

interface Hotel {
  id: string
  name: string
  address: string
  city: string
  country: string
  rating: number
  price: number
  currency: string
  images: string[]
  amenities: string[]
  description: string
  reviews: {
    count: number
    average: number
  }
  distance: string
  distanceValue: number // for sorting
  coordinates: {
    lat: number
    lng: number
  }
}

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Luxury Hotel Lagos",
    address: "123 Victoria Island, Lagos",
    city: "Lagos",
    country: "Nigeria",
    rating: 5,
    price: 299,
    currency: "USD",
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
    description: "Experience luxury at its finest with our premium accommodations and world-class amenities.",
    reviews: {
      count: 1247,
      average: 4.8,
    },
    distance: "2.1 km from city center",
    distanceValue: 2.1,
    coordinates: { lat: 6.5244, lng: 3.3792 },
  },
  {
    id: "2",
    name: "Business Center Hotel",
    address: "456 Ikoyi Business District, Lagos",
    city: "Lagos",
    country: "Nigeria",
    rating: 4,
    price: 189,
    currency: "USD",
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["WiFi", "Business Center", "Restaurant", "Gym", "Conference Rooms"],
    description: "Perfect for business travelers with modern facilities and convenient location.",
    reviews: {
      count: 892,
      average: 4.5,
    },
    distance: "1.5 km from city center",
    distanceValue: 1.5,
    coordinates: { lat: 6.5344, lng: 3.3892 },
  },
  {
    id: "3",
    name: "Boutique Comfort Inn",
    address: "789 Mainland Lagos",
    city: "Lagos",
    country: "Nigeria",
    rating: 3,
    price: 129,
    currency: "USD",
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["WiFi", "Restaurant", "Parking", "Airport Shuttle"],
    description: "Comfortable and affordable accommodation with friendly service.",
    reviews: {
      count: 456,
      average: 4.2,
    },
    distance: "3.2 km from city center",
    distanceValue: 3.2,
    coordinates: { lat: 6.5144, lng: 3.3692 },
  },
  {
    id: "4",
    name: "Seaside Resort & Spa",
    address: "Ocean View Drive, Lagos",
    city: "Lagos",
    country: "Nigeria",
    rating: 5,
    price: 450,
    currency: "USD",
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Water Sports"],
    description: "Luxury beachfront resort with stunning ocean views and world-class spa facilities.",
    reviews: {
      count: 2156,
      average: 4.9,
    },
    distance: "5.8 km from city center",
    distanceValue: 5.8,
    coordinates: { lat: 6.4844, lng: 3.3192 },
  },
]

const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Pool: Waves,
  Restaurant: Utensils,
  Parking: Car,
  Gym: Dumbbell,
  Spa: Spa,
}

interface EnhancedHotelSearchResultsProps {
  filters?: Record<string, any>
}

export function EnhancedHotelSearchResults({ filters = {} }: EnhancedHotelSearchResultsProps) {
  const [currentSort, setCurrentSort] = useState("price-asc")
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(filters)

  const filteredAndSortedHotels = useMemo(() => {
    const filtered = filterData(mockHotels, activeFilters)
    const sortOption = hotelSortOptions.find((option) => option.value === currentSort)
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

  const handleBookHotel = (hotel: Hotel) => {
    toast.success(`${hotel.name} selected! Redirecting to booking...`)
  }

  return (
    <div className="space-y-6">
      <DataSortFilter
        sortOptions={hotelSortOptions}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        activeFilters={activeFilters}
        onFilterClear={handleFilterClear}
        onClearAllFilters={handleClearAllFilters}
        resultCount={filteredAndSortedHotels.length}
      />

      <div className="space-y-6">
        {filteredAndSortedHotels.map((hotel) => (
          <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Hotel Image */}
                <div className="lg:col-span-4 relative h-64 lg:h-auto">
                  <Image
                    src={hotel.images[0] || "/placeholder.svg"}
                    alt={hotel.name}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600">
                      {hotel.rating} Star{hotel.rating > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{hotel.reviews.average}</span>
                  </div>
                </div>

                {/* Hotel Details */}
                <div className="lg:col-span-5 p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.address}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                      <span className="text-sm">{hotel.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(hotel.reviews.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{hotel.reviews.average}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({hotel.reviews.count} reviews)</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const IconComponent = amenityIcons[amenity]
                      return (
                        <div
                          key={amenity}
                          className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400"
                        >
                          {IconComponent && <IconComponent className="h-3 w-3" />}
                          <span>{amenity}</span>
                        </div>
                      )
                    })}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-grassland-600 dark:text-grassland-400">
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Book */}
                <div className="lg:col-span-3 p-6 border-l bg-gray-50 dark:bg-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-grassland-600 dark:text-grassland-400">${hotel.price}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">includes taxes & fees</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-grassland-600 hover:bg-grassland-700"
                        onClick={() => handleBookHotel(hotel)}
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-grassland-600 text-grassland-600 hover:bg-grassland-600 hover:text-white dark:border-grassland-400 dark:text-grassland-400"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-green-600 font-medium">Free cancellation</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">until 24 hours before check-in</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedHotels.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hotels found</h3>
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
