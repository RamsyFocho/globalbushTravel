"use client"
import { Bed, Calendar, LucideIcon, Plane, Umbrella } from "lucide-react";
import React, { useState } from "react";
import TravelSearch from "./TravelSearch";
import FlightSearchForm from "./TravelSearch";
import SearchForm from "./TravelSearch";
import HotelSearchForm from "./HotelSearchForm";
import HolidaysSearchForm from "./HolidaysSearchForm";



const Category = ({icon,label,styles,buttonBgColor,handelCategory} : {icon : LucideIcon,label : string, styles :string, buttonBgColor: string,handelCategory : (value:string) => void}) => {
    const Icon = icon
  return (
    <li className={`${styles}`}>
      {" "}
      <button onClick={() => handelCategory(label)} className={`py-[9px]  shadow-lg px-[25px] max-md:py-[20px]  max-md:px-[20px] ${buttonBgColor} rounded-full flex gap-2`}>
        <span>
          <Icon/>
        </span>{" "}
        <span className="max-md:hidden uppercase font-bold">{label}</span>
      </button>
    </li>
  );
};

export default function HeroSection() {
  const [category, setCategory] = useState<string>("flights");
  const categories = [
    {
        icon : Plane,
        label : "flights",
        styles : "",
        buttonBgColor : "bg-white"
    },
    {
         icon : Bed,
        label : "hotels",
        styles : "mx-10 max-md:mx-5 font-semibold",
        buttonBgColor : "bg-green-900 text-white"
    },
    {
         icon : Umbrella,
        label : "holidays",
        styles : "",
        buttonBgColor : "bg-green-900 text-white"
    }
]
  return (
    <div className="bg-gray-600">
      <div className="hero-section container w-screen border-b ">
        <div className="w-full my-0 mx-auto">
          <div className="content flex justify-between max-md:justify-center">
            <div className="w-[80%] max-lg:w-full mb-[70px]">
              <div className="max-md:hidden">
                <h1 className="mt-[70px] mb-6  p-[0 0 4px] text-[36px] font-black text-white">
                  Find and book cheap flights.
                </h1>
              </div>
              <div className="mb-[40px] max-md:mt-14">
                <ul className="flex flex-wrap max-md:justify-center">
                    {
                        categories.map((e) => <Category key={e.label} handelCategory={setCategory} buttonBgColor={e.buttonBgColor} label={e.label} styles={e.styles} icon={e.icon}/>)
                    }
                </ul>
              </div>
            
                  {category == "flights"? <SearchForm /> : category == "hotels"? <HotelSearchForm /> : <HolidaysSearchForm />}
                  
                </div>
              </div>
            </div>
            <div className="w-[20%] max-lg:hidden"></div>
          </div>
        </div>
  );
}
