"use client";
import React, { use, useState } from "react";
import { Calendar, Users, Repeat2, Search } from "lucide-react";


const HotelSearchForm: React.FC = () => {
  const [leavingFrom, setLeavingFrom] = useState<string>(
    "Where would you like to stay?"
  );
  const flightCategories = [
   'return','one-way', 'multi-city'
  ]
  const [category,setCategory] = useState<string>("return");

  const [goingTo, setGoingTo] = useState<string>("City, airport or place");
  const [departingReturning, setDepartingReturning] = useState<string>(
    "Departing - Returning"
  );
  const [passengersClass, setPassengersClass] =
    useState<string>("1 Adult · Economy");

  // Function to swap "Leaving from" and "Going to" placeholders
  const handleSwap = (): void => {
    setLeavingFrom(goingTo);
    setGoingTo(leavingFrom);
  };

  return (
    <div>
      <div>
       <div className="flex gap-6 text-white pb-5 pl-[27px]">
          </div>
        <div className="bg-white lg:rounded-full max-lg:gap-2 lg:flex-row  rounded-md  shadow-lg flex flex-col lg:items-center justify-between p-2 space-y-2 md:space-y-0 lg:space-x-2 w-full max-w-5xl">
          {/* Leaving From */}
          <div className="flex-1 max-lg:border max-lg:rounded-md min-w-0 px-4 py-2 flex flex-col justify-center rounded-full md:border-r border-gray-200">
            <label
              htmlFor="leavingFrom"
              className="text-gray-600 text-sm font-semibold mb-1"
            >
              Leaving from
            </label>
            <input
              id="leavingFrom"
              type="text"
              className="w-full text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              placeholder={leavingFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLeavingFrom(e.target.placeholder)
              }
            />
          </div>

          {/* Swap Button */}

        

          {/* When? */}
          <div className="flex-1 max-lg:border max-lg:rounded-md min-w-0 px-4 py-2 flex flex-col justify-center rounded-full md:border-r border-gray-200">
            <label
              htmlFor="when"
              className="text-gray-600 text-sm font-semibold mb-1"
            >
              When?
            </label>
            <div className="flex items-center">
              <Calendar size={20} className="text-gray-500 mr-2" />
              <input
                id="when"
                type="text"
                className="w-full text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                placeholder={departingReturning}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDepartingReturning(e.target.placeholder)
                }
              />
            </div>
          </div>

          {/* Passengers & Class */}
          <div className="flex-1 min-w-0 px-4 max-lg:border max-lg:rounded-md py-2 flex flex-col justify-center rounded-full">
            <label
              htmlFor="passengers"
              className="text-gray-600 text-sm font-semibold mb-1"
            >
              Passengers & class
            </label>
            <div className="flex items-center">
              <Users size={20} className="text-gray-500 mr-2" />
              <input
                id="passengers"
                type="text"
                className="w-full text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                placeholder={passengersClass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassengersClass(e.target.placeholder)
                }
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            className="flex-shrink-0 bg-pink-500  hover:bg-pink-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 focus:outline-none"
            aria-label="Search flights"
          >
            <Search size={24} className="text-center" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchForm;
