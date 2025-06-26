import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { SearchTabs } from "./search-tabs";

export function HeroSection() {
  return (
    <section
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="hero-section relative min-h-[600px] px-20 py-10 max-lg:px-10 max-lg:py-5 flex items-center justify-center overflow-hidden bg-green-700"
    >
      <SearchTabs />
    </section>
  );
}
