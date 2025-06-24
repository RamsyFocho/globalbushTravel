import { Shield, Clock, Award, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description:
      "Your personal and payment information is always protected with industry-leading security.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any queries.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description:
      "We guarantee the best prices on flights, hotels, and packages. Find it cheaper? We'll match it.",
  },
  {
    icon: Headphones,
    title: "Expert Travel Advice",
    description:
      "Get personalized recommendations from our experienced travel consultants.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="text-purple-600">Global Bush Travel</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to making your travel experience seamless, secure,
            and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center border border-gray-100 hover:border-purple-100 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-5 mx-auto group-hover:bg-purple-600 transition-colors">
                <feature.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
