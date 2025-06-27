import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Shield, Users } from "lucide-react"

const visaServices = [
  {
    icon: FileText,
    title: "Document Preparation",
    description: "We help you prepare and organize all required documents for your visa application.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Our experienced team ensures your application is processed quickly and efficiently.",
  },
  {
    icon: Shield,
    title: "Secure Handling",
    description: "Your personal information and documents are handled with the utmost security.",
  },
  {
    icon: Users,
    title: "Expert Consultation",
    description: "Get personalized advice from our visa experts throughout the process.",
  },
]

export function VisaServicesContent() {
  return (
    <div className="space-y-8">
      {/* Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visaServices.map((service, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <service.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visa Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Start Your Visa Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Ready to apply for your visa?</h3>
            <p className="text-gray-600 mb-6">
              Our visa experts will guide you through the entire process, from document preparation to submission. Get
              started today and let us handle the complexities for you.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
