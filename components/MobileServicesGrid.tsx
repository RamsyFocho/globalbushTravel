import React from 'react';
import Link from 'next/link';
import { 
  Plane, 
  Building2, 
  Car, 
  Home, 
  Briefcase, 
  Calendar 
} from 'lucide-react';

const MobileServicesGrid = () => {
  const services = [
    {
      id: 'flight',
      title: 'Flights',
      icon: Plane,
      href: '/flights',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'stays',
      title: 'Stays',
      icon: Building2,
      href: '/hotels',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'rides',
      title: 'Rides',
      icon: Car,
      href: '/rides',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'property',
      title: 'List Your Property',
      icon: Home,
      href: '/list-property',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'business',
      title: 'Business Travels',
      icon: Briefcase,
      href: '/business-travel',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'bookings',
      title: 'Manage My Bookings',
      icon: Calendar,
      href: '/my-bookings',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <section className="block md:hidden px-1 py-6 bg-transparent w-full rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-3 gap-2">
        {services.map((service) => {
          const IconComponent = service.icon;
          
          return (
            <Link
              key={service.id}
              href={service.href}
              className="group"
            >
              <div className={`
                ${service.bgColor} 
                rounded-2xl p-4 h-[9rem] w-[full]]
                shadow-lg
                flex flex-col items-center justify-center 
                transition-all duration-200 
                group-hover:scale-105 
                group-hover:shadow-lg 
                group-active:scale-95
                border border-gray-100
              `}>
                <IconComponent 
                  className={`${service.iconColor} w-[3rem] h-[3rem] mb-2`}
                  strokeWidth={1.5}
                />
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {service.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MobileServicesGrid;