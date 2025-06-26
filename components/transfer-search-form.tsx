"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function TransferSearchForm() {
  const [transferType, setTransferType] = useState("airport-hotel")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [passengers, setPassengers] = useState("2")

  return (
    <div className="space-y-6">
      {/* Transfer Type */}
      <RadioGroup value={transferType} onValueChange={setTransferType} className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="airport-hotel" id="airport-hotel" />
          <Label htmlFor="airport-hotel">Airport to Hotel</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hotel-airport" id="hotel-airport" />
          <Label htmlFor="hotel-airport">Hotel to Airport</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="point-to-point" id="point-to-point" />
          <Label htmlFor="point-to-point">Point to Point</Label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pickup Location */}
        <div className="space-y-2">
          <Label htmlFor="pickup">Pickup Location</Label>
          <Input id="pickup" placeholder="Airport, hotel, or address" />
        </div>

        {/* Drop-off Location */}
        <div className="space-y-2">
          <Label htmlFor="dropoff">Drop-off Location</Label>
          <Input id="dropoff" placeholder="Airport, hotel, or address" />
        </div>

        {/* Pickup Date & Time */}
        <div className="space-y-2">
          <Label>Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !pickupDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {pickupDate ? format(pickupDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <Label>Passengers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Passenger{num > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button size="lg" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
        <Search className="mr-2 h-5 w-5" />
        Search Transfers
      </Button>
    </div>
  )
}
