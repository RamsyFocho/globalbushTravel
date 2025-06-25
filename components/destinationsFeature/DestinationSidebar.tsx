import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from "framer-motion";


const destinationCategories = [
  {
    id: 1,
    title: 'Romantic Escapes',
    subtitle: 'from ₦2,041,310',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=250&fit=crop',
    description: 'Perfect destinations for couples seeking romance and intimacy',
    destinationId: 3 // Paris
  },
  {
    id: 2,
    title: 'Family Friendly',
    subtitle: 'from ₦944,643',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop',
    description: 'Fun-filled destinations perfect for family adventures',
    destinationId: 9 // Mumbai
  },
  {
    id: 3,
    title: 'Beautiful Beaches',
    subtitle: 'from ₦1,443,790',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=250&fit=crop',
    description: 'Pristine beaches and crystal clear waters await',
    destinationId: 5 // Dubai
  },
  {
    id: 4,
    title: 'African Getaways',
    subtitle: 'from ₦811,939',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=250&fit=crop',
    description: 'Explore the rich culture and wildlife of Africa',
    destinationId: 10 // Lagos
  }
];

interface DestinationSidebarProps {
  onDestinationClick?: (destinationId: number) => void;
}

const DestinationSidebar = ({ onDestinationClick }: DestinationSidebarProps) => {
  const handleCategoryClick = (destinationId: number) => {
    onDestinationClick?.(destinationId);
  };

  return (
    <div className="w-full max-w-full sm:max-w-md xl:max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Explore destinations
          </h2>
          <p className="text-gray-600">From Douala</p>
        </div>
        <ArrowRight className="text-teal-600 w-6 h-6" />
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 xl:gap-4 w-full ">
        {destinationCategories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ y: -3 }}
            onClick={() => handleCategoryClick(category.destinationId)}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group 2xl:w-[15rem]"
          >
            <div className="relative h-40 overflow-hidden ">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-white font-semibold text-lg">
                  {category.title}
                </h3>
                <p className="text-white/90 text-sm">{category.subtitle}</p>
              </div>
            </div>
            <div className="p-4">
              {/* <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p> */}
              <button className="mt-3 text-teal-600 font-medium hover:text-teal-700 transition-colors flex items-center gap-1">
                Explore destinations
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      {/* <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
        <p className="text-teal-100 mb-4">
          Find the best deals on flights to your dream destination
        </p>
        <button className="bg-white text-teal-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Search Flights
        </button>
      </div> */}
    </div>
  );
};

export default DestinationSidebar;
