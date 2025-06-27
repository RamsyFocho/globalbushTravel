import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin } from "lucide-react"

interface Package {
  id: string
  title: string
  destination: string
  duration: string
  price: number
  image: string
  rating: number
  reviews: number
  inclusions: string[]
  description: string
}

interface PackageCardProps {
  package: Package
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
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
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-1 text-gray-500 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{pkg.destination}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{pkg.title}</h3>

        <div className="flex items-center space-x-1 text-gray-500 mb-3">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{pkg.duration}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pkg.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.inclusions.slice(0, 3).map((inclusion) => (
            <Badge key={inclusion} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              {inclusion}
            </Badge>
          ))}
          {pkg.inclusions.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
              +{pkg.inclusions.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-purple-600 text-xl">${pkg.price}</span>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link href={`/packages/${pkg.id}`}>View Details</Link>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">({pkg.reviews} reviews)</p>
      </CardContent>
    </Card>
  )
}
