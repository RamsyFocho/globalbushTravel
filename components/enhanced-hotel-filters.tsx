"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface HotelFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void
  className?: string
}

export function EnhancedHotelFilters({ onFiltersChange, className = "" }: HotelFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])

  const amenities = [
    { id: "WiFi", name: "Free WiFi", count: 45 },
    { id: "Pool", name: "Swimming Pool", count: 23 },
    { id: "Spa", name: "Spa", count: 12 },
    { id: "Gym", name: "Fitness Center", count: 34 },
    { id: "Restaurant", name: "Restaurant", count: 38 },
    { id: "Parking", name: "Free Parking", count: 28 },
    { id: "Airport Shuttle", name: "Airport Shuttle", count: 19 },
    { id: "Business Center", name: "Business Center", count: 15 },
  ]

  const propertyTypes = [
    { id: "hotel", name: "Hotel", count: 32 },
    { id: "resort", name: "Resort", count: 8 },
    { id: "apartment", name: "Apartment", count: 15 },
    { id: "guesthouse", name: "Guest House", count: 12 },
  ]

  const updateFilters = () => {
    const filters: Record<string, any> = {}

    if (priceRange[0] > 0 || priceRange[1] < 500) {
      filters.price = { min: priceRange[0], max: priceRange[1] }
    }

    if (selectedAmenities.length > 0) {
      filters.amenities = selectedAmenities
    }

    if (selectedRatings.length > 0) {
      filters.rating = selectedRatings
    }

    if (selectedPropertyTypes.length > 0) {
      filters.propertyType = selectedPropertyTypes
    }

    onFiltersChange(filters)
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const newSelected = checked ? [...selectedAmenities, amenityId] : selectedAmenities.filter((id) => id !== amenityId)
    setSelectedAmenities(newSelected)
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    const newSelected = checked ? [...selectedRatings, rating] : selectedRatings.filter((r) => r !== rating)
    setSelectedRatings(newSelected)
  }

  const handlePropertyTypeChange = (typeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedPropertyTypes, typeId]
      : selectedPropertyTypes.filter((id) => id !== typeId)
    setSelectedPropertyTypes(newSelected)
  }

  const clearAllFilters = () => {
    setPriceRange([0, 500])
    setSelectedAmenities([])
    setSelectedRatings([])
    setSelectedPropertyTypes([])
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 500) count++
    if (selectedAmenities.length > 0) count++
    if (selectedRatings.length > 0) count++
    if (selectedPropertyTypes.length > 0) count++
    return count
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-grassland-100 text-grassland-700 dark:bg-grassland-900 dark:text-grassland-300"
            >
              {getActiveFilterCount()} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price per Night</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={25} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <Button size="sm" onClick={updateFilters} className="w-full">
              Apply Price Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Star Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Star Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                />
                <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer">
                  <div className="flex">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm">& up</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                />
                <Label htmlFor={amenity.id} className="flex-1 cursor-pointer text-sm">
                  {amenity.name}
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">({amenity.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={selectedPropertyTypes.includes(type.id)}
                  onCheckedChange={(checked) => handlePropertyTypeChange(type.id, checked as boolean)}
                />
                <Label htmlFor={type.id} className="flex-1 cursor-pointer text-sm">
                  {type.name}
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">({type.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apply Filters Button */}
      <Button onClick={updateFilters} className="w-full bg-grassland-600 hover:bg-grassland-700">
        Apply All Filters
      </Button>
    </div>
  )
}
