"use client"
import React, { useRef } from 'react';
import InteractiveMap, { InteractiveMapRef } from './InteractiveMap';
import DestinationSidebar from './DestinationSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

const TravelExplorer = () => {
  const mapRef = useRef<InteractiveMapRef>(null);
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleDestinationClick = (destinationId: number) => {
    if (isMobile) {
      router.push(`/explore/recommendations?id=${destinationId}`);
    } else {
      mapRef.current?.highlightDestination(destinationId);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Where will you go?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover amazing destinations around the world with the best flight prices
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 pb-12 ">
        <div className={
          isMobile
            ? 'grid grid-cols-1 gap-6'
            : 'grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:grid-cols-3 2xl:gap-8 '
        }>
          {/* Map Section (hidden on mobile) */}
          {!isMobile && (
            <div className="xl:col-span-2 md:col-span-1 relative " style={{zIndex:0}}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{zIndex:0}}>
                <InteractiveMap 
                  ref={mapRef}
                  onDestinationClick={handleDestinationClick}
                />
                <div className="p-4 bg-gray-50 border-t">
                  <p className="text-sm text-gray-600 text-center">
                    Estimated lowest prices for flights found within the last 10 days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className={isMobile ? '' : 'xl:col-span-1 md:col-span-1 '}>
            <DestinationSidebar onDestinationClick={handleDestinationClick} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {/* <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Experience the TravelTank difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <img src="/svg/BestPrices.svg" alt="best prices" className='className="w-8 h-8 bg-red-500 rounded-full'/>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-center">
                Find the lowest prices from hundreds of airlines and travel sites
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <img src="/svg/EasyBooking.svg" alt="easy booking" className="w-8 h-8 bg-teal-500 rounded-full"></img>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-center">
                Simple and secure booking process with instant confirmation
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <img src="/svg/Support.svg" alt="24/7 support" className="w-8 h-8 bg-blue-500 rounded-full"></img>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-center">
                Get help whenever you need it with our dedicated support team
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TravelExplorer;
