import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Travel destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-grassland-900/60 to-grassland-800/40 dark:from-grassland-950/70 dark:to-grassland-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Gateway to the World</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Discover amazing destinations, book flights, hotels, and create unforgettable memories with Global Bush Travel
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-grassland-600 hover:bg-grassland-700 text-white">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-grassland-900 dark:hover:text-grassland-800"
          >
            Explore Packages
          </Button>
        </div>
      </div>
    </section>
  )
}
