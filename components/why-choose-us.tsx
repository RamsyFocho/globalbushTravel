import { Shield, Clock, Award, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your personal and payment information is always protected with industry-leading security.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you with any queries.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "We guarantee the best prices on flights, hotels, and packages. Find it cheaper? We'll match it.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Travel Advice",
    description: "Get personalized recommendations from our experienced travel consultants.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Global Bush Travel?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to making your travel experience seamless, secure, and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-grassland-100 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-grassland-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
