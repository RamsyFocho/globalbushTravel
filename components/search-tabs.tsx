"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightSearchForm } from "@/components/flight-search-form"
import { HotelSearchForm } from "@/components/hotel-search-form"
import { PackageSearchForm } from "@/components/package-search-form"
import { TransferSearchForm } from "@/components/transfer-search-form"
import { Plane, Building, Package, Car } from "lucide-react"

export function SearchTabs() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-grassland-100">
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-grassland-50">
          <TabsTrigger
            value="flights"
            className="flex items-center gap-2 data-[state=active]:bg-grassland-600 data-[state=active]:text-white"
          >
            <Plane className="h-4 w-4" />
            Flights
          </TabsTrigger>
          <TabsTrigger
            value="hotels"
            className="flex items-center gap-2 data-[state=active]:bg-grassland-600 data-[state=active]:text-white"
          >
            <Building className="h-4 w-4" />
            Hotels
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            className="flex items-center gap-2 data-[state=active]:bg-grassland-600 data-[state=active]:text-white"
          >
            <Package className="h-4 w-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger
            value="transfers"
            className="flex items-center gap-2 data-[state=active]:bg-grassland-600 data-[state=active]:text-white"
          >
            <Car className="h-4 w-4" />
            Transfers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <FlightSearchForm />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelSearchForm />
        </TabsContent>

        <TabsContent value="packages">
          <PackageSearchForm />
        </TabsContent>

        <TabsContent value="transfers">
          <TransferSearchForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
