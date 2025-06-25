"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import img1 from "@/assets/img1.jpg";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/img3.jpg";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.jpg";
import img7 from "@/assets/img7.jpg";
import img8 from "@/assets/img8.jpg";
import img9 from "@/assets/img9.jpg";
import img10 from "@/assets/img10.jpeg";
import img11 from "@/assets/img11.jpg";
import img12 from "@/assets/img12.jpg";
import img13 from "@/assets/img13.jpg";

interface FlightDeal {
  id: number;
  country: string;
  city: string;
  price: string;
  image: any; // Using 'any' for imported images
}

const flightDeals: FlightDeal[] = [
  {
    id: 1,
    country: "Turkey",
    city: "Istanbul",
    price: "CFA870,943",
    image: img1,
  },
  {
    id: 2,
    country: "Cyprus",
    city: "Cyprus, Ercan",
    price: "CFA1,346,610",
    image: img2,
  },
  {
    id: 3,
    country: "Saudi Arabia",
    city: "Jeddah",
    price: "CFA1,014,180",
    image: img3,
  },
  {
    id: 4,
    country: "United Arab Emirates",
    city: "Dubai",
    price: "CFA872,744",
    image: img4,
  },
  {
    id: 5,
    country: "France",
    city: "Paris",
    price: "CFA1,250,000",
    image: img5,
  },
  {
    id: 6,
    country: "USA",
    city: "New York",
    price: "CFA1,850,000",
    image: img6,
  },
  {
    id: 7,
    country: "Maldives",
    city: "Malé",
    price: "CFA2,150,000",
    image: img7,
  },
  {
    id: 8,
    country: "South Africa",
    city: "Cape Town",
    price: "CFA1,450,000",
    image: img8,
  },
  {
    id: 9,
    country: "China",
    city: "Beijing",
    price: "CFA1,750,000",
    image: img9,
  },
];

interface PopularDestination {
  name: string;
  image: any; // Using 'any' for imported images
}

const popularDestinations: PopularDestination[] = [
  { name: "Dubai", image: img4 },
  { name: "Paris", image: img5 },
  { name: "New York", image: img6 },
  { name: "Maldives", image: img7 },
  { name: "Cape Town", image: img8 },
];

export function FeaturedDestinations() {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // Adjust items per page and mobile detection based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      if (mobile) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (
      newPage >= 0 &&
      newPage <= Math.ceil(flightDeals.length / itemsPerPage) - 1
    ) {
      setPage([newPage, newDirection]);
    }
  };

  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Flight Deals Section */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Our best flight deals from Cameroon
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            The lowest fares we've found this week
          </p>
        </div>

        <div className="relative h-[22rem] sm:h-[28rem] mb-12 md:mb-20">
          <button
            onClick={() => paginate(-1)}
            disabled={page === 0}
            className={`absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-purple-50 transition-all ${
              page === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous destinations"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
          </button>

          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-6 md:px-12"
              >
                {flightDeals
                  .slice(
                    page * itemsPerPage,
                    page * itemsPerPage + itemsPerPage
                  )
                  .map((deal) => (
                    <motion.div
                      key={deal.id}
                      whileHover={{ scale: isMobile ? 1 : 1.03 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="relative h-full rounded-xl overflow-hidden shadow-lg"
                    >
                      <Image
                        src={deal.image}
                        alt={`${deal.city} skyline`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                        <p className="text-xs sm:text-sm mb-1">
                          {deal.country}
                        </p>
                        <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                          {deal.city}
                        </h3>
                        <p className="text-base sm:text-xl font-bold text-purple-300">
                          from {deal.price}
                        </p>
                        <Button
                          asChild
                          className="mt-2 sm:mt-4 bg-purple-600 hover:bg-purple-700 text-white w-fit text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
                        >
                          <Link href={`/flights?destination=${deal.city}`}>
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => paginate(1)}
            disabled={
              page >= Math.floor((flightDeals.length - 1) / itemsPerPage)
            }
            className={`absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-purple-50 transition-all ${
              page >= Math.floor((flightDeals.length - 1) / itemsPerPage)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Next destinations"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
          </button>
        </div>

        <div className="flex justify-center mt-6 mb-12 md:mb-16">
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg transition-transform hover:scale-105"
          >
            <Link href="/flights">View All Flight Deals</Link>
          </Button>
        </div>

        {/* "Where will you go?" Section */}
        <div className="mt-12 md:mt-20">
          {/* Heading Section - Now above both map and destinations */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Where will you go?
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 relative">
            {/* Map Section - Left Side */}
            <div className="lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src="/sample-map.jpg"
                alt="Travel destinations map"
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
              {/* "From Douala" positioned at bottom of map */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/90 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  From Douala
                </p>
              </div>
            </div>

            {/* Destinations Grid - Right Side */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
              {/* "Explore destinations" link positioned absolutely over images */}
              <Link
                href="/destinations"
                className="absolute -top-7 right-0 text-sm sm:text-base text-purple-600 hover:text-purple-800 font-medium inline-flex items-center z-10"
              >
                Explore destinations{" "}
                <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              {[
                {
                  category: "Romantic Escapes",
                  price: "M1,170,600",
                  image: img10,
                },
                {
                  category: "Family Friendly",
                  price: "M1,643,570",
                  image: img11,
                },
                {
                  category: "Beautiful Beaches",
                  price: "M1,817,760",
                  image: img12,
                },
                {
                  category: "African Getaways",
                  price: "M1,477,040",
                  image: img13,
                },
              ].map((destination) => (
                <motion.div
                  key={destination.category}
                  whileHover={{ y: isMobile ? 0 : -5 }}
                  className="relative h-40 sm:h-48 md:h-56 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={destination.image}
                    alt={destination.category}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 sm:p-4">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                      {destination.category}
                    </h3>
                    <p className="text-purple-300 font-semibold text-xs sm:text-sm md:text-base">
                      from {destination.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
