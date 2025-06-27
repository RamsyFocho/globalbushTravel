import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Clock, Shield } from "lucide-react"

const transferOptions = [
  {
    id: "1",
    type: "Economy Car",
    capacity: "1-3 passengers",
    price: 45,
    duration: "45 mins",
    features: ["Air Conditioning", "Professional Driver", "Meet & Greet"],
    icon: Car,
  },
  {
    id: "2",
    type: "Premium Sedan",
    capacity: "1-3 passengers",
    price: 75,
    duration: "45 mins",
    features: ["Luxury Vehicle", "Professional Driver", "Meet & Greet", "Complimentary Water"],
    icon: Car,
  },
  {
    id: "3",
    type: "SUV/Van",
    capacity: "4-7 passengers",
    price: 95,
    duration: "45 mins",
    features: ["Spacious Vehicle", "Professional Driver", "Meet & Greet", "Extra Luggage Space"],
    icon: Users,
  },
]

export function TransferOptions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transferOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <option.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{option.type}</h3>
                  <p className="text-sm text-gray-600">{option.capacity}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{option.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Insured</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {option.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="mr-1 mb-1 bg-purple-100 text-purple-700">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-purple-600">${option.price}</span>
                  <p className="text-sm text-gray-500">per trip</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Book Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
