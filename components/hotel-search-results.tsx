import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Utensils, Waves } from "lucide-react"
import Image from "next/image"

const hotels = [
  {
    id: "1",
    name: "Grand Luxury Hotel Lagos",
    address: "123 Victoria Island, Lagos",
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
  },
  {
    id: "2",
    name: "Business Center Hotel",
    address: "456 Ikoyi Business District, Lagos",
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
  },
  {
    id: "3",
    name: "Boutique Comfort Inn",
    address: "789 Mainland Lagos",
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
  },
]

const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Pool: Waves,
  Restaurant: Utensils,
  Parking: Car,
}

export function HotelSearchResults() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{hotels.length} hotels found</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="border rounded px-3 py-1 text-sm">
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
            <option>Guest Rating</option>
            <option>Distance</option>
          </select>
        </div>
      </div>

      {hotels.map((hotel) => (
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
              </div>

              {/* Hotel Details */}
              <div className="lg:col-span-5 p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                  <div className="flex items-center space-x-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{hotel.address}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
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
                  <span className="text-sm text-gray-500">({hotel.reviews.count} reviews)</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 4).map((amenity) => {
                    const IconComponent = amenityIcons[amenity]
                    return (
                      <div key={amenity} className="flex items-center space-x-1 text-xs text-gray-600">
                        {IconComponent && <IconComponent className="h-3 w-3" />}
                        <span>{amenity}</span>
                      </div>
                    )
                  })}
                  {hotel.amenities.length > 4 && (
                    <span className="text-xs text-blue-600">+{hotel.amenities.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Price and Book */}
              <div className="lg:col-span-3 p-6 border-l bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="text-right mb-4">
                    <p className="text-2xl font-bold text-grassland-600">${hotel.price}</p>
                    <p className="text-sm text-gray-500">per night</p>
                    <p className="text-xs text-gray-500">includes taxes & fees</p>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-grassland-600 hover:bg-grassland-700">Book Now</Button>
                    <Button
                      variant="outline"
                      className="w-full border-grassland-600 text-grassland-600 hover:bg-grassland-600 hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-green-600 font-medium">Free cancellation</p>
                  <p className="text-xs text-gray-500">until 24 hours before check-in</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
