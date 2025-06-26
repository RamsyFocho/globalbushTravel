"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, ArrowLeftRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { PassengerSelector } from "@/components/passenger-selector"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { toast } from "react-toastify"
import type { LocationSuggestion } from "@/lib/api/flight-service"

interface FlightSearchFormProps {
  onSearch?: (params: any) => void
  initialValues?: any
  className?: string
}

const cabinClassOptions = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
]

export function FlightSearchForm({ onSearch, initialValues, className = "" }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState(initialValues?.tripType || "round-trip")
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    initialValues?.departureDate ? new Date(initialValues.departureDate) : undefined,
  )
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    initialValues?.returnDate ? new Date(initialValues.returnDate) : undefined,
  )
  const [passengers, setPassengers] = useState(
    initialValues?.passengers
      ? { adults: initialValues.passengers, children: 0, infants: 0 }
      : { adults: 1, children: 0, infants: 0 },
  )
  const [from, setFrom] = useState(initialValues?.from || "")
  const [to, setTo] = useState(initialValues?.to || "")
  const [fromLocation, setFromLocation] = useState<LocationSuggestion | null>(null)
  const [toLocation, setToLocation] = useState<LocationSuggestion | null>(null)
  const [cabinClass, setCabinClass] = useState(initialValues?.cabinClass || "economy")

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setTripType(initialValues.tripType || "round-trip")
      setFrom(initialValues.from || "")
      setTo(initialValues.to || "")
      setDepartureDate(initialValues.departureDate ? new Date(initialValues.departureDate) : undefined)
      setReturnDate(initialValues.returnDate ? new Date(initialValues.returnDate) : undefined)
      setPassengers(
        initialValues.passengers
          ? { adults: initialValues.passengers, children: 0, infants: 0 }
          : { adults: 1, children: 0, infants: 0 },
      )
      setCabinClass(initialValues.cabinClass || "economy")
    }
  }, [initialValues])

  const handleSearch = () => {
    if (!from || !to) {
      toast.error("Please select departure and destination cities")
      return
    }
    if (!departureDate) {
      toast.error("Please select a departure date")
      return
    }
    if (tripType === "round-trip" && !returnDate) {
      toast.error("Please select a return date")
      return
    }

    const searchParams = {
      from: fromLocation?.iata_code || from,
      to: toLocation?.iata_code || to,
      fromCity: fromLocation?.city_name || from,
      toCity: toLocation?.city_name || to,
      departureDate: departureDate ? format(departureDate, "yyyy-MM-dd") : "",
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : "",
      passengers: passengers.adults + passengers.children + passengers.infants,
      tripType,
      cabinClass,
    }

    if (onSearch) {
      onSearch(searchParams)
      toast.success("Searching for flights...")
    } else {
      // Navigate to flights page with params
      const urlParams = new URLSearchParams(searchParams as any)
      window.location.href = `/flights?${urlParams.toString()}`
    }
  }

  const swapCities = () => {
    const tempFrom = from
    const tempFromLocation = fromLocation

    setFrom(to)
    setFromLocation(toLocation)
    setTo(tempFrom)
    setToLocation(tempFromLocation)
  }

  const handleFromChange = (value: string, location?: LocationSuggestion) => {
    setFrom(value)
    setFromLocation(location || null)
  }

  const handleToChange = (value: string, location?: LocationSuggestion) => {
    setTo(value)
    setToLocation(location || null)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Trip Type */}
      <RadioGroup value={tripType} onValueChange={setTripType} className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="round-trip" id="round-trip" />
          <Label htmlFor="round-trip" className="text-gray-900 dark:text-gray-100">
            Round Trip
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="one-way" id="one-way" />
          <Label htmlFor="one-way" className="text-gray-900 dark:text-gray-100">
            One Way
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="multi-city" id="multi-city" />
          <Label htmlFor="multi-city" className="text-gray-900 dark:text-gray-100">
            Multi City
          </Label>
        </div>
      </RadioGroup>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* From */}
        <div className="lg:col-span-2">
          <LocationAutocomplete
            id="from"
            label="From"
            placeholder="Departure city or airport"
            value={from}
            onChange={handleFromChange}
          />
        </div>

        {/* Swap Button */}
        <div className="hidden lg:flex items-end justify-center pb-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swapCities}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="lg:col-span-2">
          <LocationAutocomplete
            id="to"
            label="To"
            placeholder="Destination city or airport"
            value={to}
            onChange={handleToChange}
          />
        </div>

        {/* Departure Date */}
        <div className="space-y-2">
          <Label className="text-gray-900 dark:text-gray-100">Departure</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                  !departureDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
              <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-100">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                    !returnDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
                <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Passengers and Cabin Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passengers */}
        <div>
          {/* <Label className="text-gray-900 dark:text-gray-100 mb-2 block">Passengers</Label> */}
          <PassengerSelector value={passengers} onChange={setPassengers} />
        </div>

        {/* Cabin Class */}
        <div className="space-y-2">
          <Label className="text-gray-900 dark:text-gray-100">Cabin Class</Label>
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select cabin class" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {cabinClassOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        size="lg"
        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
        onClick={handleSearch}
      >
        <Search className="mr-2 h-5 w-5" />
        Search Flights
      </Button>
    </div>
  )
}
