import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"

const destinations = [
  {
    id: 1,
    name: "Dubai, UAE",
    image: "/placeholder.svg?height=300&width=400",
    price: "From $899",
    rating: 4.8,
    description: "Experience luxury and adventure in the heart of the Middle East",
  },
  {
    id: 2,
    name: "Paris, France",
    image: "/placeholder.svg?height=300&width=400",
    price: "From $1,299",
    rating: 4.9,
    description: "The city of love and lights awaits your arrival",
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: "/placeholder.svg?height=300&width=400",
    price: "From $1,199",
    rating: 4.7,
    description: "Discover the perfect blend of tradition and modernity",
  },
  {
    id: 4,
    name: "Cape Town, South Africa",
    image: "/placeholder.svg?height=300&width=400",
    price: "From $799",
    rating: 4.6,
    description: "Breathtaking landscapes and rich cultural heritage",
  },
]

export function FeaturedDestinations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular destinations and start planning your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{destination.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-1 text-gray-500 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{destination.name}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-grassland-600">{destination.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-grassland-600 text-grassland-600 hover:bg-grassland-600 hover:text-white"
                  >
                    <Link href={`/destinations/${destination.id}`}>Explore</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/destinations">View All Destinations</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
