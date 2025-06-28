import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SearchTabs } from "./search-tabs";
import MobileServicesGrid from "./MobileServicesGrid";
export function HeroSection() {
  return (
    <section
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full p-0 relative min-h-[450px] md:min-h-[600px] md:px-20 md:py-10 max-lg:px-10 max-lg:py-5 flex items-center justify-start md:justify-center overflow-hidden bg-purple-700"
    >
      {/* Purple transparent overlay */}
      <div className="absolute inset-0 bg-purple-700 bg-opacity-60 pointer-events-none z-0" />
      {/* Content container */}
       <div className="absolute top-8 left-0 md:block w-full z-10 rounded-lg bg-transparent bg-opacity-90 shadow-lg backdrop-blur-md h-[fit] md:mx-auto">
       <SearchTabs />
        <MobileServicesGrid />
      </div>
    </section>
  );
}
