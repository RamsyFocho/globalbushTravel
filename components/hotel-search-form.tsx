"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

export function HotelSearchForm() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [rooms, setRooms] = useState("1")
  const [guests, setGuests] = useState("2")
  const [destination, setDestination] = useState("")

  const handleSearch = () => {
    if (!destination) {
      toast.error("Please enter a destination")
      return
    }
    if (!checkIn) {
      toast.error("Please select check-in date")
      return
    }
    if (!checkOut) {
      toast.error("Please select check-out date")
      return
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date")
      return
    }

    toast.success("Searching for hotels...")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Destination */}
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="City, hotel name, or landmark"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label>Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-12", !checkIn && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label>Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-12", !checkOut && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Rooms & Guests */}
        <div className="space-y-2">
          <Label>Rooms & Guests</Label>
          <div className="flex space-x-2">
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger className="flex-1 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Room{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="flex-1 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Guest{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button size="lg" className="w-full md:w-auto bg-grassland-600 hover:bg-grassland-700" onClick={handleSearch}>
        <Search className="mr-2 h-5 w-5" />
        Search Hotels
      </Button>
    </div>
  )
}
