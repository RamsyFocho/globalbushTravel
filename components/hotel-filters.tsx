"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function HotelFilters() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const amenities = [
    { id: "wifi", name: "Free WiFi", count: 45 },
    { id: "pool", name: "Swimming Pool", count: 23 },
    { id: "spa", name: "Spa", count: 12 },
    { id: "gym", name: "Fitness Center", count: 34 },
    { id: "restaurant", name: "Restaurant", count: 38 },
    { id: "parking", name: "Free Parking", count: 28 },
    { id: "airport-shuttle", name: "Airport Shuttle", count: 19 },
    { id: "business-center", name: "Business Center", count: 15 },
  ]

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating])
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price per Night</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={25} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
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
                <span className="text-xs text-gray-500">({amenity.count})</span>
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
            {[
              { id: "hotel", name: "Hotel", count: 32 },
              { id: "resort", name: "Resort", count: 8 },
              { id: "apartment", name: "Apartment", count: 15 },
              { id: "guesthouse", name: "Guest House", count: 12 },
            ].map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox id={type.id} />
                <Label htmlFor={type.id} className="flex-1 cursor-pointer text-sm">
                  {type.name}
                </Label>
                <span className="text-xs text-gray-500">({type.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}
