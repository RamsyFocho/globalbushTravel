"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Douala,Cameroon",
    rating: 5,
    comment:
      "Global Bush Travel made our honeymoon to Dubai absolutely perfect. The booking process was smooth and their customer service was exceptional.",
    avatar: "/avatar1.jpg", // Replace with your image paths
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Accra, Ghana",
    rating: 5,
    comment:
      "I've used Global Bush Travel for multiple business trips. They always find the best deals and handle all the details professionally.",
    avatar: "/avatar2.jpg",
  },
  {
    id: 3,
    name: "Amina Hassan",
    location: "Abuja, Nigeria",
    rating: 5,
    comment:
      "The visa assistance service saved me so much time and stress. They guided me through every step of the process.",
    avatar: "/avatar3.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-purple-600">Thousands</span> of
            Travelers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-0"
            >
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <Quote className="h-6 w-6 text-purple-200 mb-4" />

                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "{testimonial.comment}"
                </p>

                <div className="flex items-center space-x-4">
                  <div className="relative h-14 w-14">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
            Read More Reviews
          </button>
        </div>
      </div>
    </section>
  );
}
