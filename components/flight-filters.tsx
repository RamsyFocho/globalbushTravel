"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function FlightFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedStops, setSelectedStops] = useState<string[]>([])

  const airlines = [
    { id: "emirates", name: "Emirates", count: 12 },
    { id: "british-airways", name: "British Airways", count: 8 },
    { id: "turkish-airlines", name: "Turkish Airlines", count: 15 },
    { id: "lufthansa", name: "Lufthansa", count: 6 },
    { id: "air-france", name: "Air France", count: 9 },
  ]

  const stops = [
    { id: "direct", name: "Direct", count: 5 },
    { id: "1-stop", name: "1 Stop", count: 25 },
    { id: "2-stops", name: "2+ Stops", count: 12 },
  ]

  const handleAirlineChange = (airlineId: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airlineId])
    } else {
      setSelectedAirlines(selectedAirlines.filter((id) => id !== airlineId))
    }
  }

  const handleStopsChange = (stopId: string, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stopId])
    } else {
      setSelectedStops(selectedStops.filter((id) => id !== stopId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Airlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Airlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {airlines.map((airline) => (
              <div key={airline.id} className="flex items-center space-x-2">
                <Checkbox
                  id={airline.id}
                  checked={selectedAirlines.includes(airline.id)}
                  onCheckedChange={(checked) => handleAirlineChange(airline.id, checked as boolean)}
                />
                <Label htmlFor={airline.id} className="flex-1 cursor-pointer">
                  {airline.name}
                </Label>
                <span className="text-sm text-gray-500">({airline.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stops */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center space-x-2">
                <Checkbox
                  id={stop.id}
                  checked={selectedStops.includes(stop.id)}
                  onCheckedChange={(checked) => handleStopsChange(stop.id, checked as boolean)}
                />
                <Label htmlFor={stop.id} className="flex-1 cursor-pointer">
                  {stop.name}
                </Label>
                <span className="text-sm text-gray-500">({stop.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departure Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Departure Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium">Morning</div>
              <div className="text-xs text-gray-500">6AM - 12PM</div>
            </div>
            <div className="text-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium">Afternoon</div>
              <div className="text-xs text-gray-500">12PM - 6PM</div>
            </div>
            <div className="text-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium">Evening</div>
              <div className="text-xs text-gray-500">6PM - 12AM</div>
            </div>
            <div className="text-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium">Night</div>
              <div className="text-xs text-gray-500">12AM - 6AM</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}
